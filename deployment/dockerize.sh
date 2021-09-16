IMAGE_TAG=latest
APP_DOCKER_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/payroll-backend"
docker build \
  -t ${APP_DOCKER_REPO}:ci-${CIRCLE_BUILD_NUM} \
  -t ${APP_DOCKER_REPO}:${IMAGE_TAG} 
docker push ${APP_DOCKER_REPO}:ci-${CIRCLE_BUILD_NUM} 
docker push ${APP_DOCKER_REPO}:${IMAGE_TAG}