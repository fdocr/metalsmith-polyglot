####################################################
# Dockerfile for test execution
#
# docker build -t <YOUR_USER>/metalsmith-polyglot .
# docker run <YOUR_USER>/metalsmith-polyglot
####################################################
FROM node
#FROM node:4
#FROM node:5.11

MAINTAINER Fernando Valverde <fdov88@gmail.com>

WORKDIR /opt/test

ADD . /opt/test

RUN npm install

CMD ["npm", "test"]
