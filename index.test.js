const postcss = require('postcss')
const plugin = require('./')
const fussFunctions = require('./fuss-functions')

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
    .blue { color: #00f }
    .bg-blue { background-color: #00f }
    .b--blue { border-color: #00f }
`))

it('does transform a @fuss function containing css variables', () => run(`
    @fuss color(blue, var(--blue));
`, `
    /* color(blue, var(--blue)) */
    .blue { color: var(--blue) }
    .bg-blue { background-color: var(--blue) }
    .b--blue { border-color: var(--blue) }
`))

it('does transform a @fuss second-order function', () => run(`
    @fuss color-variants() {
      .gray { color: #ccc }
    }
`, `
    /* color-variants() */
    .gray { color: #ccc }
    .gray-light { color: color-mod(#ccc lightness(+10%)) }
    .gray-dark { color: color-mod(#ccc lightness(-10%)) }
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
    .red { color: #f00 }
    .bg-red { background-color: #f00 }
    .b--red { border-color: #f00 }

    /* color(red, #f00) */
    @media screen and (min-width: 480px) and (max-width: 1024px) {
        .red-m { color: #f00 }
    }
    @media screen and (min-width: 480px) and (max-width: 1024px) {
        .bg-red-m { background-color: #f00 }
    }
    @media screen and (min-width: 480px) and (max-width: 1024px) {
        .b--red-m { border-color: #f00 }
    }

    /* color(red, #f00) */
    @media screen and (min-width: 1024px) {
        .red-l { color: #f00 }
    }
    @media screen and (min-width: 1024px) {
        .bg-red-l { background-color: #f00 }
    }
    @media screen and (min-width: 1024px) {
        .b--red-l { border-color: #f00 }
    }

`))

it('does work with a nesting of three', () => run(`
    @fuss color-states() {
      @fuss color-variants() {
        @fuss color(accent, #BADA55);
      }
    }
`, `
    /* color-states() */


    /* color-variants() */

    /* color(accent, #BADA55) */
    .accent { color: #BADA55 }
    .bg-accent { background-color: #BADA55 }
    .b--accent { border-color: #BADA55 }

    /* color(accent, #BADA55) */
    .accent-light { color: color-mod(#BADA55 lightness(+10%)) }
    .accent-dark { color: color-mod(#BADA55 lightness(-10%)) }
    .bg-accent-light { background-color: color-mod(#BADA55 lightness(+10%)) }
    .bg-accent-dark { background-color: color-mod(#BADA55 lightness(-10%)) }
    .b--accent-light { border-color: color-mod(#BADA55 lightness(+10%)) }
    .b--accent-dark { border-color: color-mod(#BADA55 lightness(-10%)) }


    /* color-variants() */

    /* color(accent, #BADA55) */
    .hover-accent:hover { color: #BADA55 }
    .active-accent:hover:active { color: #BADA55 }
    .focus-accent:focus { color: #BADA55 }
    .hover-bg-accent:hover { background-color: #BADA55 }
    .active-bg-accent:hover:active { background-color: #BADA55 }
    .focus-bg-accent:focus { background-color: #BADA55 }
    .hover-b--accent:hover { border-color: #BADA55 }
    .active-b--accent:hover:active { border-color: #BADA55 }
    .focus-b--accent:focus { border-color: #BADA55 }

    /* color(accent, #BADA55) */
    .hover-accent-light:hover { color: color-mod(#BADA55 lightness(+10%)) }
    .active-accent-light:hover:active { color: color-mod(#BADA55 lightness(+10%)) }
    .focus-accent-light:focus { color: color-mod(#BADA55 lightness(+10%)) }
    .hover-accent-dark:hover { color: color-mod(#BADA55 lightness(-10%)) }
    .active-accent-dark:hover:active { color: color-mod(#BADA55 lightness(-10%)) }
    .focus-accent-dark:focus { color: color-mod(#BADA55 lightness(-10%)) }
    .hover-bg-accent-light:hover { background-color: color-mod(#BADA55 lightness(+10%)) }
    .active-bg-accent-light:hover:active { background-color: color-mod(#BADA55 lightness(+10%)) }
    .focus-bg-accent-light:focus { background-color: color-mod(#BADA55 lightness(+10%)) }
    .hover-bg-accent-dark:hover { background-color: color-mod(#BADA55 lightness(-10%)) }
    .active-bg-accent-dark:hover:active { background-color: color-mod(#BADA55 lightness(-10%)) }
    .focus-bg-accent-dark:focus { background-color: color-mod(#BADA55 lightness(-10%)) }
    .hover-b--accent-light:hover { border-color: color-mod(#BADA55 lightness(+10%)) }
    .active-b--accent-light:hover:active { border-color: color-mod(#BADA55 lightness(+10%)) }
    .focus-b--accent-light:focus { border-color: color-mod(#BADA55 lightness(+10%)) }
    .hover-b--accent-dark:hover { border-color: color-mod(#BADA55 lightness(-10%)) }
    .active-b--accent-dark:hover:active { border-color: color-mod(#BADA55 lightness(-10%)) }
    .focus-b--accent-dark:focus { border-color: color-mod(#BADA55 lightness(-10%)) }
`))
