var postcss = require('postcss')

module.exports = postcss.plugin('postcss-fuss', function (opts) {
    opts = opts || {}
    console.log(opts)

    return function (root) {
        return root
    }
})
