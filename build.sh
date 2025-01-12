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
ln -sf docker/env.prebuild .env
docker compose -f docker/docker-compose-prebuild.yml up -d

# Set up .env for temporarily get access to the database
ln -sf docker/env.build .env
docker compose -f docker/docker-compose-build.yml build

# tag latest
docker image tag phronex-web alienmind/phronex-web:latest

# Publish in ECR?
#aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 211125352476.dkr.ecr.eu-central-1.amazonaws.com/alienmind/phronex-web
#docker tag phronex-web 211125352476.dkr.ecr.eu-central-1.amazonaws.com/alienmind/phronex-web:latest
#docker push 211125352476.dkr.ecr.eu-central-1.amazonaws.com/alienmind/phronex-web:latest
#
#aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 211125352476.dkr.ecr.eu-central-1.amazonaws.com/alienmind/postgres
#docker tag postgres:14-alpine 211125352476.dkr.ecr.eu-central-1.amazonaws.com/alienmind/postgres:latest
#docker push 211125352476.dkr.ecr.eu-central-1.amazonaws.com/alienmind/postgres:latest

# Publish in Dockerhub
# Do docker login first
docker image tag postgres:14-alpine alienmind/postgres:latest
docker image tag phronex-web alienmind/phronex-web:latest

# Create the tarball for EC2
tar -czvf docker-dist.tgz docker/docker-compose.yml docker/.env*

echo <<EOF
Finished:
- Upload docker-dist.tgz to the EC2 instance
- Log into the EC2 instance, uncompress and customize .env to the IP
- Run:
  docker compose -f docker/docker-compose.yml up -d
- Jump into http://public-ip:3000
EOF
