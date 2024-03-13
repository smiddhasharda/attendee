import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

// For web, you might need to use a different date picker library or implement your own.
let DatePickerComponent;
if (Platform.OS === 'web') {
  // Example: Using react-datepicker library for web
  DatePickerComponent = require('react-datepicker').default;
  require("react-datepicker/dist/react-datepicker.css");
} else {
  DatePickerComponent = require('react-native-datepicker').default;
}

const CustomDateTimePicker = (props) => {

  const showAndroidDatePicker = async () => {
    // Implementation for Android DatePicker
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'ios') {
      // For iOS, use the native DatePickerIOS component
      return <DatePickerComponent date={props.date} onDateChange={date => props.handelChangeDate(date)} mode="datetime" />;
    } else if (Platform.OS === 'android') {
      // For Android, you can use a custom implementation
      return (
        <TouchableOpacity onPress={showAndroidDatePicker}>
          <Text>{props.date.toDateString()}</Text>
        </TouchableOpacity>
      );
    } else {
      // For web, render a web-compatible date picker
      return (
        <DatePickerComponent
          selected={props.date}
          onChange={date => props.handelChangeDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd MM, yyyy h:mm aa"
        />
      );
    }
  };

  return <View>{renderDatePicker()}</View>;
};

export default CustomDateTimePicker;

