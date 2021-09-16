FROM keymetrics/pm2:14-alpine

ENV NODE_ENV=production

WORKDIR /var/app/current

COPY workspace/dist ./dist

ENTRYPOINT pm2 start dist/src/main.js -i max && pm2 log --json