/* Copyright (c) 2014-2017 Richard Rodger and other contributors, MIT License */

var Code = require('code')
var Lab = require('lab')
var Seneca = require('seneca')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect


describe('search', function () {

  it('happy', {timeout: 7777}, function (done) {
    var mod = 'mod'+((Math.random()+'').substring(2))

    require('wreck').get('http://localhost:9200/', function (err, res, payload) {
      console.log(payload.toString())
    })

    var seneca = Seneca()

    seneca
    // Place Seneca into test mode. Errors will be passed to done callback,
    // so no need to handle them in callbacks.
      .test(done)

    // Uncomment if you want to see detailed logs
      .test(done, 'print')

    // Load the search plugin
      .use('..')

      .act(
        'role:search,cmd:insert', 
        {data:{
          name:mod,version:'0.0.1',desc:mod,id:mod
        }},
        function (ignore, out) {
          expect(out._id).to.equal(mod)
        })

    setTimeout(function () {
      seneca.act('role:search,cmd:search,query:'+mod, function (ignore, out) {
        expect(out.items[0].name).to.equal(mod)
        expect(out.items[0].id).to.equal(mod)
        
        done()
      })
    }, 3333)
  })
})


