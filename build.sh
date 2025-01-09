# Quick & dirty hack for dockerfile building
# pnpm build will not run from inside a builder image because it depends on postgresql being up
# It seems not to be possible to set up a build network for building images
# Therefore I just open a port on 5432 and listen

if [ -f ".env" ]; then
  cp -p .env .env.bak
  RESTORE=1
fi

docker compose -f docker-compose-prebuild.yml up -d

# Set up .env for temporarily get access to the database
cp -p .env.internal .env
docker compose -f docker-compose-build.yml up -d

if [ $RESTORE ]; then
  mv .env.bak .env
fi
