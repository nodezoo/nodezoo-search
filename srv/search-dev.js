var ELASTIC = process.env.ELASTIC || 'localhost'

require('seneca')()//{debug:{act_caller:true}})
  .use('../search.js',{elastic:{host:ELASTIC}})

  .use('mesh',{auto:true, pin:'role:search'})

