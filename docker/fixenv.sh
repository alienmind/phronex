# Basic checks
if [ ! -f .secrets ]; then
  echo "Please create a .secrets file based on dot-secrets-example"
  exit 1
fi

# Inject secrets into docker/env* files
# We create separate copies (.env.*) to avoid them being uploaded to github
for i in docker/env.localhost docker/env.prebuild docker/env.build docker/env.docker docker/env.prod; do
  if [ -f $i ]; then
   ( . .secrets ; echo $PUBLIC_IP
     envsubst '$POSTGRES_USER,$POSTGRES_PASSWORD,$POSTGRES_DATABASE,$AUTH_SECRET,$PUBLIC_IP' < $i > docker/.`basename $i`
   )
  fi
done
