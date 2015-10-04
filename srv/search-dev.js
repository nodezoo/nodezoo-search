var HOST = process.env.HOST || 'localhost'

require('seneca')()
  .use('../search.js')
  .listen(44002)
  .repl(43002)
