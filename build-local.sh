ln -sf docker/.env.prebuild .env
docker compose -f docker/docker-compose-prebuild.yml up -d
pnpm run build
