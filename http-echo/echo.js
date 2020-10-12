'use strict'

const express = require('express')
const os = require('os')
const version = require('./package.json').version

// Constants
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'


const INCLUDE = [
    'headers',
    'params',
    'query'
]

const TYPES = ['string', 'number']

// App
const app = express()
app.use((req, res) => {
    console.log(res)

    let out = {
        version,
        env: process.env,
        os: {
            hostname: os.hostname(),
            type: os.type(),
            platform: os.platform()
        }
    }
    for(let k in req) {
        if(TYPES.includes(typeof req[k])) out[k] = req[k]
    }
    for(let inc of INCLUDE) {
        out[inc] = req[inc]
    }
    console.log('out: %j', out)
    res.send('<PRE>' + JSON.stringify(out, null, 4) + '</PRE>')

})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})
