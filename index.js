const postcss = require('postcss')

function toCamel(s) {
    return s.replace(/-(.)/g, ([, c]) => c.toUpperCase())
}

function fussRule(obj) {
    if (obj.className === undefined) return obj
    const { className, prop, value, breakpoint = null } = obj
    const rule = postcss.rule({ selector: `.${className}` })
        .append({ prop, value })

    if (!breakpoint) {
        return rule
    } else {
        const mq = `screen and ${breakpoint}`
        return postcss.atRule({ name: 'media', params: mq }).append(rule)
    }
}

function fussGroup(rules) {
    return postcss.root().append(rules)
}

function classToFuss(node) {
    if (node.type !== 'rule') return node
    const { selector, nodes: [firstChild] } = node
    return {
        className: selector.replace(/^\./, ''),
        prop: firstChild.prop,
        value: firstChild.value,
    }
}

function fussToClasses(rule, fussFunctions) {
    if (rule.nodes) rule.walk(buildFussWalker(fussFunctions))
    const { params, nodes: children = [] } = rule
    if (!params || !params.includes('(') || !params.endsWith(')'))
        throw new Error(`FUSS: Malformed call: ${params}`)
    const [name, ...args] = params.split(/\s?[\(\),]\s?/).filter(Boolean)
    const funcName = toCamel(name)
    if (!fussFunctions.hasOwnProperty(funcName))
        throw new Error(`FUSS: Func not existent: ${name}`)
    const func = fussFunctions[funcName].bind(fussFunctions)
    const childList = children.map(classToFuss)
    const fussNodes = func(...args, childList).map(fussRule)
    const res = fussGroup(fussNodes)
    res.prepend(`/* ${params} */`)
    return res
}

function buildFussWalker(fussFunctions) {
    return function fussWalker(rule) {
        if (rule.type === 'atrule' && rule.name === 'fuss') {
            rule.replaceWith(fussToClasses(rule, fussFunctions))
        }
    }
}

module.exports = postcss.plugin('postcss-fuss', function (opts) {
    return root => {
        root.walk(buildFussWalker(opts.functions))
    }
})
