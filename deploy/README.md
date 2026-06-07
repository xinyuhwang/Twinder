# deploy/

The out-of-repo pieces that run Twinder in production, version-controlled so the setup is
reproducible. Full operations guide: [`../DEPLOY.md`](../DEPLOY.md).

```
deploy/
├── install.sh                     # idempotent installer (systemd units + twinder-deploy CLI)
├── bin/
│   └── twinder-deploy             # the git-poll deployer CLI (rolling/pinned, rebuild, hold/resume)
├── systemd/
│   ├── twinder-api.service        # uvicorn backend  -> 127.0.0.1:8000
│   ├── twinder-web.service        # next start frontend -> 127.0.0.1:3001
│   ├── twinder-deploy.service     # oneshot, run by the timer
│   └── twinder-deploy.timer       # polls every 60s
├── caddy/
│   └── twindr.Caddyfile           # reverse-proxy blocks (append to the host's Caddyfile)
└── env/
    ├── backend.env.example        # -> repo-root .env            (gitignored)
    └── frontend.env.local.example # -> frontend/.env.local       (gitignored)
```

## Install / refresh the runtime
After the host prerequisites are in place (venv, frontend build, Redis, `.env` files — see
[`../DEPLOY.md §8`](../DEPLOY.md)):

```bash
bash deploy/install.sh
twinder-deploy status
```

The systemd units are installed as **user** services (no sudo) and run under lingering so
they survive logout and reboot.

## Notes
- Editing a unit or the CLI? Update it here and re-run `deploy/install.sh` (which copies into
  `~/.config/systemd/user` and `~/.local/bin`) so the repo stays the source of truth.
- The Caddy block must be merged into the host Caddyfile by hand (it's shared with the
  Bluesky PDS); see comments in `caddy/twindr.Caddyfile`.
- The `.env*` files hold secrets and are intentionally **not** committed — copy the templates
  in `env/` and fill them in.
