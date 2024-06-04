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
      backgroundColor:"#fff",
      padding:20,
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
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: "rgb(17, 65, 102)",
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 10,
      borderRadius:5,
    },
    tableHeaderText: {
      fontSize: 16, 
      fontWeight: 'bold', 
      // paddingHorizontal: 5,
      color:"#fff",
      textAlign:"center",
      alignItems:"center",
      
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 15,
      alignItems:"center",
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
      backgroundColor: "#0C7C62",
      padding: 4,
      borderRadius: 5,
    },
    listItemEditText: {
      color: 'white',
    },
    addbtnWrap:{
      width:100,
      alignSelf:"flex-end",
      marginBottom:10,
      backgroundColor:"#0C7C62",
      padding:10,
      borderRadius:5,
  
      
    },
    updatebtn:{
      width:120,
      backgroundColor:"#0C7C62",
      padding:10,
      borderRadius:5,
      color:"#fff",
    },
    addbtntext:{
     color:"#fff",
     textAlign:"center",
    },
    modulists:{
      backgroundColor:"#fff",
      padding:10,
    },
    cancelbtn:{
      width:100,
      marginBottom:10,
      backgroundColor:"rgb(237, 52, 52)",
      padding:10,
      borderRadius:5,
      textAlign:"center",
      color:"#fff"
    }
  });

  export default styles;