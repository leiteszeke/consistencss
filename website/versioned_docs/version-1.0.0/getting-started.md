---
id: version-1.0.0-getting-started
title: Installation
sidebar_label: Installation
original_id: getting-started
---

# Consistencss

An "atomic css" style toolkit for [React Native](https://reactnative.dev/), inspired by [tailwindcss](https://tailwindcss.com/docs/installation/)

## Installation

```sh
npm install consistencss
```

using yarn:

```sh
yarn add consistencss
```

## Troubleshooting

### "Property 'Proxy' doesn't exist, js engine: hermes"

> android

If [Hermes](https://reactnative.dev/docs/hermes) is enabled in your project, you probably will see a red screen with the "Property 'Proxy' doesn't exist, js engine: hermes" message.

> Quick fix: disable Hermes (not recommend).

React Native 0.63 includes v0.5.0 of hermes, wich is not compatible with this lib yet. So you could install v0.5.2-rc1 temporarily.

```sh
npm install hermes-engine@v0.5.2-rc1
```

using yarn:

```sh
yarn add hermes-engine@v0.5.2-rc1
```

And React Native React Native <= 0.62.2 includes v0.4.0 of hermes, wich is not compatible either. So you could install v0.4.2-rc1 temporarily. (since Proxy was not inside hermes before)

```sh
npm install hermes-engine@v0.4.2-rc1
```

using yarn:

```sh
yarn add hermes-engine@v0.4.2-rc1
```

> https://twitter.com/HermesEngine/status/1245136667414913024

We are actively tracking the changes to Hermes to ensure support.

## Usage

```js
import { View } from 'react-native';
import C, { apply } from 'consistencss';

// ...
const App = () => {
  return (
    <View style={apply(C.m4, C.p2, C.bgRed)}>
      <Text style={C.textRed}></Text>
      <Text style={[C.textBlue, C.m6]}></Text>
      <Text style={styles.subtitle}></Text>
    </View>
  );
};

// apply also accepts strings
const styles = {
  title: apply(C.font6, C.uppercase),
  subtitle: apply('capitalize', C.mt2),
};
```

## Set your theme using `extend`

```js
import { View } from 'react-native';
import C, { apply, extend } from 'consistencss';

extend({
  colors: {
    primary: 'cornflowerblue',
    secondary: 'green',
    randomcolor: '#f2d687',
  },
});

const App = () => {
  return (
    <View style={apply(C.bgPrimary)}>
      <View style={apply(C.bgRandomcolor)}></View>
    </View>
  );
};
```

or change the default base size (16):

```js
import { Text, View } from 'react-native';
import C, { apply, extend } from 'consistencss';

// the default base is 16, so m4 = margin: 16
// m2 = margin: 8

extend({
  sizing: {
    base: 8,
    xs: 12,
  },
});

// chaging to 8, m4 = margin: 8
// m2 = margin: 4

const App = () => {
  return (
    <View style={apply(C.mt4)}>
      <Text style={C.fontXs}>Hello</Text>
    </View>
  );
};
```

even you could set default styles for componentes, like View, Text and TouchableOpacity

```js
import C, { apply, extend, View } from 'consistencss';

extend({
  components: {
    View: apply(C.bgYellow, C.p4),
  },
});

const App = () => {
  // we import View from consistencss
  // and this have a default style
  return <View></View>;
};
```

Now you can go to read the [API](background.md) specification
