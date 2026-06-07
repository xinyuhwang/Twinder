# Twinder — Deployment & Operations

This document describes how Twinder is deployed on the production droplet, how the
auto/manual deploy system works, and how to operate, troubleshoot, and reproduce it.

> TL;DR
> - **Frontend** (Next.js, prod build) runs on `127.0.0.1:3001`, served at **https://twindr.io**
> - **Backend** (FastAPI/uvicorn) runs on `127.0.0.1:8000`, served at **https://api.twindr.io**
> - Both run as **systemd `--user` services**; **Caddy** terminates TLS and reverse-proxies.
> - A **git-poll deployer** (`twinder-deploy`) tracks a branch and redeploys on new commits.

---

## 1. Architecture

```
                          ┌──────────────────── droplet (DigitalOcean) ────────────────────┐
   Internet ──TLS──▶ Caddy │  :80/:443  (Docker container, host networking, part of /pds)   │
                          │      │                                                          │
        twindr.io ───────┼──────┼──▶ 127.0.0.1:3001   twinder-web   (Next.js `next start`)  │
    www.twindr.io ──301──┘      │                                                          │
    api.twindr.io ──────────────┼──▶ 127.0.0.1:8000   twinder-api   (uvicorn / FastAPI)     │
                          │      └──▶ 127.0.0.1:6379   Redis                                 │
                          │                                                                  │
                          │  (pre-existing, unrelated) Bluesky PDS on :3000 + Caddy on /pds  │
                          └──────────────────────────────────────────────────────────────────┘
```

The droplet also hosts an unrelated **Bluesky PDS** stack (Docker: `pds`, `caddy`,
`watchtower`). Twinder reuses that single Caddy as its TLS front door — there can only be
one process on :80/:443. **Do not use port 3000** (owned by the PDS); the frontend uses 3001.

### Ports
| Port | Bind | Service |
|------|------|---------|
| 80 / 443 | public | Caddy (TLS, HTTP/3) |
| 8000 | 127.0.0.1 | `twinder-api` (uvicorn) |
| 3001 | 127.0.0.1 | `twinder-web` (Next.js) |
| 6379 | 127.0.0.1 | Redis |
| 3000 | * | **PDS — do not touch** |
| 2019 | 127.0.0.1 | Caddy admin API |

---

## 2. Domains, TLS & Caddy routing

DNS (Namecheap) `A` records → droplet IP `143.198.63.205`:
`twindr.io`, `www.twindr.io`, `api.twindr.io`.

Caddy config lives at **`/pds/caddy/etc/caddy/Caddyfile`** (outside this repo). The Twinder
section:

```caddyfile
twindr.io {
	reverse_proxy 127.0.0.1:3001
}

api.twindr.io {
	reverse_proxy 127.0.0.1:8000
}

www.twindr.io {
	redir https://twindr.io{uri} permanent
}
```

Certs are issued automatically by Let's Encrypt (these are normal automatic-TLS blocks,
independent of the PDS's on-demand TLS).

### Reloading Caddy
The Caddy admin API is local and needs **no sudo**:
```bash
curl -X POST http://127.0.0.1:2019/load \
  -H "Content-Type: text/caddyfile" \
  --data-binary @/pds/caddy/etc/caddy/Caddyfile
```
(Equivalent, needs sudo: `sudo docker exec caddy caddy reload --config /etc/caddy/Caddyfile`.)
Reloads are zero-downtime and validate before swapping; the PDS routing is left untouched.

---

## 3. Runtime services (systemd `--user`)

Unit files: `~/.config/systemd/user/`. They run as the `leo` user with **lingering enabled**
(`loginctl enable-linger`) so they survive logout and reboot — **no sudo required** to manage.

| Unit | Purpose |
|------|---------|
| `twinder-api.service` | `uvicorn app.main:app --host 127.0.0.1 --port 8000` (WorkingDirectory = repo root, reads `.env`) |
| `twinder-web.service` | `next start -H 127.0.0.1 -p 3001` (serves the prebuilt `.next`) |
| `twinder-deploy.timer` | fires `twinder-deploy run` every 60s |
| `twinder-deploy.service`| oneshot invoked by the timer |

