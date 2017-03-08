var postcss = require('postcss')
var plugin = require('./')
var fussFunctions = require('./fuss-functions')

function removeSpaces(s) {
    return s.toString().replace(/[\n\s]+/g, '')
}

function run(input, output) {
    const fuss = plugin({ functions: fussFunctions })

    return postcss([fuss]).process(input).then(result => {
        expect(removeSpaces(result.css)).toEqual(removeSpaces(output))
        expect(result.warnings().length).toBe(0)
    })
}

it('does not mangle existing CSS', () => run('.asd {}', '.asd {}'))

it('does transform a @fuss function', () => run(`
    @fuss color(blue, #00f);
`, `
    /* color(blue, #00f) */
    .c-blue { color: #00f }
    .bg-blue { background-color: #00f }
    .b-blue { border-color: #00f }
`))

it('does transform a @fuss second-order function', () => run(`
    @fuss color-variants(red, #f00);
`, `
    /* color-variants(red, #f00) */
    .c-red-light { color: lighten(#f00, 10%) }
    .bg-red-light { background-color: lighten(#f00, 10%) }
    .b-red-light { border-color: lighten(#f00, 10%) }
    .c-red-dark { color: darken(#f00, 10%) }
    .bg-red-dark { background-color: darken(#f00, 10%) }
    .b-red-dark { border-color: darken(#f00, 10%) }
`))

it('does transform a @fuss block function', () => run(`
    @fuss responsive() {
      .w-50 { width: 50% }
    }
`, `
    /* responsive() */
    .w-50 { width: 50% }
    @media screen and (min-width: 480px) and (max-width: 1024px) {
        .w-50-m { width: 50% }
    }
    @media screen and (min-width: 1024px) {
        .w-50-l { width: 50% }
    }
`))

it('does transform a @fuss block function with a @fuss fn inside', () => run(`
    @fuss responsive() {
      @fuss color(red, #f00);
    }
`, `
    /* responsive() */

    /* color(red, #f00) */
    .c-red { color: #f00 }
    .bg-red { background-color: #f00 }
    .b-red { border-color: #f00 }

    /* color(red, #f00) */
    @media screen and (min-width: 480px) and (max-width: 1024px) {
        .c-red-m { color: #f00 }
    }
    @media screen and (min-width: 480px) and (max-width: 1024px) {
        .bg-red-m { background-color: #f00 }
    }
    @media screen and (min-width: 480px) and (max-width: 1024px) {
        .b-red-m { border-color: #f00 }
    }

    /* color(red, #f00) */
    @media screen and (min-width: 1024px) {
        .c-red-l { color: #f00 }
    }
    @media screen and (min-width: 1024px) {
        .bg-red-l { background-color: #f00 }
    }
    @media screen and (min-width: 1024px) {
        .b-red-l { border-color: #f00 }
    }

`))
