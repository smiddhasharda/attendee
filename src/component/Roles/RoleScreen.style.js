import {
    ViewStyle,
    ImageStyle,
    Dimensions,
    StyleSheet,
    TextStyle,
  } from "react-native";
  
  const styles = StyleSheet.create({
    container: {
      //flex: 1,
      padding: 10,
    },
    formContainer: {
      marginBottom: 20,
      backgroundColor:"#fff",
      padding:10,
      width:"auto",
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
      marginTop:10,
      
    },
    header: {
      fontSize: 18,
      fontWeight: "bold",
      //marginBottom:10,
      clear: "both"
    },
    
    tableHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "rgb(17, 65, 102)",
      padding: 10,
      //paddingHorizontal: 15,
      //marginBottom: 10,
      borderRadius:5,
    },
    tableHeaderText: {
      fontSize: 16, 
      fontWeight: 'bold', 
      // paddingHorizontal: 5,
      color:"#fff",
      textAlign:"left",
      alignItems:"center",
      flexShrink: 1,
    },
    listItem: {
      // flexDirection: "row",
      // // justifyContent: "space-between",
      // alignItems: "center",
      // borderBottomWidth: 1,
      // borderBottomColor: "#ddd",
      // paddingVertical: 10,
      // paddingHorizontal: 15,
     flexDirection: 'row',
    //paddingTop: 15,
    padding: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: "space-between"
    },
    // listItemText: {
    //    flex: 1,
    // },
    listItemActiveStatus: {
      //color: "green",
      textAlign: 'center',
    },
    listItemInactiveStatus: {
      //color: "red",
    },
    listItemEditButton: {
      //backgroundColor: "#0C7C62",
      padding: 0,
      borderRadius: 5,
    },
    listItemEditText: {
      color: "#0C7C62",
    },
    checkboxContainer: {
      marginTop: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    roleLists:{
      backgroundColor:"#fff",
      padding:15,
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
      borderRadius:10,
    },
    // wrapElements: {
    //   display: "flex",
    //   justifyContent: "space-between"
    // },
    addBtn: {
      alignItems:"flex-end", 
      position: "relative", 
      bottom: 24,
      //minHeight: 40
    },
    rolesTbl:{
      position: "relative",
      top: 0
    },
    addbtnWrap:{
      width:100,
      alignSelf:"flex-end",
      marginBottom:10,
      backgroundColor:"#0C7C62",
      padding:10,
      borderRadius:5,
      
    },
   
    addbtntext:{
     color:"#fff",
     textAlign:"center",
    },
    cancelbtn:{
      width:100,
      marginBottom:10,
      backgroundColor:"rgb(237, 52, 52)",
      padding:10,
      borderRadius:5,
      textAlign:"center",
      color:"#fff"
    },
    // columnRole: {
    //   flex: 5, // 10%
    // },
    // columnStatus: {
    //   flex: 3, // 20%
    // },
    // columnAction: {
    //   flex: 2, // 20%
    // }
  });

  export default styles;