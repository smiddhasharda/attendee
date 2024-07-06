import React from 'react';
import { View, Text, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import CustomeCheckBoxStyle from './CustomeCheckBox.style';

const CustomCheckbox = ({ label, checked, onChange }) => {
 const backgroundColor = checked ? 'black' : 'transparent';

 return (
    <Pressable onPress={onChange}>
      <View style={CustomeCheckBoxStyle.container}>
        <View
          style={[CustomeCheckBoxStyle.body, { backgroundColor }]}
        />
        <Text style={CustomeCheckBoxStyle.text}>{label}</Text>
      </View>
    </Pressable>
 );
};

CustomCheckbox.propTypes = {
 label: PropTypes.string.isRequired,
 checked: PropTypes.bool.isRequired,
 onChange: PropTypes.func.isRequired,
};

export default CustomCheckbox;