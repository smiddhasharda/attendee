import { padding } from "@mui/system";
import {
    ViewStyle,
    ImageStyle,
    Dimensions,
    StyleSheet,
    TextStyle,
  } from "react-native";
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768; 
  const styles = StyleSheet.create({
    
    container: {
      //flex: 1,
      padding: 20,
  
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
      clear: "both",
      // marginBottom:10
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
    tableHeaderTextRole:{
      fontSize: 13, 
      fontWeight: 'bold', 
      // paddingHorizontal: 5,
      color:"#fff",
      textAlign:"left",
      alignItems:"center",
      flex:1,
    },
    tableHeaderText: {
      fontSize: 13, 
      fontWeight: 'bold', 
      // paddingHorizontal: 5,
      color:"#fff",
      textAlign:"left",
      alignItems:"center",
      // flex:1,
      // flexShrink: 0,
 
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
    // justifyContent: "space-between"
    },
    listItemText: {
     fontSize:13, 
     padding:6,   
     flex:1
   
    },
    listItemActiveStatus: {
      color: "#fff",
      textAlign: 'center',
    },
    listItemInactiveStatus: {
      color: "white",
      textAlign: 'center',
      alignItems:"center"
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
      // marginTop: 12,
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
      // bottom: 35,
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
    actionbtn:{
         backgroundColor:"#0CB551",
         borderRadius:4,
        //  minWidth:70,
        width:60,
         padding:6, 
         color:"#fff",
         textAlign:"center",
    },
    inactivebtn:{
      backgroundColor:"red",
         borderRadius:4,
        //  minWidth:70,
         padding:6, 
         width:60,
         color:"#fff",
         textAlign:"center"
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