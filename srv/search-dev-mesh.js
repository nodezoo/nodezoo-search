/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */


var ELASTIC = process.env.ELASTIC || 'localhost'


var Seneca = require('seneca')


Seneca({tag: 'search'})
  .test('print')
  .use('monitor')

  .use('mesh',{
    pin:'role:search'
  })

  .use('../search.js', {
    elastic: {
      host: ELASTIC
    }
  })

  .ready(function () {
    this.add('role:search,cmd:search', function (msg, reply) {
      this.prior(this.util.clean(msg), reply)

      this.act('role:suggest,cmd:add,query:'+msg.query)
    })
  })

