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
      padding:40,
    },
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      
    },
    header: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom:10,
      marginBottom: 10,
    },
    tableHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: "rgb(17, 65, 102)",
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 10,
      borderRadius:"5px",
    },
    tableHeaderText: {
      fontWeight: "bold",
      color:"#fff",
      
    },
    listItem: {
      flexDirection: "row",
      // justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    listItemText: {
      flex: 1,
    },
    listItemActiveStatus: {
      color: "green",
    },
    listItemInactiveStatus: {
      color: "red",
    },
    listItemEditButton: {
      backgroundColor: "blue",
      padding: 5,
      borderRadius: "5px",
    },
    listItemEditText: {
      color: "white",
    },
    checkboxContainer: {
      marginTop: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    roleLists:{
      backgroundColor:"#fff",
      padding:40,
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
      borderRadius:"10px",
    },
    addbtnWrap:{
      width:100,
      alignSelf:"flex-end",
      marginBottom:10,
      backgroundColor:"blue",
      padding:10,
      borderRadius:"5px",
      
    },
    addbtntext:{
     color:"#fff",
     textAlign:"center",
    },
    cancelbtn:{
      width:100,
      marginBottom:10,
      backgroundColor:"grey",
      padding:10,
      borderRadius:"5px",
    }
  });

  export default styles;