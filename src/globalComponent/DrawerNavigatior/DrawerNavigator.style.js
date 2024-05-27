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
