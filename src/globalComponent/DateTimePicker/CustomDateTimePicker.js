import { color } from '@mui/system';
import React from 'react';
import { Platform, Text, Pressable, View ,StyleSheet,TextInput} from 'react-native';
 

let DatePickerComponent;
if (Platform.OS === 'web') {
  DatePickerComponent = require('react-datepicker').default;
  require("react-datepicker/dist/react-datepicker.css");
} else {
  DatePickerComponent = require('react-native-datepicker').default;
}

const CustomDateTimePicker = (props,inputStyle,datePickerStyle, icon) => {

  const showAndroidDatePicker = async () => {
    // Implementation for Android DatePicker
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'ios') {
      return <DatePickerComponent date={props.date} onDateChange={date => props.handelChangeDate(date)} mode="datetime" />;
    } else if (Platform.OS === 'android') {
      return (
        <Pressable onPress={showAndroidDatePicker} >
          <Text>{props.date.toDateString()}</Text>
        </Pressable>
      );
    } else {
      return (
        <DatePickerComponent
         style={[styles.datePicker, props.datePickerStyle]}
          selected={props.date}
          onChange={date => props.handelChangeDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd MM, yyyy h:mm aa"
          customInput={<TextInput style={[styles.input, inputStyle]} />}
          calendarIconClassname="custom-icon-class"
          // inline={true}
          showIcon={true}
      //     confirmBtnText="Confirm"
      // cancelBtnText="Cancel"
      // customStyles={{
      //   dateInput: [styles.input, props.inputStyle],
      //   dateIcon: {
      //     position: 'absolute',
      //     right: 0,
      //     top: 4,
      //     marginLeft: 0,
      //     tintColor: 'red', // Change the icon color here
      //   },
      //   dateText: {
      //     color: 'black',
      //   },
      //   placeholderText: {
      //     color: 'red',
      //   },
      // }}
        />
      );
    }
  };

  return <View>{renderDatePicker()} </View>;
};
const styles = StyleSheet.create({
  input: {
    width: "auto", 
    color: 'black', 
    // borderColor: 'gray',
    // borderWidth: 1, 
    padding: 9, 
    borderRadius:10,
    backgroundColor:"white"
  
  },
  calendar:{
    padding:80,
    backgroundColor:"pink",
    flexDirection:"row"
  },
 
  customIcon: {
    color: 'red', // Change the color to your desired color
  },
});

export default CustomDateTimePicker;
