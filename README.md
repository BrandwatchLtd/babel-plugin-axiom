# babel-plugin-axiom

[![Build Status](https://travis-ci.org/BrandwatchLtd/babel-plugin-axiom.svg?branch=master)](https://travis-ci.org/BrandwatchLtd/babel-plugin-axiom)
[![npm version](https://badge.fury.io/js/babel-plugin-axiom.svg)](https://badge.fury.io/js/babel-plugin-axiom)

This plugin is a transform to remove unused Axiom dependencies without the need to target the relative paths of exports.

#### See also
* [`babel-plugin-lodash`](https://github.com/megawac/babel-plugin-lodash)
* [`babel-plugin-ramda`](https://github.com/megawac/babel-plugin-ramda)

### Example

```js
// Input
import {
  shortDate,
  Base,
  DotPlotChart as DotPlotChartAxiom,
} from 'bw-axiom';

// Output
import shortDate from 'bw-axiom/lib/materials/date-and-time/shortDate';
import Base from 'bw-axiom/lib/components/base/Base';
import DotPlotChartAxiom from 'bw-axiom/lib/charts/dot-plot/DotPlotChart';
```

**Limitations: You must be using ES6 imports (both specifiers and default work) to load axiom.**

### Usage

###### Via `.babelrc` (Recommended)


```json
{
  "plugins": ["axiom"]
}
```

###### Via CLI

```sh
$ babel --plugins axiom script.js
```

###### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["axiom"]
});
```

