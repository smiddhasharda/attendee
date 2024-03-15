import {
    ViewStyle,
    ImageStyle,
    Dimensions,
    StyleSheet,
    TextStyle,
  } from "react-native";
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    formContainer: {
      marginBottom: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#f0f0f0',
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    tableHeaderText: {
      fontWeight: 'bold',
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    listItemText: {
      flex: 1,
    },
    listItemActiveStatus: {
      color: 'green',
    },
    listItemInactiveStatus: {
      color: 'red',
    },
    listItemEditButton: {
      backgroundColor: 'blue',
      padding: 5,
      borderRadius: 5,
    },
    listItemEditText: {
      color: 'white',
    },
  });

  export default styles;