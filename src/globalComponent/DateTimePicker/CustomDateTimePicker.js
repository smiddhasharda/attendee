import React from 'react';
import { Platform, Text, Pressable, View } from 'react-native';

let DatePickerComponent;
if (Platform.OS === 'web') {
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
      return <DatePickerComponent date={props.date} onDateChange={date => props.handelChangeDate(date)} mode="datetime" />;
    } else if (Platform.OS === 'android') {
      return (
        <Pressable onPress={showAndroidDatePicker}>
          <Text>{props.date.toDateString()}</Text>
        </Pressable>
      );
    } else {
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
