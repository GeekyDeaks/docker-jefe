# docker Jefe

messing around with docker

## compose

    docker-compose -f compose-diag.yaml -p jefe build   
    docker-compose -f compose-diag.yaml -p jefe up -d
    docker-compose -f compose-diag.yaml -p jefe down

    docker exec -ti docker-jefe_diag_1 ash
    docker exec -ti docker-jefe_echo_1 ash

## alpine

    docker build -t diag .
    docker run -d --name diag diag
    docker exec -ti diag ash
    docker stop diag && docker container rm diag

## mongodb

    docker pull mongo
    docker run -d -p 27017:27017 --name mongo mongo

    docker exec -ti mongo bash


## node

    docker pull node


## network

    docker network create alpine-net
    docker network inspect alpine-net

    docker run -dit --name alpine1 --network alpine-net alpine ash
    docker run -dit --name alpine2 --network alpine-net alpine ash
    docker run -dit --name alpine3 alpine ash
    docker run -dit --name alpine4 --network alpine-net alpine ash
    docker network connect bridge alpine4

    docker container stop alpine1 alpine2 alpine3 alpine4
    docker container rm alpine1 alpine2 alpine3 alpine4

    docker network rm alpine-net

