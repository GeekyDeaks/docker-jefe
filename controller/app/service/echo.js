'use strict'

module.exports = (opts = {}) => {

    // map some defaults
    return Object.assign({
        Image: 'geekydeaks/http-echo',
        AttachedStdin: false,
        AttachedStdout: false,
        AttachedStderr: false
    }, opts)

}