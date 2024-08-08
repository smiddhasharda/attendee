import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, ActivityIndicator, StyleSheet, StatusBar, RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { ToastProvider } from "./src/globalComponent/ToastContainer/ToastContext";
import { RoleProvider } from "./src/component/Roles/RoleContext";
import { RefreshProvider, RefreshContext } from "./src/globalComponent/Refresh/RefreshContext";
import LoginScreen from "./src/component/Login/LoginScreen";
import DrawerNavigator from "./src/globalComponent/DrawerNavigatior/DrawerNavigatior";
import InvigilatorScreen from "./src/component/Invigilator/InvigilatorScreen";
import StudentInfo from "./src/component/Student/StudentInfo";
import RoomDetail from "./src/component/Room/RoomDetail";
import TopHeader from "./src/globalComponent/Header/TopHeader";
import ToastContainer from './src/globalComponent/ToastContainer/ToastContainer'; 

const Stack = createNativeStackNavigator();
global.SERVER_URL = "http://3.111.185.105:3502";

const AppContent = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [initialRoute, setInitialRoute] = useState("Login");
  const [loading, setLoading] = useState(true);

  const { triggerRefresh } = useContext(RefreshContext);

  const TopHeaderCommonConfig = {
    headerStyle: {
      backgroundColor: "rgb(17, 65, 102)",
    },
    headerTitleContainerStyle: {
      marginLeft: 0,
      marginRight: 0,
    },
    headerTintColor: "#fff",
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    triggerRefresh(); 
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [triggerRefresh]);

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

  const renderLoading = () => (
    <View style={{ flex: 1, backgroundColor: "plum", padding: 60 }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  const renderRouting = () => (
    <Provider store={store}>
      <PaperProvider>
        <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
        <ToastProvider>
          <ToastContainer />
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

  return (
    <SafeAreaView style={styles.container} >
      {/* <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      > */}
       {loading ? renderLoading() : renderRouting()}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const App = () => (
  <RefreshProvider>
    <AppContent />
  </RefreshProvider>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
