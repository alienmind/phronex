# Basic checks
if [ ! -f .secrets ]; then
  echo "Please create a .secrets file based on dot-secrets-example"
  exit 1
fi

# Inject secrets into docker/env* files
# We create separate copies (.env.*) to avoid them being uploaded to github
for i in docker/env.localhost docker/env.prebuild docker/env.build docker/env.docker; do
  ( . .secrets ;
    envsubst '$POSTGRES_USER,$POSTGRES_PASSWORD,$POSTGRES_DATABASE,$AUTH_SECRET' < $i > .$i
  )
done
