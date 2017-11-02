/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */

//var BASES = process.env.BASES.split(',')
var ELASTIC = process.env.ELASTIC_SERVICE_HOST || 'localhost'
var CONSUL = process.env.CONSUL_SERVICE_HOST || 'localhost'

var Seneca = require('seneca')

Seneca({tag: 'search'})
  .test('print')

  .use('../search.js', {
    elastic: {
      host: ELASTIC
    }
  })

  .use('consul-registry', {
    host: CONSUL
  })

  .use('mesh', {
    pin: 'role:search',
    //bases: BASES,
    host: '@eth0',
    //sneeze: {silent:false},
    discover: {
      registry: {
        active: true
      }
    },
  })

  .ready(function () {
    this.add('role:search,cmd:search', function (msg, reply) {
      this.prior(msg, reply)

      this.act('role:suggest,cmd:add',{query:msg.query,default$:{}})
    })
  })
