'use strict'

var Request = require('request')


module.exports = function search( options ){
  var seneca = this
  options = seneca.util.deepextend({
    elastic: {
      host: 'localhost',
      port: 9200,
      base: 'zoo'
    },
  }, options)
  
  
  seneca.add( 'role:search,cmd:insert', cmd_insert )
  seneca.add( 'role:search,cmd:search', cmd_search )
  
  
  function cmd_insert( args, done ) {
    var seneca  = this
    
    var elastic = options.elastic
    var url = 'http://'+elastic.host+':'+elastic.port+'/'+elastic.base+
    '/mod/'+args.data.name
    
    var dat = args.data
    dat = {
      'doc' :dat
    }
    Request(
      {
        url:    url,
        method: 'GET',
      },
      function(err,res,body){
        var data = JSON.parse(body)
        if( err ) return done(err);
        console.log("FIRST OPERATION", data); // for temp debugging
        
        /*
        error appears as first key if not in elasticsearch:
        
        { error: 
        { root_cause: [ [Object] ],
        type: 'index_not_found_exception',
        reason: 'no such index',
        'resource.type': 'index_expression',
        'resource.id': 'zoo',
        index: 'zoo' },
        status: 404 }
        */
        
        if(data.hasOwnProperty('error')){
          console.log("SECOND OPERATION");
          // set url to the add new layout
          url = 'http://'+elastic.host+':'+elastic.port+'/'+elastic.base+
          '/mod/'+args.data.name
        }
        
        /* if found we get this object:
        { _index: 'zoo',
        _type: 'mod',
        _id: 'lodash',
        _version: 2,
        found: true,
        _source: 
        { doc: 
        { name: 'lodash',
        version: '4.6.1',
        giturl: 'git+https:
        etc.........
        */
        
        else{
          //set url to the update layout
          url = 'http://'+elastic.host+':'+elastic.port+'/'+elastic.base+
          '/mod/'+args.data.name +'/_update'
          
          console.log("THIRD OPERATION" + JSON.stringify(dat))
          /* The idea is that the data object currently accessible in nodezoo 
          web on the results page will contain the data from all 3 modules rather
          than just npm.
          To test I just displayed it on the nodezoo search page after searching 
          instead of the module name (ugly but effective :D)
          
          Currently it does half work, if you look in the search log it shows what
          its doing and it seems to be making them one object for the front end in
          some cases but its really only a bare beginning as this is where I
          got pulled away.
          */
          
        }
        Request(
          {
            url:    url,
            method: 'POST',
            json:   dat
          },
          function(err,res,body){
            done(err,body)
          })
        })
      }
      
      
      function cmd_search( args, done ) {
        var seneca  = this
        
        var elastic = options.elastic
        
        var url = 'http://'+elastic.host+':'+elastic.port+'/'+elastic.base+
        '/_search?q='+encodeURIComponent(args.query)
        
        Request(
          {
            url:    url,
            method: 'GET',
          },
          function(err,res,body){
            if( err ) return done(err);
            
            var qr = JSON.parse(body)
            var string = JSON.stringify(qr)
            var items = []
            
            var hits = qr.hits && qr.hits.hits
            
            if( hits ) {
              for( var i = 0; i < hits.length; i++ ) {
                var hit = hits[i]
                items.push( hit._source )
              }
            }
            
            return done(null,{items:items})
          })
        }
        
        
      }
