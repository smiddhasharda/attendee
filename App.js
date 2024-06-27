import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { ToastProvider } from "./src/globalComponent/ToastContainer/ToastContext";
import { RoleProvider } from "./src/component/Roles/RoleContext";
import LoginScreen from "./src/component/Login/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerNavigator from "./src/globalComponent/DrawerNavigatior/DrawerNavigatior";
import ReportScreen from "./src/component/Report/ReportScreen";
import InvigilatorScreen from "./src/component/Invigilator/InvigilatorScreen";
import StudentInfo from "./src/component/Student/StudentInfo";
import RoomDetail from "./src/component/Room/RoomDetail";
import TopHeader from "./src/globalComponent/Header/TopHeader";
import ToastContainer from './src/globalComponent/ToastContainer/ToastContainer'; 
import { Provider as PaperProvider } from 'react-native-paper';

import SplashScreen from "./src/component/Splash/SplashScreen";

const Stack = createNativeStackNavigator();
// global.SERVER_URL = `http://localhost:5000`;
global.SERVER_URL = "http://3.111.185.105:3502";

const App = () => {
  const [initialRoute, setInitialRoute] = useState("Login");
  const [loading, setLoading] = useState(true);
  const [isShowSplashScreen, setIsShowSplashScreen] = useState(true);
  const TopHeaderCommonConfig = {
    headerStyle: {
      backgroundColor: "rgb(17, 65, 102)",
    },
    headerTitleContainerStyle: {
      // paddingLeft: 0, 
      marginLeft: 0,
      marginRight:0,
    },
    headerTintColor: "#fff",
  };
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        setInitialRoute(authToken ? "PostLogin" : "Login");
      } catch (error) {
        console.error("Error reading authToken from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplashScreen(false);
    }, 3000);
  });

  const renderLoading = () => (
    <View style={{ flex: 1, backgroundColor: "plum", padding: 60 }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
  const renderRouting = () => (
    <Provider store={store}>
        <PaperProvider>
      <StatusBar   barStyle="light-content" backgroundColor="#6a51ae"  />
      <ToastProvider>
        <ToastContainer/>
        <RoleProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PostLogin"
                component={DrawerNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="StudentInfo"
                component={StudentInfo}
                options={TopHeaderCommonConfig}
              />
              <Stack.Screen
                name="RoomDetail"
                component={RoomDetail}
                options={({ route }) => ({
                  title: `Room Info: ${route.params.room_Nbr}`,
                  ...TopHeaderCommonConfig,
                })}
              />
              <Stack.Screen
                name="TopHeader"
                component={TopHeader}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ReportScreen"
                component={ReportScreen}
                options={TopHeaderCommonConfig}
              />
              <Stack.Screen
                name="InvigilatorScreen"
                component={InvigilatorScreen}
                options={TopHeaderCommonConfig}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </RoleProvider>
      </ToastProvider>
      </PaperProvider>
    </Provider>
  );

  return  <View style={styles.container}>
  {/* {isShowSplashScreen ? <SplashScreen /> : loading ? renderLoading() : renderRouting()} */}
  { loading ? renderLoading() : renderRouting()}
</View> 
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
