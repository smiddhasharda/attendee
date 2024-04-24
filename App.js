import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
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
import  Task from './src/component/Dashboard/Task';
import PieChart from './src/component/Dashboard/PieChart';


const Stack = createNativeStackNavigator();
global.SERVER_URL = `http://localhost:5000`;
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
               <Stack.Screen name="Learn" component={Learn} />
               <Stack.Screen name="Task" component={Task} />
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
