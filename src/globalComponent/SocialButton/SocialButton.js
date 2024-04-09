import React from "react";
import {
  View,
  Image,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Pressable,
  ImageSourcePropType,
} from "react-native";

/**
 * ? Local Imports
 */
import styles from "./SocialButton.style";

const SocialButton = ({
  style,
  text,
  textStyle,
  iconImageStyle,
  textContainerStyle,
  imageSource = require("../../local-assets/facebook.png"),
  onPress,
}) => {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
     <Image
        resizeMode="contain"
        source={imageSource}
        style={[styles.iconImageStyle, iconImageStyle]}
      />
      <View style={[styles.textContainer, textContainerStyle]}>
        <Text style={[styles.textStyle, textStyle]}>{text}</Text>
      </View>
    </Pressable>
  );
};

export default SocialButton;
