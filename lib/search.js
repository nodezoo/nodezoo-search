'use strict'

var ElasticSearch = require('elasticsearch')

var opts = {
  elastic: {
    host: 'localhost',
    port: 9200
  },
  mapping: {
    index: 'modules',
    type: 'document',
    body: {
      properties: {
        name: {
          type: 'string'
        },
        detail: {
          type: 'object'
        }
      }
    }
  }
}

module.exports = function (options) {
  var seneca = this
  var extend = seneca.util.deepextend

  opts = extend(opts, options)
  opts.elastic.client = new ElasticSearch.Client({
    host: {
      host: opts.elastic.host,
      port: opts.elastic.port
    }
  })

  ensureElasticSearch((err) => {
    if (err) {
      seneca.log.error(err)
      process.exit()
    }
  })

  seneca.add('role:search,cmd:search', search)
  seneca.add('role:search,cmd:upsert', upsert)
  seneca.add('role:info,info:updated', aliasUpsert)

  return {
    name: 'nodezoo-search'
  }
}

function ensureElasticSearch (done) {
  var client = opts.elastic.client
  var index = client.indices

  index.exists({index: 'modules'}, (err, exists) => {
    if (err) return done(err)
    if (exists) return done()

    index.create({index: 'modules'}, (err) => {
      if (err) return done(err)

      index.putMapping(opts.mapping, (err) => {
        done(err)
      })
    })
  })
}

function search (msg, done) {
  var client = opts.elastic.client
  var payload = {
    index: 'modules',
    body: {
      query: {
        match: {
          name: msg.query
        }
      }
    }
  }

  client.search(payload, (err, reply) => {
    if (err) return done(err)

    var hits = reply.hits && reply.hits.hits
    var items = []

    if (hits) {
      for (var i = 0; i < hits.length; i++) {
        items.push(hits[i]._source.detail)
      }
    }

    done(null, {
      ok: true,
      items: items
    })
  })
}

function upsert (msg, done) {
  var data = msg.data
  var github = data.github || {}
  var travis = data.travis || {}
  var npm = data.npm || {}
  var name = data.name

  var detail = {
    name: name,
    travis: {
      connected: !!data.travis,
      url: travis.url || '',
      buildState: travis.buildState || ''
    },
    github: {
      connected: !!data.github,
      stars: github.stars || 0,
      watches: github.watches || 0,
      forks: github.forks || 0,
      url: github.urlRepo || '',
      user: github.user || ''
    },
    npm: {
      connected: !!data.npm,
      url: npm.url || '',
      version: npm.latestVersion || '',
      author: npm.author ? npm.author.name || '' : '',
      description: npm.description || '',
      homepage: npm.homepage || ''
    }
  }

  var client = opts.elastic.client
  var index = client.indices
  var payload = {
    index: 'modules',
    type: 'document',
    id: name,
    body: {
      name: name,
      detail: detail
    }
  }

  index.exists({index: 'modules'}, (err, exists) => {
    if (err) return done(err)
    if (exists) return

    index.create({index: 'modules'}, (err) => {
      if (err) return done(err)

      index.putMapping(opts.mapping, (err) => {
        if (err) return done(err)
      })
    })
  })

  client.index(payload, (err, reply) => {
    if (err) return done(err)

    done(null, {
      ok: true,
      index: reply._index,
      version: reply._version,
      intial: reply.created
    })
  })
}

function aliasUpsert (msg, done) {
  this.act('role:search,cmd:upsert', {data: msg.data}, done)
}
