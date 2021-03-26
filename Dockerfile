FROM node:14-alpine

LABEL Maintainer="Hieupv <hieupv@codersvn.com>" \
  Description="Lightweight container for nodejs application on Alpine Linux."

# Install packages
RUN apk --no-cache add curl bash supervisor nginx git libgit2-dev krb5-libs python tzdata pkgconfig build-base

# Configure supervisord
ADD ./.docker/supervisor/master.ini /etc/supervisor.d/
# ADD ./.docker/nginx/nginx.conf /etc/nginx/nginx.conf

ENV NODE_ENV=production

WORKDIR /var/www/app

RUN yarn install --production=false && npm i -g @nestjs/cli

COPY . .

RUN yarn build

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["supervisord"]


