'use strict'

const debug = require('debug')('controller')
const fs = require('fs').promises
const path = require('path')

const express = require('express')
const { basename } = require('path')

// Constants
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

const app = express()
;(async () => {
    app.use( function(req, res, next) {
        debug('>>> %s', req.originalUrl)
        res.on('finish', function() {
            debug('<<< %s %s', req.originalUrl, res.statusCode)
        })
        next()
    })

    // loop through each file in routes and add it
    let routes_path = path.join(__dirname, 'routes')
    let files = await fs.readdir(routes_path)
    for(let file of files) {

        debug('loading route: %s', file)
        let route = require(path.join(routes_path, file))
        let router = express.Router()
        route(router)
        app.use('/' + path.basename(file, '.js'), router)
    }

    app.get('/', function(req, res) {
        res.send('hello')
    })
    
    app.listen(PORT, HOST, () => {
        debug('Running on http://%s:%s', HOST, PORT)
    })

})()


