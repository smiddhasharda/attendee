import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import CustomeCheckBoxStyle from './CustomeCheckBox.style';

const CustomCheckbox = ({ label, checked, onChange }) => {
 const backgroundColor = checked ? 'black' : 'transparent';

 return (
    <TouchableOpacity onPress={onChange}>
      <View style={CustomeCheckBoxStyle.container}>
        <View
          style={[CustomeCheckBoxStyle.body, { backgroundColor }]}
        />
        <Text style={CustomeCheckBoxStyle.text}>{label}</Text>
      </View>
    </TouchableOpacity>
 );
};

CustomCheckbox.propTypes = {
 label: PropTypes.string.isRequired,
 checked: PropTypes.bool.isRequired,
 onChange: PropTypes.func.isRequired,
};

export default CustomCheckbox;