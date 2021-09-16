ENV NODE_ENV=production

WORKDIR /var/app/current

COPY dist ./dist

ENTRYPOINT pm2 start dist/src/main.js -i max && pm2 log --json