Common controls (`export XDG_RUNTIME_DIR=/run/user/$(id -u)` if running over a bare SSH command):
```bash
systemctl --user status twinder-api twinder-web
systemctl --user restart twinder-api twinder-web
journalctl --user -u twinder-web -f          # live logs
journalctl --user -u twinder-api -n 100
```

> **Important:** do not run the app by hand in tmux anymore (`uvicorn …`, `next dev`).
> The services own ports 8000/3001; a manual process will collide (`EADDRINUSE`).
> `next dev` behind the public proxy also breaks login (see Troubleshooting).

---

## 4. Configuration (lives OUTSIDE git)

These files are intentionally **not** committed (secrets / environment-specific). A fresh
clone will not have them — recreate them from the templates.

### Backend `~/src/Twinder/.env`
Loaded by pydantic-settings (`env_file=".env"`, relative to WorkingDirectory). Key values:
```
GOOGLE_REDIRECT_URI=https://api.twindr.io/auth/callback   # MUST be the api host
FRONTEND_URL=https://twindr.io                             # used for CORS + OAuth bounce-back
REDIS_URL=redis://localhost:6379
DATABASE_URL=sqlite:///./twinder.db
# plus: GOOGLE_CLIENT_ID/SECRET, JWT_SECRET, ANTHROPIC_API_KEY/OPENAI_API_KEY, LLM_MODEL
```

### Frontend `~/src/Twinder/frontend/.env.local`
```
NEXT_PUBLIC_API_URL=https://api.twindr.io
```
`NEXT_PUBLIC_*` is **inlined at build time** — after changing it you must rebuild the frontend.

### Google OAuth (console)
The OAuth client's **Authorized redirect URI** must include exactly:
```
https://api.twindr.io/auth/callback
```
If the consent screen is in "Testing", add tester emails. The dev-login shortcut
(`POST /auth/dev-login`) works without any of this.

### Other host prerequisites
- **Redis** running on `127.0.0.1:6379` (backend refuses to start without it — `init_redis()`
  is in the lifespan).
- **Node 20** (`/usr/bin/node`) and the frontend's `node_modules`.
- **Python venv** at `~/src/Twinder/.venv` (`pip install -e .`).
- A **2 GB swapfile** (`/swapfile`) — the 2 GB droplet is memory-tight during `next build`.

---

## 5. The deploy system (`twinder-deploy`)

Script: **`~/.local/bin/twinder-deploy`**. A `systemd --user` timer runs it every 60s. It
reads a single **target manifest** and reconciles the checkout to it.

### Target file: `~/.config/twinder-deploy/target`
One line decides *what* is deployed **and** the mode:

| Contents | Mode | Behavior |
|----------|------|----------|
| a **branch** name (e.g. `deploy`) | **rolling** | always deploy HEAD of `origin/<branch>` |
| a **commit SHA** or **tag** | **pinned** | deploy exactly that and stop advancing (rollback/freeze) |

Each tick: `git fetch`, resolve the target to a SHA, compare to the checked-out HEAD, and if
different: `git reset --hard` to it, rebuild only what changed (frontend if `frontend/`
changed, `pip install` if `pyproject.toml` changed), and restart the affected service(s).
A failed build aborts **without** restarting (the old build keeps serving).

> **Activation:** until `origin/deploy` exists, the poller logs "nothing to deploy" and does
> nothing. Create the branch on GitHub (branch off the commit you want live) to turn it on.

### CLI reference
```
twinder-deploy status                 # target, resolved/deployed SHA, mode, hold, worktree, services
twinder-deploy now                    # poll & deploy immediately (don't wait 60s)
twinder-deploy track <branch>         # rolling: follow origin/<branch>
twinder-deploy pin <sha|tag>          # pinned: freeze on a commit/tag (instant rollback)

twinder-deploy rebuild [web|api|all] [--ci]   # manual redeploy of the CURRENT checkout
twinder-deploy restart [web|api|all]          # restart service(s) only, no build

twinder-deploy hold                   # pause the poller (ad-hoc experiments)
twinder-deploy resume                 # re-enable tracking

twinder-deploy logs [n]               # tail the deploy log
```

