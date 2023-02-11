FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY ./exam-schedules-api/package.json ./exam-schedules-api/
COPY ./exam-schedules-lib/package.json ./exam-schedules-lib/
COPY ./exam-schedules-api/tsconfig.json ./exam-schedules-api/
COPY ./exam-schedules-lib/tsconfig.json ./exam-schedules-lib/
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./

RUN yarn build

EXPOSE 3636
CMD [ "yarn", "start" ]