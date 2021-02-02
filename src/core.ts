import { Dimensions, StyleProp } from 'react-native';
import constants from './constants';
import dictionary, { DictionaryKeys } from './dictionary';
import { DynamicObject, Styles, StylesObject } from './types';
import { camelCaseSplit, isEmpty, warnOnInvalidKey } from './utils';

export const apply = (
  ...styles: Array<StyleProp<Styles> | string>
): StyleProp<Styles | {}> =>
  styles
    .filter(s => !isEmpty(s))
    .flatMap(s => (typeof s === 'string' ? C[s] : s));

export const classNames = (
  ...params: Array<string | DynamicObject<boolean> | StyleProp<Styles | {}>>
) => {
  const styles: StyleProp<Styles | {}> = {};
  let classes: string = '';

  params.forEach(param => {
    if (Array.isArray(param)) {
      Object.assign(styles, ...param);
      return;
    }

    if (typeof param === 'object') {
      Object.entries(param || {}).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          if (value) {
            classes += ` ${key.replace(/ +(?= )/g, '')}`;
          }
        } else {
          Object.assign(styles, param);
        }
      });
      return;
    }

    if (typeof param === 'string') {
      classes += ` ${param}`;
    }
  });

  return apply(...classes.split(' '), styles);
};

export const responsive = (styles: DynamicObject<StyleProp<Styles>>) => {
  let currentSize: string = 'default';

  Object.entries(constants.layout).map(([key, value]) => {
    const lte = value.lte ?? 10000;
    const gte = value.gte ?? 0;
    const screenWidth = Dimensions.get('screen').width;

    if (screenWidth >= gte && screenWidth <= lte) {
      currentSize = key;
    }
  });

  return apply(styles[currentSize] ?? styles.default ?? {});
};

const StylesCacheManager = {
  cache: {} as DynamicObject<Styles>,
  get: (key: string) => StylesCacheManager.cache[key],
  set: (key: string, value: Styles) => {
    StylesCacheManager.cache[key] = value;
  },
  clear: () => {
    StylesCacheManager.cache = {};
  },
};

type CustomConfig = Omit<typeof constants, 'classesDictionary'>;
type ConstantsKey = keyof CustomConfig;

export const extend = (custom: Partial<CustomConfig>) => {
  // clear cache to override previous values with new config
  StylesCacheManager.clear();
  Object.keys(custom).forEach((type: string) => {
    const t = type as ConstantsKey;
    Object.keys(custom[t] || {}).forEach(method => {
      if (constants.hasOwnProperty(t)) {
        // @ts-ignore
        constants[t][method.toLowerCase()] = custom[t]?.[method];
      }
    });
  });

  constants.classesDictionary =
    Object.entries(constants.classes).map(([k]) => camelCaseSplit(k)[0]) || [];
};

export const exists = (key: string): boolean => key in C;

const isAValidKey = (key: string): boolean =>
  typeof key === 'string' && !['$$typeof', 'prototype', 'toJSON'].includes(key);

const handler = {
  get: function(target: StylesObject, name: string): StylesObject {
    if (!isAValidKey(name)) return target;
    const [key, value] = camelCaseSplit(name);

    if (
      !dictionary.hasOwnProperty(key) &&
      !constants.classesDictionary.includes(key)
    ) {
      warnOnInvalidKey(`The key ${key} doesnt exists`);
      return target;
    }
    const valueInCache = StylesCacheManager.get(name);
    if (valueInCache) return valueInCache;

    const valueForKey =
      dictionary[key as DictionaryKeys]?.(value, key) ||
      constants.classes[name.toLowerCase()];

    StylesCacheManager.set(name, valueForKey);
    return valueForKey;
  },
  has: function(target: StylesObject, name: DictionaryKeys): boolean {
    return (
      dictionary[name] !== undefined || !isEmpty(handler.get(target, name))
    );
  },
  set: function(): boolean {
    console.warn('set is not allowed. Use the extend method instead.');
    return false;
  },
  defineProperty: function(): boolean {
    console.warn(
      'defineProperty is not allowed. Use the extend method instead.'
    );
    return false;
  },
  ownKeys: function() {
    return Reflect.ownKeys(dictionary);
  },
};

type Consistencss = {
  [key in DictionaryKeys]: {};
} & {
  [k: string]: {};
};

export const C = new Proxy({}, handler) as Consistencss;
