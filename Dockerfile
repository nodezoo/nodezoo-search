FROM node:4

ADD . /

EXPOSE 44002
EXPOSE 43002

CMD ["node", "srv/search-dev.js", "--seneca.options.tag=search", "--seneca.log.all"]
