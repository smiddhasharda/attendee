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
import Settings from '../../component/Setting/Settings';
import Profile from '../../component/MyProfile/Profile';
import DropDownPicker from "react-native-dropdown-picker";

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
  const [open, setOpen] = useState(false);  
  const [items, setItems] = useState([
    { label: 'Profile', value: 'profile' },
    { label: 'Settings', value: 'settings' },
    { label: 'Logout', value: 'logout' },
  ]);

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

  const handleMenuPress = (value) => {
    setOpen(false); 
    console.log(value); // Log the value to see what is being passed
  
    if (value === 'logout') {
      handleLogout();
    } else if (value === 'profile') {  
      navigation.navigate('Profile');
    } else if (value === 'settings') {
      navigation.navigate('Settings');
    }
  }
  
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
            else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
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

            textAlign:"center"
          },
          tabBarLabelStyle: {
            marginTop: 0,
            fontSize: 14,            
          },
          headerRight: () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
 <TouchableOpacity

  style={{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',  
    paddingHorizontal: 10, 
  }}
>
  <Ionicons name="person-circle" size={34} color="#fff" />
  <Ionicons
    onPress={() => setOpen(!open)}
    name={open ? 'chevron-up' : 'chevron-down'}
    size={20}
    color="#fff"
    style={{ marginLeft: 5 }}  // Adding some space between the icons
  />
</TouchableOpacity>

<View style={{ position: 'absolute', top: 40, right: 0, zIndex: 1000 }}>
    {open && (
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        items={items}
        setItems={setItems}
        onSelectItem={(item) => handleMenuPress(item.value)}
        containerStyle={{ width: 155 ,  borderColor: 'red' , borderWidth:0, borderBottomWidth:0  ,}}
        style={{  marginTop: 10, borderWidth:0,  backgroundColor:"rgb(219 219 219)",    }}
        // dropDownStyle={{ backgroundColor: 'green' ,   }}
        dropDownContainerStyle={{  borderWidth:0 ,backgroundColor:"rgb(219 219 219)" , } }  // Dropdown items container style
        textStyle={{ fontSize: 16 }}
      />
    )}
    </View>
  </View>
),

        })}
      >
        <BottomTab.Screen name="Dashboard" component={DashboardScreen} />
        <BottomTab.Screen name="Exam" component={ExamScreen} />
        <BottomTab.Screen name="Profile" component={Profile}   options={{
            tabBarLabel: () => null, 
            tabBarButton: () => null, 
          }} />
        <BottomTab.Screen name="RoleScreen" component={UserScreen} options={{
            tabBarLabel: () => null, 
            tabBarButton: () => null, 
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
          name="Settings"
          component={Settings}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={toggleMenu}  />
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
                Manage Role
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
    top:283,
    left:88,
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
