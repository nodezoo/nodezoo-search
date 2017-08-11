/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */

var PORT = process.env.PORT || 9000
var ELASTIC = process.env.ELASTIC || 'localhost'

var Seneca = require('seneca')

Seneca({tag: 'search'})
  .use('zipkin-tracer', {host: 'zipkin', sampling: 1})
  .use('statsd', {host: 'stats'})

  .listen(PORT)

  .use('../search.js', {
    elastic: {
      host: ELASTIC
    }
  })

  .client({pin:'role:suggest', host:'suggest', port:PORT})

  .ready(function () {
    this.add('role:search,cmd:search', function (msg, reply) {
      this.prior(msg, reply)

      this.act('role:suggest,cmd:add,query:'+msg.query)
    })
  })
