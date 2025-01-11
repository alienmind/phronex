# Script for local running database & app in docker
ln -sf docker/env.docker .env
docker compose -f docker/docker-compose.yml up -d
