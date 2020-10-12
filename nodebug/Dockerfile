FROM node:12

# node debug image
# this expects you to mount a local volume in docker compose or
# at the command line
# e.g.
#
#     volumes: 
#       - ./http-echo/:/usr/src/app/

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g nodemon

CMD [ "nodemon", "--inspect=0.0.0.0:9229"]