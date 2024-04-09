import { StyleSheet, Dimensions } from "react-native";

const { width: ScreenWidth } = Dimensions.get("screen");

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
      },
      
      logoImageStyle: {
        width: 200,
        height: 200,
        alignSelf: "center",
      },
      textInputContainer: {
        marginTop: 12,
        alignItems: "center",
        justifyContent: "center",
      },
      checkboxContainer: {
        marginTop: 12,
        alignItems: "center",
        justifyContent: "center",
      },
      passwordTextInputContainer: {
        marginTop: 16,
        alignItems: "center",
        justifyContent: "center",
      },
      loginButtonStyle: {
        height: 40,
        width: ScreenWidth * 0.9,
        backgroundColor: "#25a9e2",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 32,
        elevation: 5,
        shadowRadius: 8,
        shadowOpacity: 0.3,
        shadowColor: "#166080",
        shadowOffset: {
          width: 0,
          height: 3,
        },
      },
      loginTextStyle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
      signupStyle: {
        marginTop: 32,
        alignItems: "center",
        justifyContent: "center",
      },
      signupTextStyle: {
        color: "#acabb0",
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
        // tintColor: "#555",
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
//   container: {
//     flex: 1,
//     backgroundColor: "#f7f7f7",
//     paddingHorizontal: 20,
//   },
//   logoImageStyle: {
//     width: 200,
//     height: 200,
//     alignSelf: "center",
//     marginTop: 20,
//   },
//   textInputContainer: {
//     marginTop: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
  registerButtonStyle: {
    height: 40,
    width: ScreenWidth * 0.9,
    backgroundColor: "#25a9e2",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    elevation: 5,
    shadowRadius: 8,
    shadowOpacity: 0.3,
    shadowColor: "#166080",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
//   registerTextStyle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   loginStyle: {
//     marginTop: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   loginTextStyle: {
//     color: "#acabb0",
//   },
//   dividerStyle: {
//     height: 0.5,
//     marginTop: 24,
//     marginBottom: 12,
//     borderRadius: 16,
//     width: ScreenWidth * 0.8,
//     alignSelf: "center",
//     backgroundColor: "#ccc",
//   },
});

export default styles;
