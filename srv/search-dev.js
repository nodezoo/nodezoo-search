var ELASTIC = process.env.ELASTIC || 'localhost'

require('seneca')()
  .use('../search.js',{elastic:{host:ELASTIC}})
  .listen(44002)
  .repl(43002)
