import { StyleSheet, StyleProp } from 'react-native';
import constants from './constants';
import { Text, TextInput, TouchableOpacity, View } from './components';
import dictionary from './dictionary';
import { Styles, StylesObject } from './types';
import { camelCaseSplit, isEmpty, warnOnInvalidKey } from './utils';

const apply = (
  ...styles: Array<StyleProp<Styles> | string>
): StyleProp<Styles | {}> =>
  styles.flatMap(s => (typeof s === 'string' ? C[s] : s));

type ConstantsKey = keyof typeof constants;

function extend(custom: Partial<typeof constants>) {
  Object.keys(custom).forEach((type: string) => {
    const t = type as ConstantsKey;
    Object.keys(custom[t] || {}).forEach(method => {
      if (constants.hasOwnProperty(t)) {
        constants[t][method] = custom[t]?.[method];
      }
    });
  });
}

function exists(key: string): boolean {
  return key in C;
}

const isAValidKey = (key: string): boolean =>
  typeof key === 'string' &&
  ![
    'asymmetric',
    'node',
    'prototype',
    'Symbol(Symbol.toStringTag)',
    'toJSON',
    '__proto__',
    '$$typeof',
  ].includes(key);

const handler = {
  get: function(target: StylesObject, name: string): Styles {
    if (!isAValidKey(name)) return target;
    const [key, value] = camelCaseSplit(name);
    if (!dictionary.hasOwnProperty(key)) {
      warnOnInvalidKey(`The key ${key} doesnt exists`);
      return target;
    }
    return dictionary[key]?.(value, key);
  },
  has: function(target: StylesObject, name: string): boolean {
    return dictionary[name] || !isEmpty(handler.get(target, name));
  },
  set: function(): boolean {
    console.warn('set is not allowed. Use the extend method instead.');
    return false;
  },
};

export {
  apply,
  exists,
  extend,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  constants as theme,
};

const C: StylesObject = StyleSheet.create(new Proxy({}, handler));

export default C;
