module.exports = {
    color(name, color) {
        return [
            { className: name, prop: 'color', value: color },
            { className: `bg-${name}`, prop: 'background-color', value: color },
            { className: `b--${name}`, prop: 'border-color', value: color },
        ]
    },

    colorVariants(rulesBlock) {
        const variantsBlock = flatMap(rulesBlock, rule => {
            if (!rule.className) return rule

            const { className, prop, value: color } = rule
            return [
                { className: `${className}-light`, prop, value: `color-mod(${color} lightness(+15%))` },
                { className: `${className}-dark`, prop, value: `color-mod(${color} lightness(-15%))` },
            ]
        })

        return rulesBlock.concat(variantsBlock)
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
