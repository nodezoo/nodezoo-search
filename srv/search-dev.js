var ELASTIC = process.env.ELASTIC || 'localhost'
var STATS = process.env.STATS || 'localhost'

require('seneca')()
  .use('../search.js',{elastic:{host:ELASTIC}})
  .use('mesh',{auto:true, pin:'role:search'})
