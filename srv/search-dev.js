'use strict'

var opts = {
  search: {
    elastic: {
      host: process.env.ELASTIC || 'localhost'
    }
  },
  mesh: {
    auto: true,
    pin: [
      'role:search, cmd:*',
      'role:info, info:updated'
    ]
  }
}

require('seneca')()
  .use('../search.js', opts.search)
  .use('mesh', opts.mesh)
