# PostCSS Fuss [![Build Status][ci-img]][ci]

[ci-img]:  https://travis-ci.org/caesarsol/postcss-fuss.svg
[ci]:      https://travis-ci.org/caesarsol/postcss-fuss

> [PostCSS](https://github.com/postcss/postcss) plugin to define and compose
Functional CSS rules.

[![NPM](https://nodei.co/npm/postcss-fuss.png?compact=true)](https://npmjs.org/package/postcss-fuss)

Lots of functional CSS frameworks are emerging in the last days, but none of
them offers a library of functions to create and manipulate the mono-definition
rules.

As a result:

1. Your stylesheets are full of unused rules;
2. You have to manually write every responsive rule or color you want to add to the default set.

Using [Tachyons](http://tachyons.io/) for example I often have to define at least three rules for each new color:

- `.red { color: red }`
- `.bg-red { background-color: red }`
- `.b--red { border-color: red }`

And I'm not even starting to talk about responsive rules!

Because the more lazy you are the better developer you get, I'd like to DRY these
declarations out by using the sacred concept of **functions**.

Enters *FUSS*, which stands for **FU**nctional **S**tyle **S**heets.

#### Input:

```sass
@fuss color(blue, #00f);
@fuss color-variants() {
  .gray { color: #ccc }
}
@fuss color-states() {
  .bg-yellow { background: #ff0 }
}
@fuss responsive() {
  .w-50 { width: 50% }
}
```

The functions you can use with `@fuss` are defined in Javascript and passed in the plugin options.
This gives you the greater flexibility, and avoids the need to have to invent/build/learn another language.
See [fuss-functions](../blob/master/fuss-functions.js) for the definitions of these functions.

#### Output:

```css
/* color(blue, #00f) */
.blue { color: #00f }
.bg-blue { background-color: #00f }
.b--blue { border-color: #00f }

/* color-variants() */
.gray { color: #ccc }
.gray-light { color: color-mod(#ccc lightness(+10%)) }
.gray-dark { color: color-mod(#ccc lightness(-10%)) }

/* color-states() */
.bg-yellow { background: #ff0 }
.hover-bg-yellow:hover { background: #ff0 }
.active-bg-yellow:hover:active { background: #ff0 }
.focus-bg-yellow:focus { background: #ff0 }

/* responsive() */
.w-50 { width: 50% }
@media screen and (min-width: 480px) and (max-width: 1024px) { .w-50-m { width: 50% } }
@media screen and (min-width: 1024px) { .w-50-l { width: 50% } }
```

**NOTE**: The color-variants functions outputs [spec-compliant](https://www.w3.org/TR/css-color-4/#funcdef-color-mod) code containing the color-mod() function, but this isn't supported in any browser yet, so you will need to use the [postcss-color-mod-function](https://github.com/jonathantneal/postcss-color-mod-function) postcss plugin to work.

The real power comes with the block utilities, which can be combined with all the other FUSS functions. For example you can combine the color functions to choose the color only once, and have every class available.

#### Input:

```sass
@fuss color-states() {
  @fuss color-variants() {
    @fuss color(accent, #BADA55);
  }
}
```

#### Output:

```css
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
```

## Future improvements

More FUSS functions examples are to come, such as:
- Measure definition: a single FUSS rule to define a single measure for margin, padding, border, width, height...
- Anything else you can think of! Write a rule and try it right away, make a PR if you care to contribute!

## Try

A primordial version of this plugin was prototyped on AST-Explorer [here](https://astexplorer.net/#/gist/969f9be1a3b2bfb2bc20e3dec745f388/acc633fe29fdfb22911f5edf4ff5acd4029a9bab),
and that's the fastest route to try it online for now.

## Usage

**Note**: Support is only for Node > 6, just out of my JS habit. Drop a line if you'd like a legacy version.

```js
const fussPlugin = require('postcss-fuss')
const fussFunctions = require('postcss-fuss/fuss-functions') // Or define your own!
const fuss = fussPlugin({ functions: fussFunctions })

postcss([ fuss ])
```
