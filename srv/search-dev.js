/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */

var ELASTIC = process.env.ELASTIC || 'localhost'


var Seneca = require('seneca')


Seneca({tag: 'search'})
  .test('print')

  .use('..', {
    elastic: {
      host: ELASTIC
    }
  })

  .use('seneca-repl', {port:10020})

  .listen(9020)
