'use strict'

var Seneca = require('seneca')
var Mesh = require('seneca-mesh')
var Search = require('../lib/search')

var envs = process.env
var opts = {
  seneca: {
    tag: envs.TAG || 'nodezoo-search'
  },
  search: {
    elastic: {
      host: envs.ELASTIC_HOST || 'localhost',
      port: envs.ELASTIC_PORT || '9200'
    }
  },
  mesh: {
    auto: true,
    listen: [
      {pin: 'role:search,cmd:upsert', model: 'consume'},
      {pin: 'role:search,cmd:search', model: 'consume'},
      {pin: 'role:info,info:updated', model: 'observe'}
    ]
  }
}

Seneca(opts.seneca)
  .use(Search, opts.search)
  .use(Mesh, opts.mesh)
