// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Platform, DatePickerAndroid, DatePickerIOS, TimePickerAndroid, Modal, TextInput } from 'react-native';

// const CustomDateTimePicker = () => {
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);

//   const showAndroidDatePicker = async () => {
//     try {
//       const { action, year, month, day } = await DatePickerAndroid.open({
//         date: date,
//       });
//       if (action !== DatePickerAndroid.dismissedAction) {
//         const selectedDate = new Date(year, month, day);
//         setDate(selectedDate);
//       }
//     } catch ({ code, message }) {
//       console.warn('Cannot open date picker', message);
//     }
//   };

//   const showAndroidTimePicker = async () => {
//     try {
//       const { action, hour, minute } = await TimePickerAndroid.open({
//         hour: date.getHours(),
//         minute: date.getMinutes(),
//         is24Hour: true,
//       });
//       if (action !== TimePickerAndroid.dismissedAction) {
//         const selectedTime = new Date();
//         selectedTime.setHours(hour);
//         selectedTime.setMinutes(minute);
//         setDate(selectedTime);
//       }
//     } catch ({ code, message }) {
//       console.warn('Cannot open time picker', message);
//     }
//   };

//   const renderIOSDatePicker = () => {
//     return (
//       <DatePickerIOS
//         date={date}
//         onDateChange={newDate => setDate(newDate)}
//         mode="date"
//       />
//     );
//   };

//   const renderIOSTimePicker = () => {
//     return (
//       <DatePickerIOS
//         date={date}
//         onDateChange={newDate => setDate(newDate)}
//         mode="time"
//       />
//     );
//   };

//   const openDatePicker = () => {
//     if (Platform.OS === 'ios') {
//       setShowDatePicker(true);
//     } else {
//       showAndroidDatePicker();
//     }
//   };

//   const openTimePicker = () => {
//     if (Platform.OS === 'ios') {
//       setShowTimePicker(true);
//     } else {
//       showAndroidTimePicker();
//     }
//   };

//   const closePicker = () => {
//     setShowDatePicker(false);
//     setShowTimePicker(false);
//   };

//   return (
//     <View>
//       <TouchableOpacity onPress={openDatePicker}>
//         <TextInput
//           value={date.toLocaleDateString()}
//           editable={false}
//         />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={openTimePicker}>
//         <TextInput
//           value={date.toLocaleTimeString()}
//           editable={false}
//         />
//       </TouchableOpacity>
//       <Modal
//         visible={showDatePicker || showTimePicker}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={closePicker}
//       >
//         <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//           <TouchableOpacity style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1 }} onPress={closePicker} />
//           <View style={{ backgroundColor: 'white' }}>
//             {showDatePicker && renderIOSDatePicker()}
//             {showTimePicker && renderIOSTimePicker()}
//             <TouchableOpacity onPress={closePicker}>
//               <Text style={{ textAlign: 'center', padding: 10 }}>Done</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default CustomDateTimePicker;

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

