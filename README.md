![Logo](https://raw.githubusercontent.com/nodezoo/org/master/assets/img/logo-nodezoo.png)

# nodezoo-Search

Nodezoo Search is an interface with an elasticsearch server. Nodezoo is an example microservice system written in node.js. It is written in a workshop format and designed to help you explore a full microservice
system. Please see the [main repo][] for more details.

- __Sponsor:__ [nearForm][]
- __Lead:__ [Richard Rodger][Lead]

## Install
1. Clone this repo into a root _/nodezoo_ folder.
2. Run `npm install`

## Starting
To start simply run,
`npm run start`
       OR
`npm run start-dev`

### Tagging and Logs
To tag your service and set up logs simply pass the relevant switches on start,

```
npm start -- --seneca.options.tag=nodezoo-search --seneca.log.all
```

## Inbound Messages
This micro-service recognizes the following inbound messages:

   * _role:search,cmd:insert_ - insert module details into search engine index
   * _role:search,cmd:search_ - query the search engine

## Outbound Messages
This micro-service emits no outbound messages.

## Contributing
The [NodeZoo][] org encourages __open__ and __safe__ participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

- Before contributing please review our [Code of Conduct][CoC]

## License
Copyright (c) 2014 - 2016, Richard Rodger and other contributors.
Licensed under [MIT][].


[MIT]: ./LICENSE
[Code of Conduct]: https://github.com/nearform/vidi-contrib/docs/code_of_conduct.md
[nearForm]: http://www.nearform.com/
[NodeZoo]: http://www.nodezoo.com/
[main repo]: https://github.com/rjrodger/nodezoo
[CoC]: ./CoC.md
[Lead]: https://github.com/rjrodger
