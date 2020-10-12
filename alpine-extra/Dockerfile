FROM alpine:latest

WORKDIR /root
COPY bin bin/
RUN apk add curl && rm /etc/inittab
ENV PATH="/root/bin:${PATH}"
# keep the container alive
CMD [ "/bin/sleep", "infinity" ]