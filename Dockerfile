# nodezoo-search

FROM node:4

ADD . /

EXPOSE 44001
EXPOSE 43001

CMD ["node","srv/search-dev.js","--seneca.options.tag=search","--seneca.log.all"]

# build and run:
# $ docker build -t nodezoo-search-01 .
# $ docker run -d -p 44002:44002 -p 43002:43002 -e HOST=$(docker-machine ip default) nodezoo-search-01
# local docker ip:
# $ docker-machine ip default