State files (all under `~/.config/twinder-deploy/`): `target`, `hold` (presence = paused),
`deploy.log`, `deploy.lock` (flock — manual and automatic runs never overlap).

---

## 6. Common operations

### Manual redeploy (no git change)
Use after editing files in place, or to force a fresh build:
```bash
twinder-deploy rebuild web        # npm run build + restart twinder-web
twinder-deploy rebuild web --ci   # clean install (npm ci) first
twinder-deploy rebuild api        # pip install -e . + restart twinder-api
twinder-deploy rebuild all        # both
twinder-deploy restart [web|api|all]   # restart only
```
A restart causes a ~2s blip (Caddy returns 502 while the process rebinds — there is no
hot-reload in prod). This is expected.

### Rollback
```bash
twinder-deploy pin <last-good-sha>    # freeze on a known-good commit within ~1 min
twinder-deploy track deploy           # later: resume rolling
```

### Ad-hoc experiments without the poller clobbering you
The poller reconciles the checkout to the target, which would discard local work. Two layers
of protection:

1. **Automatic:** the poller **refuses to deploy over a dirty working tree** — uncommitted
   edits are safe by default.
2. **Explicit `hold`:** fully pauses the poller — also protects local *commits* (which leave
   the tree clean and would otherwise be reset away).

```bash
twinder-deploy hold                       # freeze the poller
#   ...edit / commit locally...
twinder-deploy rebuild web                # build & run your changes (rebuild ignores hold)
git -C ~/src/Twinder checkout -- .        # done: discard (or commit / stash)
twinder-deploy resume                     # hand control back; reconciles on next tick
```
`twinder-deploy status` always shows the current `hold:` and `worktree:` state. After
`resume`, if the tree is still dirty the poller keeps refusing to clobber until you clean it.

---

## 7. Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| Login stuck on "Signing in…" | The frontend was running as `next dev` behind the proxy; HMR-over-wss fails cross-origin and wedges the dev client. **Run the prod build** (`next start`, which the systemd unit does). |
| `502` from `twindr.io`/`api.twindr.io` | The upstream isn't up: service still booting (~2s after restart), crashed, or not listening on 3001/8000. Check `systemctl --user status` + `journalctl --user`. |
| Backend won't start | Redis not reachable on `:6379` — `init_redis()` raises in the lifespan. Start Redis. |
| `redirect_uri_mismatch` on Google login | `GOOGLE_REDIRECT_URI` must be `https://api.twindr.io/auth/callback` **and** registered in the Google console; restart `twinder-api` after editing `.env`. |
| Frontend calls `localhost:8000` | `NEXT_PUBLIC_API_URL` missing at **build** time. Set it in `.env.local` and `twinder-deploy rebuild web`. |
| `next build` OOMs | Ensure the `/swapfile` is active (`swapon --show`). |
| Cert won't issue for a new host | DNS must point at the droplet first (Caddy ACME needs it to resolve). |

Logs: `twinder-deploy logs`, `journalctl --user -u twinder-{api,web}`, Caddy via
`sudo docker logs caddy`.

---

## 8. Bootstrapping a fresh host (reference)

1. Install Node 20, create the Python venv (`python3 -m venv .venv && .venv/bin/pip install -e .`).
2. Start Redis on `127.0.0.1:6379`.
3. Create `.env` and `frontend/.env.local` (Section 4); add the Google redirect URI.
4. Build the frontend: `cd frontend && npm ci && npm run build`.
5. Add the Caddy blocks (Section 2) and reload Caddy.
6. Install the `~/.config/systemd/user/` units + `~/.local/bin/twinder-deploy`, then:
   ```bash
   loginctl enable-linger
   systemctl --user daemon-reload
   systemctl --user enable --now twinder-api twinder-web twinder-deploy.timer
   ```
7. (optional) `echo deploy > ~/.config/twinder-deploy/target` and create `origin/deploy` to
   enable rolling auto-deploys.

> Note: the systemd units, the `twinder-deploy` script, the Caddyfile, and the `.env*` files
> live outside this repo. Keep this document in sync if those change.
