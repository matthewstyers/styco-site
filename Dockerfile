FROM node:4.2.4-wheezy


# [ONLY UNCOMMENT STEP 1 IF YOU WANT TO RUN A FRESH NPM INSTALL]
# RUN rm -rf /tmp/node_modules && rm -rf /opt/app/node_modules

# Creates a cache layer for node_modules, so npm install only runs if package.json has changed.
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app
RUN npm install -g nodemon@1.8.1 gulp@3.9.0 unicode@0.6.1

RUN mkdir /opt/app/src
ADD . /opt/app/src
WORKDIR /opt/app/src

EXPOSE 5000

CMD gulp
