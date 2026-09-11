# ArgoSea Deployment Runbook

## 1. Backend → Hetzner VPS

- SSH into Hetzner (32GB RAM, 600GB disk).
- Install Docker + Docker Compose.
- Clone ArgoSea repo into `/opt/argosea`.
- Create `venv` and install `requirements.txt`.
- Build Docker image: `docker build -t argosea-api .`
- Run container: `docker run -d -p 8000:8000 --env-file .env argosea-api`
- Configure reverse proxy (Nginx or Caddy) with TLS.
- Point DNS: `api.argosea.<domain>` → Hetzner IP.

## 2. Frontend → Vercel Pro

- Push `frontend/` to GitHub repo `argosea-frontend`.
- Connect repo to Vercel Pro.
- Set env var: `NEXT_PUBLIC_API_URL=https://api.argosea.<domain>`.
- Deploy. Vercel auto-builds Next.js 16 with Turbopack.
- Add custom domain: `app.argosea.<domain>`.

## 3. Environment Variables

Backend (`.env`):
- `ARGO_DB_HOST`, `ARGO_DB_PORT`, `ARGO_DB_NAME`, `ARGO_DB_USER`, `ARGO_DB_PASSWORD`
- `ARGO_MARITIME_API_KEY`, `ARGO_MARITIME_API_URL`
- `ARGO_IBM_TOKEN`, `ARGO_IBM_BACKEND=ibm_fez`
- `ARGO_MAX_QUBITS=150`

Frontend (Vercel):
- `NEXT_PUBLIC_API_URL=https://api.argosea.<domain>`

## 4. Verification

- `curl https://api.argosea.<domain>/health`
- Open `https://app.argosea.<domain>` — dashboard should load with live QPU data.

## 5. Security

- Rotate IBM token after deployment.
- Use HTTPS only.
- Restrict CORS to production frontend origin.
