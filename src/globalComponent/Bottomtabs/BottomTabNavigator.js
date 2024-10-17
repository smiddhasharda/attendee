import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from "../../component/Dashboard/DashboardScreen";
import ExamScreen from "../../component/Exam/ExamScreen";
import Privacy from "../../component/LandingScreeens/Privacy";
import LoginScreen from "../../component/Login/LoginScreen";
import UserScreen from '../../component/User/UserScreen';
import RoleScreen from '../../component/Roles/RoleScreen';
  import ManagePasswordScreen from '../../component/Password/ManagePasswordScreen';
 import MyProfile from '../../component/Profile/MyProfile';
const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Create a Stack Navigator for RoleScreen, ManagePasswordScreen, etc.
// const RoleStackNavigator = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="RoleScreen" component={RoleScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="ManagePasswordScreen" component={ManagePasswordScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="UserScreen" component={UserScreen} options={{ headerShown: false }} />
//     </Stack.Navigator>
//   );
// };

const BottomTabNavigator = ({ navigation }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("Login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <BottomTab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Exam') {
              iconName = focused ? 'book' : 'book-outline';

            } else if (route.name === 'UserScreen') {
              iconName = focused ? 'person' : 'person-outline';
            }
            else if (route.name === 'MyProfile') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }

            return <Ionicons name={iconName} size={22} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: '#fff',
              headerStyle: {
              backgroundColor: 'rgb(17, 65, 102)', 
              headerTintColor: '#fff', 
              headerTitleStyle: {
              fontWeight: 'bold',
            },
            },
            headerTintColor: 'white', 

          tabBarStyle: {
            backgroundColor: 'rgb(17, 65, 102)',
            padding: 5,
            height: 64,
          },
          tabBarLabelStyle: {
            marginTop: 4,
            fontSize: 14,
            
          },
        })}
      >
        <BottomTab.Screen name="Dashboard" component={DashboardScreen} />
        <BottomTab.Screen name="Exam" component={ExamScreen} />
        <BottomTab.Screen name="RoleScreen" component={UserScreen} options={{
            tabBarLabel: () => null, 
            tabBarButton: () => null, // Hide the button entirely
          }}/>  
        <BottomTab.Screen name="UserScreen" component={UserScreen} options={{
            tabBarLabel: () => null, 
            tabBarButton: () => null, // Hide the button entirely
          }} />
            <BottomTab.Screen name="ManagePasswordScreen" component={ManagePasswordScreen} options={{
            tabBarLabel: () => null, 
            tabBarButton: () => null, // Hide the button entirely
          }} />
        {/* <BottomTab.Screen name="RoleStack" component={RoleStackNavigator}   options={{
            tabBarLabel: () => null, 
            tabBarButton: () => null, // Hide the button entirely
          }}/> */}
        <BottomTab.Screen
          name="MyProfile"
          component={MyProfile}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={toggleMenu} />
            ),
          }}
        />
      </BottomTab.Navigator>

      {/* Dropdown menu modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menu}>
            <Text
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                navigation.navigate('UserScreen');
                // navigation.navigate('RoleStack' ,{screen :'UserScreen'})
              }}
            >
              User Role
            </Text>
            <Text
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                navigation.navigate('RoleScreen');
                // navigation.navigate('RoleStack', { screen: 'RoleScreen' }); 
                
              }}
            >
              Manage User
            </Text>
            <Text
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                navigation.navigate('ManagePasswordScreen');
                // navigation.navigate('RoleStack', { screen: 'ManagePasswordScreen' }); 
              }}
            >
              Change Password
            </Text>
            <TouchableOpacity onPress={toggleMenu}>
              <Text style={styles.closeMenu}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    textAlign: 'center',
  },
  closeMenu: {
    color: 'red',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default BottomTabNavigator;
