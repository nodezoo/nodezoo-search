![Logo][Logo]

# nodezoo-search

- __Lead:__ [Dean McDonnell][Lead]
- __Sponsor:__ [nearForm][]

A micro-service that provides search for [NodeZoo][]. This micro-service requires an
instance of elastic-search running in order to correctly function. If elastic-search
cannot be reached the service will self terminate.

## Running Locally

### Install
1. Clone this repo.
2. Run `npm install`

### Start
Elastic search must be running before the service starts. We provide a
docker-compose file to use. If you already have elastic search running locally you
can ignore the first below.

1. Start elastic search or run `docker-compose -f test/elastic.yml up`
2. `npm run start`

## Patterns Handled

### `role:search,cmd:upsert`
Adds or inserts a record into elastic search

```js
seneca.act(`role:search,cmd:upsert`, {data: {name:'seneca', ...}}, ...)
```

### `role:search,cmd:query`
Applies the provided query to elastic-search and returns the results.

```js
seneca.act(`role:search,cmd:query`, {query: 'seneca'}, ...)
```

### `role:info,info:updated`
Aliases upsert, this pattern is an integration point for the nodezoo system. It
allows the info micro-service to upsert without specifically calling nodezoo-search.

```js
seneca.act(`role:info,info:updated`, {data: {name:'seneca', ...}})
```

## Patterns Emitted
This micro-service emits no outbound messages.


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
[JSonic]: https://github.com/rjrodger/jsonic
