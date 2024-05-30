import {
  ViewStyle,
  ImageStyle,
  Dimensions,
  StyleSheet,
  TextStyle,
} from "react-native";

const { width: ScreenWidth, height:ScreenHeight } = Dimensions.get("screen");

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",
    position: "absolute",
    zIndex: 2,
    width: "80%",
    top: "24%",
    left: "10%",
    padding: 25,
    height: 400
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold"
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  loginheading: {
    fontWeight: "bold",
    fontSize: 28,
    alignItems: "center",
  },
  loginsubheading: {
    fontSize: 16,
  },
  loginheadWrap: {
    width: "100%",
    // padding: 12,
  },
  logininfoWrap: {
    width: "100%",
    // padding: 12,
  },
  bgimg1: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
    top: "-60%",
    transform: [{ rotate: '132deg' }],
    left: "-70%",
  },
  bgimages2: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    transform: [{ rotate: '450deg' }],
    right: "-78%",
    bottom: -250,
  },
  loginButtonStyle: {
    height: 45,
    width: 180, 
    backgroundColor: "#fea500",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 8,
    marginLeft:0,
    // marginLeft: 14,
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0)',

  },  
  loginTextStyle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emailTooltipContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  
  },
  emailTooltipTextStyle: {
    fontSize: 16,
  },
  emailTooltipRedTextStyle: {
    fontWeight: "bold",
    color: "red",
  },
  passwordTooltipContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordTooltipTextStyle: {
    fontSize: 16,
  },
  passwordTooltipRedTextStyle: {
    fontWeight: "bold",
    color: "red",
  },
  
});

export default LoginStyles;