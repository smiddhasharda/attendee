import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert,StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { ToastProvider } from './src/globalComponent/ToastContainer/ToastContext';
import { RoleProvider } from './src/component/Roles/RoleContext';
import LoginScreen from './src/component/Login/LoginScreen';
import RegisterScreen from './src/component/Register/RegisterScreen';
import ForgetPasswordScreen from './src/component/ForgetPassword/ForgetPasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerNavigator from './src/globalComponent/DrawerNavigatior/DrawerNavigatior';
import Learn from './src/component/Dashboard/Learn';
import  InvigilatorScreen from './src/component/Invigilator/InvigilatorScreen';
import PieChart from './src/component/Dashboard/PieChart';
import LoginNew from './src/component/Login/LoginNew';
import TabNavigator from './src/globalComponent/TabNavigator';
import StudentInfo from './src/component/Student/StudentInfo';
import RoomDetail from './src/component/Room/RoomDetail';

const Stack = createNativeStackNavigator();
// global.SERVER_URL = `http://localhost:5000`;
global.SERVER_URL= 'http://3.111.185.105:3502';

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        setInitialRoute(authToken ? 'PostLogin' : 'Login');
      } catch (error) {
        console.error('Error reading authToken from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const renderLoading = () => (
    <View style={{ flex: 1, backgroundColor:"plum",padding:60 }}>
      <StatusBar />     
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
  const renderRouting = () => (
    <Provider store={store}>
      <ToastProvider>
        <RoleProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
              <Stack.Screen name="PostLogin" component={DrawerNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="StudentInfo" component={StudentInfo} />
              <Stack.Screen name="RoomDetail" component={RoomDetail} />

               <Stack.Screen name="Learn" component={Learn} />
               <Stack.Screen name="InvigilatorScreen" component={InvigilatorScreen} />
               <Stack.Screen name="PieChart" component={PieChart} />
            </Stack.Navigator>
          </NavigationContainer>
        </RoleProvider>
      </ToastProvider>
    </Provider>
  );

  return loading ? renderLoading() : renderRouting();
 
  
};

export default App;
