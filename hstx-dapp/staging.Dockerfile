FROM node:8.15

#Install crontab
#RUN apt-get update -y && apt-get install cron -y
#COPY ./crontab/crontab /etc/cron.d/delete-cron
#RUN chmod +x /etc/cron.d/delete-cron
#RUN ls /etc/cron.d/
#RUN crontab /etc/cron.d/delete-cron

#Create folder /app and working with /app folder
RUN mkdir -p /data/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
#ARG NODE_ENV=production
#ENV NODE_ENV $NODE_ENV

# default to port 4000 for node, and 5858 or 9229 for debug
ARG PORT=4000
ENV PORT $PORT

# check every 30s to ensure this service returns HTTP 200
#HEALTHCHECK CMD curl -fs http://localhost:$PORT/healthz || exit 1

#Copy packages.json to /app folder && Install npm base on packages.json
WORKDIR /data
RUN npm install -g nodemon
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force
ENV PATH /data/node_modules/.bin:$PATH

#Copy source code to app
WORKDIR /data/app
COPY . /data/app
#RUN npm install && npm cache clean --force

#Default on container port 4000 for node, and 5858 or 9229 for debug
EXPOSE $PORT 5858 9229

#Start cron and npm when run container
#CMD cron && npm start
CMD npm start

