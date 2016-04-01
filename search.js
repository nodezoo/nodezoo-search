'use strict'

var Request = require('request')
var ElasticSearch = require('elasticsearch')

var opts = {
  elastic: {
    host: 'localhost',
    port: 9200
  }
}

module.exports = function (options) {
  var seneca = this
  var extend = seneca.util.deepextend

  opts = extend(opts, options)

  // Hack: this is to allow elastic search to start up
  // it's not a massive issue as it's on init.
  setTimeout(() => {
    ensureElasticSearch((err) => {
      if (err) {
        seneca.log.error(err)
        process.exit()
      }
    })
  }, 10000)

  //seneca.add('role:search,cmd:insert', cmd_insert)
  seneca.add('role:search,cmd:search', cmd_search)
  seneca.add('role:info,info:updated', cmd_insert)

  return {
    name: 'nodezoo-search'
  }
}

function ensureElasticSearch (done) {
  opts.elastic.client = new ElasticSearch.Client({
    host: opts.host,
    port: opts.port
  })

  var client = opts.elastic.client
  var index = client.indices
  var mapping = {
    index: 'modules',
    type: "document",
    body: {
      properties: {
        name: {
          type: "string"
        },
        detail: {
          type: "object"
        },
        suggest: {
          type: "completion",
          analyzer: "simple",
          search_analyzer: "simple"
        }
      }
    }
  }

  index.exists({index: 'modules'}, (err, exists) => {
    if (err) return done(err)
    if (exists) return done()

    index.create({index: 'modules'}, (err) => {
      if (err) return done(err)

      index.putMapping(mapping, (err) => {
        done(err)
      })
    })
  })
}

function cmd_search (args, done) {
  var seneca  = this
  var elastic = opts.elastic

  var url = 'http://'+elastic.host+':'+elastic.port+'/'+elastic.base + '/_search?q=' + encodeURIComponent(args.query)

  Request({url: url, method: 'GET'}, function (err, res, body) {
    if (err) return done(err);

    var qr = JSON.parse(body)
    var string = JSON.stringify(qr)
    var items = []
    var hits = qr.hits && qr.hits.hits

    if (hits) {
      for (var i = 0; i < hits.length; i++ ) {
        var hit = hits[i]
        items.push( hit._source )
      }
    }
    return done(null,{items:items})
  })
}

function cmd_insert (msg, done) {
  var seneca = this

  var data = msg.data
  var github = data.github || {}

  var name = data.name

  var detail = {
    name: name,
    travis: {
    },
    github: {
      stars: github.stars || 0,
      watches: github.watches || 0,
      forks: github.forks || 0
    },
    npm: {
    }
  }

  var client = opts.elastic.client
  var payload = {
    index: 'modules',
    type: "document",
    id: name,
    body: {
      name: name,
      detail: detail,
      suggest: {
        input: name.split("-"),
        output: name
      }
    }
  }

  console.log(JSON.stringify(detail, null, 2))

  client.index(payload, (err, resp) => {
    console.log(err, resp)

    done()
  })
}
