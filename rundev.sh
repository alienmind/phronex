# Script for local running database & app
if [ -f ".env" ]; then
  cp -p .env .env.bak
  RESTORE=1
fi

docker compose -f docker-compose-localhost.yml up -d
pnpm run dev
