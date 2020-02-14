FROM node:10.0.0

#Create folder /app and working with /app folder
RUN mkdir -p /data/app

# default to port 4000 for node, and 5858 or 9229 for debug
ARG PORT=4000
ENV PORT $PORT

#Copy packages.json to /app folder && Install npm base on packages.json
WORKDIR /data
RUN npm install -g nodemon
COPY package.json package-lock.json* .npmrc ./
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
