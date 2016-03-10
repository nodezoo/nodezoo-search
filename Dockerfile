#nodezoo-search
FROM node:4

RUN mkdir /src
ADD package.json /src/

WORKDIR /src

RUN npm install

COPY . /src

CMD ["node", "-r", "toolbag", "srv/search-dev.js", "--seneca.options.tag=nodezoo-search", "--seneca-log=type:act"]
