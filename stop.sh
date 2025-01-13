# Basic checks
if [ ! -f .secrets ]; then
  echo "Please create a .secrets file based on dot-secrets-example"
  exit 1
fi

export PUBLIC_IP=`curl http://169.254.169.254/latest/meta-data/public-ipv4`

# Inject secrets into docker/env* files to avoid them being uploaded to github
docker/fixenv.sh

# Set up the public IP
#ln -sf docker/.env.prod .env
docker compose -f docker/docker-compose.prod.yml down
