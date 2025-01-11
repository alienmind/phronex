# Script for local running database & app
ln -sf docker/env.localhost .env
docker compose -f docker/docker-compose-localhost.yml up -d
pnpm run dev
