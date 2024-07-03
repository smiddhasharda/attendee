import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
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
  // header: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   marginBottom: 10,
  // },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  // tableHeader: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   backgroundColor: "rgb(17, 65, 102)",
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
  //   marginBottom: 10,
  //   borderRadius: 5,
  // },
  // tableHeaderText: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   color: "#fff",
  //   textAlign: "center",
  //   //textWrap: "nowrap",
  //   marginRight: 30
  // },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(17, 65, 102)",
    padding: 10,
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
    // flexShrink: 1,
    // marginRight: 12,
  },
  // moduleListContainer: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  //   padding: 10,
  // },
  moduleListContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  // listItem: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#ddd",
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
  // },
  // listItemText: {
  //   flex: 1,
  //   //textWrap: "nowrap",
  //   marginRight: 30
  // },
  // listItemActiveStatus: {
  //   color: "green",
  // },
  // listItemInactiveStatus: {
  //   color: "red",
  // },
  // listItemEditButton: {
  //   backgroundColor: "#0C7C62",
  //   padding: 4,
  //   borderRadius: 5,
  // },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    padding: 10,
  },
  listItemText: {
    fontSize: 14,
    // flexShrink: 1,
    //marginRight: 12,
  },
  listItemActiveStatus: {
    color: "green",
  },
  listItemInactiveStatus: {
    color: "red",
  },
  listItemEditButton: {
    //backgroundColor: "#0C7C62",
    padding: 0,
    borderRadius: 5,
  },
  // listItemActionContainer: {
  //   flex: 1,
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   alignItems: "center",
  // },
  updatebtn: {
    width: 120,
    backgroundColor: "#0C7C62",
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    textAlign: "left",
  },
  cancelbtn: {
    width: 100,
    backgroundColor: "rgb(237, 52, 52)",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    color: "#fff",
  },
  modulists: {
    backgroundColor: "#fff",
    padding: 10,
  },
  // addBtn: {
  //   alignItems:"flex-end", 
  //   position: "relative", 
  //   bottom: 38
  // },
  addBtn: {
    alignItems: "flex-end", 
    position: "relative", 
    bottom: 38
  },
  // modulesTbl:{
  //   position: "relative",
  //   top: 5,
  //   // overflowY:"hidden",
  //   // maxWidth: 320
  // },
  modulesTbl: {
    position: "relative",
    top: 5,
    // overflowY:"hidden",
    // maxWidth: 320
  },
  // column10: {
  //   flex: 1, // 10%
  // },
  // column60: {
  //   flex: 6, // 60%
  // },
  // column20: {
  //   flex: 2, // 20%
  //   alignItems: "flex-end"
  // }
  // columnModule: {
  //   flex: 4, // 10%
  // },
  // columnStatus: {
  //   flex: 3, // 20%
  // },
  // columnAction: {
  //   flex: 3, // 20%
  // }
});

export default styles;
