# Basic checks
if [ ! -f .secrets ]; then
  echo "Please create a .secrets file based on dot-secrets-example"
  exit 1
fi

#export PUBLIC_IP=`curl http://checkip.amazonaws.com`
export PUBLIC_IP=phronex.alienmind.eu

echo "Detected public ip: $PUBLIC_IP"

# Inject secrets into docker/env* files to avoid them being uploaded to github
docker/fixenv.sh

# Set up the public IP
ln -sf docker/.env.prod .env
docker compose -f docker/docker-compose.prod.yml up -d
