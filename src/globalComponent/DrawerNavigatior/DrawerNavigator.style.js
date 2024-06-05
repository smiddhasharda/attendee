import { StyleSheet } from "react-native";
import { HoverEffect } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: 'rgb(17, 65, 102)' ,

    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
  },

  buttonwrap:{
  flexDirection:"row",
  // justifyContent:"space-between",
  padding:4,
  marginTop:8
  },
  saveButton: {
    padding: 4,
    borderRadius: 5,
    backgroundColor: "#129912",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 6,
    minWidth:60
  },
  cancelButton: {
    padding: 4,
    borderRadius: 5,
    backgroundColor: "rgb(237 52 52)",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    // marginRight: 10,
    marginTop: 6,
    minWidth:60,
  },
  btntext:{
  color:"#fff",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color:"#fff",
    marginTop:8
  },
  rolePicker: {
    marginTop: 10,
    width: 100,
    // paddingHorizontal: 10,
  },
  drawerItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  drawerItemText: {
    fontSize: 16,
  }, 
  dropdown:{
  width:110,
  minHeight:30,
  },
  dropdownContainer:{
    width:110,
    padding: [10, 5],
    height: "auto"
  },
  drawerItemLabel:{
    // marginLeft:10,
  }
});

export default styles;
