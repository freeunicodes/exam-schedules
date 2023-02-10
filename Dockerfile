FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND yarn.lock are copied
# where available (npm@5+)
COPY package.json ./
COPY ./exam-schedules-api/package.json ./exam-schedules-api/
COPY ./exam-schedules-lib/package.json ./exam-schedules-lib/
COPY yarn.lock ./

RUN yarn install --frozen-lockfile
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3636
CMD [ "yarn", "start" ]