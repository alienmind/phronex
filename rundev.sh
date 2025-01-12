# Basic checks
if [ ! -f .secrets ]; then
  echo "Please create a .secrets file based on dot-secrets-example"
  exit 1
fi

# Inject secrets into docker/env* files to avoid them being uploaded to github
docker/fixenv.sh

# We only need the database and admin
ln -sf docker/.env.localhost .env
docker compose -f docker/docker-compose-localhost.yml up -d

# Run the webapp from pnpm
pnpm run dev