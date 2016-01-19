/* Copyright (c) 2014-2015 Richard Rodger, MIT License */
/* jshint node:true, asi:true, eqnull:true */
'use strict';


const request = require('request');


module.exports = function search( options ){
    const seneca = this;

    options = seneca.util.deepextend({
        elastic: {
            host: 'localhost',
            port: 9200,
            base: 'zoo'
        }
    },options);


    seneca.add( 'role:search,cmd:insert', cmd_insert );
    seneca.add( 'role:search,cmd:search', cmd_search );




    const cmd_insert = function ( args, done ) {
        const seneca  = this;

        const elastic = options.elastic;

        const url = 'http://' + elastic.host + ' : ' + elastic.port + '/' + elastic.base + '/mod/' + args.data.name;

        request(
            {
                url:    url,
                method: 'POST',
                json:   args.data
            },
      function(err,res,body){
        done(err,body)
      })
  }


  function cmd_search( args, done ) {
    var seneca  = this

    var elastic = options.elastic

    var url = 'http://'+elastic.host+':'+elastic.port+'/'+elastic.base+
          '/_search?q='+encodeURIComponent(args.query)

    request(
      {
        url:    url,
        method: 'GET',
      },
      function(err,res,body){
        if( err ) return done(err);

        var qr = JSON.parse(body)
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
