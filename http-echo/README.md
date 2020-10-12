# Synopsis

Simple HTTP echo server

# Docker

    docker build -t geekydeaks/http-echo .
    docker run -p 3000:3000 -d geekydeaks/http-echo
    docker logs <container id>
    