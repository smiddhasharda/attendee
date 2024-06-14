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
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgb(17, 65, 102)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  moduleListContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    backgroundColor: "#0C7C62",
    padding: 4,
    borderRadius: 5,
  },
  listItemActionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  updatebtn: {
    width: 120,
    backgroundColor: "#0C7C62",
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    textAlign: "center",
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
  addBtn: {
    alignItems:"flex-end", 
    position: "relative", 
    bottom: 38
  },
  modulesTbl:{
    position: "relative",
    top: -20
  },
});

export default styles;
