# nodezoo-info

FROM node:4

ADD . /

EXPOSE 44001
EXPOSE 43001

CMD ["node","srv/info-dev.js","--seneca.options.tag=info","--seneca.log.all"]

# build and run:
# $ docker build -t nodezoo-info-01 .
# $ docker run -d -p 44001:44001 -p 43001:43001 -e HOST=$(docker-machine ip default) nodezoo-info-01
# local docker ip:
# $ docker-machine ip default




