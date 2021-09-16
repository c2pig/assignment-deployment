FROM keymetrics/pm2:14-alpine

ENV NODE_ENV=production

WORKDIR /var/app/current

COPY dist ./dist

ENTRYPOINT pm2 start dist/src/dev.js -i max && pm2 log --json