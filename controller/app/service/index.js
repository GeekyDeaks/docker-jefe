'use strict'

const debug = require('debug')('service:manager')
const path = require('path')
const Docker = require('dockerode')
const { basename } = require('path')

const NETWORKS = ['front', 'back']

class ServiceManager {

    constructor(opts = {}) {
        this.docker = new Docker()
        this.owner = opts.owner || 'geekydeaks'
        this.services = new Map()
        this.networks = new Map()
    }

    async start() {

        for(let n of NETWORKS) {
            await this.createNetwork(n)
        }

        // populate this services with running services owned by us?
        let containers = await this.docker.listContainers()
        for(let container of containers) {
            // filter contains to those we control
            if(!container.Labels) continue
            let { type, owner } = container.Labels
            if(!type || owner !== this.owner) continue
            let s = await this.docker.getContainer(container.Id)
            this.services.set(container.Id, s)
        }
    }

    async stop() {
        // shutdown all containers

        for(let service of this.services.values()) {
            await service.stop()
            await service.remove()
        }

        // remove networks
        for(let n of NETWORKS) {
            await this.removeNetwork(n)
        }

    }

    async startService(opts = {}) {

        let {type, c_opts} = opts
        let name = opts.name || type
        let networks = opts.networks || []

        if(!c_opts) c_opts = {}
        if(!c_opts.Labels) c_opts.Labels = {}
        c_opts.Labels.owner = this.owner
        c_opts.Labels.type = type
        c_opts.Labels.name = name

        let service  = require(path.join(__dirname, type))(c_opts)

        let container = await this.docker.createContainer(service)
        this.services.set(name, container)

        await container.start()
        for(let n of networks) {
            let network = this.networks.get(n)
            // for some reason createContainer has id instead of Id
            await network.connect({ Container: container.id })
        }

        return container

    }

    async stopService(name) {
        let s = this.services.get(name)
        if(s) {
            await s.stop()
            await s.remove()
            this.services.delete(name)
        }
    }

    async inspectService(name) {
        let s = this.services.get(name)
        if(s) {
            return s.inspect()
        }
    }

    async listServices() {
        return this.services.values()
    }

    async createNetwork(name) {
        // check if the network already exists
        // check if a network needs to be created
        let networks = await this.docker.listNetworks()
        let network = networks.find( n => n.Name === name && n.Labels.owner === this.owner)
        if(!network) {
            network = await this.docker.createNetwork({ Name: name, Labels: { owner: this.owner } })
        } else {
            network = await this.docker.getNetwork(network.Id)
        }

        if(network) this.networks.set(name, network)

    }

    removeNetwork(name) {
        let n = this.networks.get(name)
        if(n) return n.remove()
    }

}

module.exports = ServiceManager