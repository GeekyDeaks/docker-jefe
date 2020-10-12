'use strict'
/* global describe it */
/* eslint-disable no-unused-expressions, no-invalid-this */

const { expect } = require('chai')

const ServiceManager = require('../app/service')

describe('service-manager', function() {

    this.timeout(40000)
    this.slow(20000)

    let sm

    beforeEach(async function() {
        sm = new ServiceManager()
        await sm.start()
    })

    afterEach(async function() {
        await sm.stop()
    })

    it('should start a http-echo service', async function() {

        let s = await sm.startService({ type: 'echo', networks: ['front'] })
        let res = await sm.inspectService('echo')
        await sm.stopService('echo')
        expect(res).to.nested.include({ 'State.Running': true } )

    })


    it.skip('should list running services', async function() {

        let sm = new ServiceManager()
        await sm.start()

        let res = await sm.listServices()

        expect(res).to.deep.equal([{}])
    })

    it.skip('should stop an echo server', function() {
        expect(true).to.equal(false)
    })

})