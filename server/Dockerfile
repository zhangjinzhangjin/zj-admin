FROM node:14 AS development
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm config set registry https://registry.npm.taobao.org/
RUN npm install --only=dev
RUN npm install -g @nestjs/cli
RUN npm install
RUN npm install @types/estree@latest
EXPOSE 3000
#pm2在docker中使用命令为pm2-docker
# CMD ["pm2-runtime", "start", "--json", "process.json"]
# CMD ["pm2-runtime", "start",  "process.yml"]
CMD ["npm", "run", "dev"]
# CMD ["npm", "start"]