module.exports = {
    color(name, color) {
        return [
            { className: `c-${name}`,  prop: 'color',            value: color },
            { className: `bg-${name}`, prop: 'background-color', value: color },
            { className: `b-${name}`,  prop: 'border-color',     value: color },
        ]
    },

    colorVariants(name, color) {
        const normal = this.color(name, color)
        const dark = normal.map(({ className, prop, value }) => ({
            className: `${className}-dark`,
            prop,
            value: `darken(${value}, 10%)`,
        }))
        const light = normal.map(({ className, prop, value }) => ({
            className: `${className}-light`,
            prop,
            value: `lighten(${value}, 10%)`,
        }))
        return [].concat(light, dark)
    },

    responsive(rulesBlock) {
        const blockM = rulesBlock.map((rule) => {
            if (!rule.className) return rule
            const { className, prop, value } = rule
            return {
                className: `${className}-m`,
                breakpoint: '(min-width: 480px) and (max-width: 1024px)',
                prop,
                value,
            }
        })
        const blockL = rulesBlock.map((rule) => {
            if (!rule.className) return rule
            const { className, prop, value } = rule
            return {
                className: `${className}-l`,
                breakpoint: '(min-width: 1024px)',
                prop,
                value,
            }
        })
        return rulesBlock.concat(blockM, blockL)
    },
}
