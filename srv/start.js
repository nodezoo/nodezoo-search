'use strict'

var Seneca = require('seneca')
var Mesh = require('seneca-mesh')
var Search = require('../lib/search')

var envs = process.env
var opts = {
  seneca: {
    tag: envs.SEARCH_TAG || 'nodezoo-search'
  },
  search: {
    elastic: {
      host: envs.SEARCH_ELASTIC_HOST || 'localhost',
      port: envs.SEARCH_ELASTIC_PORT || '9200'
    }
  },
  mesh: {
    auto: true,
    listen: [
      {pin: 'role:search,cmd:upsert', model: 'consume'},
      {pin: 'role:search,cmd:search', model: 'consume'},
      {pin: 'role:info,info:updated', model: 'observe'}
    ]
  },
  isolated: {
    host: envs.SEARCH_HOST || 'localhost',
    port: envs.SEARCH_PORT || '8060'
  }
}

var Service =
Seneca(opts.seneca)
  .use(Search, opts.search)

envs.SEARCH_ISOLATED
  ? Service.listen(opts.isolated)
  : Service.use(Mesh, opts.mesh)
