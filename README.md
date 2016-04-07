![Logo][Logo]

# nodezoo-search

- __Lead:__ [Dean McDonnell][Lead]
- __Sponsor:__ [nearForm][]

A micro-service that provides search for [NodeZoo][]. This micro-service requires an
instance of elastic-search running in order to correctly function. If elastic-search
cannot be reached the service will self terminate.

If you're using this microservice, and need help, you can:

- Post a [github issue][],
- Tweet to [@nodezoo][],
- Ask on the [Gitter][gitter-url].

## Running
This micro-service can be ran as part of a complete system or as a single isolated
unit.

### As a complete system
A special system repository is available that runs the complete system using Docker
and Fuge.

- [Nodezoo: The complete system][System]


### Isolated mode
To make testing easier this micro-service can be ran in 'isolated' mode. This mode
allows testing over http using a well defined port. Please note isolated mode means
patterns are not exposed via mesh.

To run in isolated mode,

 - Clone this repository locally,
 - Run `npm install`,
 - Run `SEARCH_ELASTIC_HOST=YOUR_HOST npm start isolated`,

__Note:__ You will need to know the cost of your vm if using Docker.

A simple http service is supported and can be called using Curl or other Rest client.
The default port is `8060`. It can be changed using the `SEARCH_PORT` environment
variable.

```
curl -d '{"role":"search","cmd":"search","query":"hapi"}' http://localhost:8060/act
```

## Configuration

### Running Elastic
A running instance of elastic search is required to use this service. Assuming you
have docker installed.

  - Start your docker machine if required
  - Run `eval $(docker-machine env default)` to enable docker in your shell.
  - Run `docker-compose -f test/elastic.yml up` to start elastic

Please note, in isolation mode you need to pass the host ip of your docker-machine
if you are on an OS other than linux, obtain with `docker-machine ip default`.

### Environment Variables
Various settings can be changed using environment variables, see the list below for
all available variable names.


#### SEARCH_HOST
  - The host to listen on in isolated mode.
  - Defaults to `localhost`

#### SEARCH_PORT
  - The port to listen on in isolated mode.
  - Defaults to `8060` .

#### SEARCH_ELASTIC_HOST
  - The host elastic will listen on.
  - Defaults to `localhost`

#### SEARCH_ELASTIC_PORT
  - The port elastic will listen on.
  - Defaults to `9200` .

#### SEARCH_ISOLATED
  - Starts isolated mode.
  - Defaults to `false`.

## Messages Handled
This micro-service emits the following messages.

### `role:search,cmd:upsert`
Adds or inserts a record into elastic search

```js
seneca.act(`role:search,cmd:upsert`, {data: {name:'seneca', ...}})
```

### `role:search,cmd:search`
Applies the provided query to elastic-search and returns the results.

```js
seneca.act(`role:search,cmd:search`, {query: 'seneca'}, (err, reply) => {})
```

### `role:info,info:updated`
Aliases upsert, this pattern is an integration point for the nodezoo system. It
allows the info micro-service to upsert without specifically calling nodezoo-search.

```js
seneca.act(`role:info,info:updated`, {data: {name:'seneca', ...}})
```

## Messages Emitted
This micro-service emits no messages.


## Contributing
The [NodeZoo org][] encourages __open__ and __safe__ participation.

- __[Code of Conduct]__

If you feel you can help in any way, be it with documentation, examples, extra testing, or new
features please get in touch.

## License
Copyright (c) 2014 - 2016, Richard Rodger and other contributors.
Licensed under [MIT][].


[MIT]: ./LICENSE
[Code of Conduct]: https://github.com/nodezoo/nodezoo-org/blob/master/CoC.md
[nearForm]: http://www.nearform.com/
[NodeZoo org]: http://www.nodezoo.com/
[main repo]: https://github.com/rjrodger/nodezoo
[Lead]: https://github.com/rjrodger
[Logo]: https://raw.githubusercontent.com/nodezoo/nodezoo-org/master/assets/logo-nodezoo.png
[NodeZoo]: https://github.com/nodezoo/nodezoo
[System]: https://github.com/nodezoo/nodezoo-system
[JSonic]: https://github.com/rjrodger/jsonic
[github issue]: https://github.com/nodezoo/nodezoo-search/issues
[@nodezoo]: http://twitter.com/nodezoo
[gitter-url]: https://gitter.im/nodezoo/nodezoo-org
