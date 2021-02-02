/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { FC } from 'react';
import { Dimensions, ScrollView, useWindowDimensions } from 'react-native';
import C, {
  apply,
  responsive,
  Text,
  TouchableOpacity,
  View,
} from 'consistencss';
import { NavigationStack } from '../types';

const Home: FC<{
  navigation: NavigationStack;
}> = ({ navigation }) => {
  useWindowDimensions();

  const responsiveColor = responsive({
    sm: C.textGreen,
    md: C.textBlue,
    lg: C.textRed,
  });

  return (
    <ScrollView>
      <View style={apply(C.bgRed, C.h16, C.wscreen)}>
        <Text style={apply(C.textYellow, C.fontM)}>yellow</Text>
      </View>
      <View style={apply(C.bgMagenta, C.h4, C.wHalf)} />
      <View style={apply(C.bgYellow, C.h3)} />
      <View style={apply(C.bgBlue, C.h)} />
      <View style={apply(C.bgRed, C.h4)} />
      <View style={apply(C.bgBlue, C.h2)} />
      <View style={apply({ backgroundColor: 'green' }, C.h3)} />
      <Text style={apply(C.textBlue, C.font4)}>blue</Text>
      <Text
        style={apply(C.textSecondary, C.weightBold, C.mt_1, C.familyPrimary)}
      >
        secondary
      </Text>
      <TouchableOpacity style={C.shadow}>
        <Text style={C.weightBlack}>primary</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={apply(C.m4, C.mb0, C.radius4, C.shadowXl)}
        onPress={() => navigation.navigate('Another')}
      >
        <Text style={apply(C.textWhite)}>Navigate</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <Text style={apply(C.textBlue, C.font4)}>left</Text>
        <Text style={apply(C.textPrimary, C.font6)}>middle</Text>
        <Text style={apply(C.textSecondary, C.weightBold)}>right</Text>
      </View>
      <View>
        <Text>Device width: {Dimensions.get('screen').width} px</Text>
        <Text style={responsiveColor}>
          If you are using a device with less than 301px as width, you should
          see this in green.
        </Text>
        <Text style={responsiveColor}>
          If you are using a device between 301px and 500px as width, you should
          see this in blue.
        </Text>
        <Text style={responsiveColor}>
          If you are using a device with more than 500px as width, you should
          see this in red.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = {
  row: apply(C.row, C.itemsCenter, C.justifyBetween),
};

export default Home;
