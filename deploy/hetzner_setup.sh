#!/usr/bin/env bash
# deploy/hetzner_setup.sh
# Bootstrap ArgoSea on a fresh Hetzner VPS (Ubuntu 24.04).
# Usage: ssh root@<HETZNER_IP> 'bash -s' < deploy/hetzner_setup.sh
set -euo pipefail

REPO_URL="${REPO_URL:-git@github.com:your-org/argosea.git}"
TARGET_DIR="${TARGET_DIR:-/opt/argosea}"

echo "[1/6] Installing Docker and Compose plugin..."
apt-get update
apt-get install -y ca-certificates curl gnupg git ufw
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "[2/6] Firewall: allow SSH + HTTP + HTTPS + API port..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8001/tcp
ufw --force enable

echo "[3/6] Cloning repository..."
mkdir -p "$(dirname "$TARGET_DIR")"
if [ ! -d "$TARGET_DIR/.git" ]; then
    git clone "$REPO_URL" "$TARGET_DIR"
else
    git -C "$TARGET_DIR" pull
fi

cd "$TARGET_DIR"

echo "[4/6] Writing production .env (edit before use)..."
if [ ! -f .env ]; then
    cat > .env <<'EOF'
ARGO_DB_HOST=argosea-db
ARGO_DB_PORT=5432
ARGO_DB_NAME=argosea
ARGO_DB_USER=argosea
ARGO_DB_PASSWORD=changeme
ARGO_MARITIME_API_URL=https://api.example.com/ais
ARGO_MARITIME_API_KEY=REPLACE_ME
ARGO_IBM_TOKEN=REPLACE_ME
ARGO_IBM_BACKEND=ibm_fez
ARGO_MAX_QUBITS=150
EOF
    echo "Created .env — rotate secrets before production."
fi

echo "[5/6] Building and starting the stack..."
docker compose down || true
docker compose up -d --build

echo "[6/6] Status..."
sleep 15
docker compose ps
curl -fsS http://localhost:8001/health || echo "health check failed"

echo "ArgoSea is up on $(hostname)."
