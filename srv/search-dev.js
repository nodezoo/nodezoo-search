var HOST = process.env.HOST || 'localhost'

require('seneca')()
  .use('../search.js')
  .listen(44002)
  .repl(43002)

  .add('role:search,cmd:search',function(msg,done){
    done(null,{items:[{
      name:'bar',
      version:'1.0.0'
    }]})
  })
