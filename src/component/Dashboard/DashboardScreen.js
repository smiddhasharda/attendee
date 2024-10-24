import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Dimensions, Pressable,TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
import ExamPieChart from '../../globalComponent/Chart/ExamPieChart';
import DropDownPicker from 'react-native-dropdown-picker'; // Import the dropdown picker

const DashboardScreen = () => {
  const { navigate } = useNavigation(); 
  const [showExamdata, setShowExamdata] = useState(true);
  
  // State for dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ]);
  const closeDropdown = () => {
    if (open) {
      setOpen(false);
    }
    // Dismiss keyboard if open
    // Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
    
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Attendance Portal</Text>

      {/* Dropdown Menu */}
  
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select an option"
        style={styles.dropdown} // Add custom styles
      />

      {/* Render the ExamPieChart */}
      {/* {showExamdata ? (
        <ExamPieChart />
      ) : ( */}
        <Image
          resizeMode="contain"
          style={styles.homeBG}
          source={require("../../local-assets/home-img.png")}
        />
      {/* )} */}
    </View> 
    </TouchableWithoutFeedback>
    
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    minHeight: "100%",
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  homeBG: {
    width: Dimensions.get('window').width, // Full width of the screen
    height: 280, // Adjust this to the desired height
    position: "relative",
    right: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  // other styles...
});

export default DashboardScreen;
