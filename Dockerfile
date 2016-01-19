FROM node:4.2.4-wheezy

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app
RUN npm install -g nodemon@1.8.1 gulp@3.9.0 unicode@0.6.1

RUN mkdir /opt/app/src
WORKDIR /opt/app/src
ADD . /opt/app/src
EXPOSE 5000

CMD gulp
