import { StyleSheet } from "react-native";
import { HoverEffect } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: 'rgb(17, 65, 102)' ,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
  },
  buttonwrap:{
  flexDirection:"row",
  justifyContent:"space-between",
  },
  saveButton: {
    padding: 6,
    borderRadius: 5,
    backgroundColor: "#129912",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 6,
  },
  cancelButton: {
    padding: 6,
    borderRadius: 5,
    backgroundColor: "rgb(237 52 52)",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 6,
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
});

export default styles;
