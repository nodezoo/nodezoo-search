# nodezoo-search

FROM node:4

ADD . /

EXPOSE 44002
EXPOSE 43002

CMD ["node","srv/search-dev.js","--seneca.options.tag=search","--seneca.log.all"]

# build and run:
# $ docker build -t nodezoo-search-04 .
# $ docker run -d -p 44002:44002 -p 43002:43002 -e ELASTIC=192.168.99.1 nodezoo-search-04
# local docker ip:
# $ docker-machine ip default




