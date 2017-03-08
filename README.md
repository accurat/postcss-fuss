# PostCSS Fuss [![Build Status][ci-img]][ci]

[ci-img]:  https://travis-ci.org/caesarsol/postcss-fuss.svg
[ci]:      https://travis-ci.org/caesarsol/postcss-fuss

> [PostCSS](https://github.com/postcss/postcss) plugin to define and compose
Functional CSS rules.

Lots of functional CSS frameworks are emerging in the last days, but none of
them offers a library of functions to create and manipulate the mono-definition
rules.

As a result:

1. Your stylesheets are full of unused rules;
2. You have to manually write every responsive rule or color you want to add to the default set.

Using [Tachyons](http://tachyons.io/) for example I often have to define at least three rules for each new color:

- `.red { color: red }`
- `.bg-red { background-color: red }`
- `.b-red { border-color: red }`

And I'm not even starting to talk about responsive rules!

Because the more lazy you are the better developer you get, I'd like to DRY these
declarations out by using the sacred concept of **functions**.

Enters *FUSS*, which stands for **FU**nctional **S**tyle **S**heets.

#### Input

```sass
@fuss color(blue, #00f);
@fuss color-variants(red, #f00);
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
.c-blue { color: #00f }
.bg-blue { background-color: #00f }
.b-blue { border-color: #00f }

/* color-variants(red, #f00) */
.c-red-light { color: lighten(#f00, 10%) }
.bg-red-light { background-color: lighten(#f00, 10%) }
.b-red-light { border-color: lighten(#f00, 10%) }
.c-red-dark { color: darken(#f00, 10%) }
.bg-red-dark { background-color: darken(#f00, 10%) }
.b-red-dark { border-color: darken(#f00, 10%) }

/* responsive() */
.w-50 { width: 50% }
@media screen and (min-width: 480px) and (max-width: 1024px) { .w-50-m { width: 50% } }
@media screen and (min-width: 1024px) { .w-50-l { width: 50% } }
```

This example will of course need the [postcss-color-function](https://github.com/postcss/postcss-color-function) plugin to work.

The real power comes with the responsive utilities, which can be combined with all the other FUSS functions.

## Future improvements

More FUSS functions examples are to come, such as:
- Measure definition: a single FUSS rule to define a single measure for margin, padding, border, width, height...
- Block rule for `:hover` states: just adds `-hover:hover` to the class name to enable the rule in hover.
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
