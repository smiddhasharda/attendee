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
    flex:1,
    backgroundColor: "#E5E4E2",
    width: `${100}%`,
    // margin: `auto`,
    height: `${100}%`,
    flexDirection:"row",
  },

  otpbtn:{
   alignSelf:"center",
   justifyContent:"center", 
  },
  

  logoImageStyle: {
    width: ScreenWidth * 0.5, 
    height: ScreenWidth * 0.5,
    alignSelf: "center",
    // marginTop: ScreenHeight * 0.1, 
  },

  textInputContainer: {
    // marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // width: `${70}%` ,
    width: ScreenWidth * 0.5,
    alignSelf:"center",
    // marginRight:80,
    // width:900, 
    
   
  },

  checkboxContainer: {
    marginTop: 12,
    marginBottom: 12,
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    width: `${100}%`,
  },
  checkboxValue: {
    display: 'flex',
  },
  checkboxLabel: {
    color: "red",
    display: 'flex',
  },
  passwordTextInputContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonStyle: {
    height: 45,
    // width:   `${20.5}%`,
    width: ScreenWidth * 0.3,
    maxwidth:`auto`,
    //width: ScreenWidth * 0.9,
    backgroundColor: "#fea500",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 32,
    //elevation: 5,
    marginLeft:15,
    // marginRight:98,
    shadowRadius: 10,
    shadowOpacity: 0.8,
    shadowColor: "#166080",
     
    
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  loginTextStyle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupStyle: {
    marginTop: 8,
    //display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signupTextStyle: {
    color: "#acabb0",
    width: `${90}%`,
    marginTop: 8,
    textAlign: 'center',
    marginRight:10,

  },
  dividerStyle: {
    height: 0.5,
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 16,
    width: ScreenWidth * 0.8,
    alignSelf: "center",
    backgroundColor: "#ccc",
  },
  socialLoginContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  facebookSocialButtonTextStyle: {
    color: "#4267B2",
  },
  twitterSocialButtonTextStyle: {
    color: "#56bfe8",
  },
  discordSocialButtonTextStyle: {
    color: "#5865F2",
  },
  socialButtonStyle: {
    marginTop: 16,
  },
  eyeIconContainer: {
    right: 16,
    top: 14,
    position: "absolute",
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: "#555",
  },
  
  shakeText: {
    color: "red",
    marginTop: 8,
    marginLeft: 12,
    marginRight: "auto",
  },
  emailTextInputContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  textInputValue:{
    width: `${40}%`
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
  emailTooltipContentStyle: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emailTooltipBackgroundStyle: {
    backgroundColor: "transparent",
  },
  passwordTooltipStyle: {
    marginTop: 30,
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
  passwordTooltipBackgroundStyle: {
    backgroundColor: "transparent",
  },
  passwordTooltipContentStyle: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  // --------------------------------------------------------Media Querry----------------------------------------------------------//
  
  '@media (max-width: 768px)': {
    logoImageStyle: {
      width: '${100}%', 
      height: ScreenWidth * 0.3, 
    },

    otpbtn:{
      with:ScreenWidth * 0.5,
 
    },

    textInputContainer:{

    }
  },

  '@media (min-width: 1024px)': {
    
  },
 
});

export default LoginStyles;