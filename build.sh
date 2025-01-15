# Basic checks
if [ ! -f .secrets ]; then
  echo "Please create a .secrets file based on dot-secrets-example"
  exit 1
fi

# Inject secrets into docker/env* files to avoid them being uploaded to github
docker/fixenv.sh

# Quick & dirty hack for dockerfile building
# pnpm build will not run from inside a builder image because it depends on postgresql being up
# It seems not to be possible to set up a build network for building images
# Therefore I just open a port on 5432 and listen
ln -sf docker/.env.prebuild .env
docker compose -f docker/docker-compose-prebuild.yml up -d

# Set up .env for temporarily get access to the database
ln -sf docker/.env.build .env
docker compose -f docker/docker-compose-build.yml build
docker login
docker compose -f docker/docker-compose-build.yml push

# Create the tarball for EC2
tar -czvf prod-dist.tgz run.sh .secrets docker/docker-compose.yml docker/env.prod docker/fixenv.sh

cat <<EOF
Finished:
- Upload docker-dist.tgz to the EC2 instance
- Log into the EC2 instance, uncompress and customize .env to the IP
- Run:
  docker compose -f docker/docker-compose.yml up -d
- Jump into http://public-ip:3000
EOF
