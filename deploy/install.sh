#!/usr/bin/env bash
# Install/refresh the Twinder runtime: systemd --user services + the twinder-deploy CLI.
# Idempotent and sudo-free (except a one-time enable-linger, which it will tell you about).
#
# Prerequisites (see ../DEPLOY.md §8): repo at ~/src/Twinder, Python venv built
# (.venv via `pip install -e .`), Node 20 + frontend built (`npm ci && npm run build`),
# Redis on :6379, and the .env / frontend/.env.local files created (templates in ./env).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

echo "==> twinder-deploy CLI -> ~/.local/bin"
mkdir -p "$HOME/.local/bin"
install -m 0755 "$HERE/bin/twinder-deploy" "$HOME/.local/bin/twinder-deploy"

echo "==> systemd --user units -> ~/.config/systemd/user"
mkdir -p "$HOME/.config/systemd/user"
install -m 0644 "$HERE"/systemd/*.service "$HERE"/systemd/*.timer "$HOME/.config/systemd/user/"

echo "==> deploy target (default: rolling on 'deploy'; existing target preserved)"
mkdir -p "$HOME/.config/twinder-deploy"
[ -f "$HOME/.config/twinder-deploy/target" ] || echo deploy > "$HOME/.config/twinder-deploy/target"

echo "==> linger (survive logout/reboot)"
loginctl enable-linger "$(id -un)" 2>/dev/null \
  || echo "    WARN: could not enable linger non-interactively. Run: sudo loginctl enable-linger $(id -un)"

echo "==> enable + (re)start services"
systemctl --user daemon-reload
systemctl --user enable --now twinder-api.service twinder-web.service twinder-deploy.timer

echo
echo "Done. Verify with:  twinder-deploy status"
echo "Reminder: this does NOT install Redis, the Python venv, the frontend build,"
echo "the Caddy block (deploy/caddy/twindr.Caddyfile), or the .env files (deploy/env/*)."
echo "See ../DEPLOY.md for the full bootstrap."
