import { View, Text, Modal, TouchableOpacity, StyleSheet ,TouchableWithoutFeedback} from 'react-native';
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from "../../component/Dashboard/DashboardScreen";
import ExamScreen from "../../component/Exam/ExamScreen";
import Profile from '../../component/MyProfile/Profile';
import UserScreen from '../../component/User/UserScreen';
import RoleScreen from '../../component/Roles/RoleScreen';
import ManagePasswordScreen from '../../component/Password/ManagePasswordScreen';
import Settings from '../../component/Setting/Settings';
import DropDownPicker from "react-native-dropdown-picker";

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = ({ navigation }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [open, setOpen] = useState(false);  
  const [submenuOpen, setSubmenuOpen] = useState(false);  // New state for submenu visibility
  const [items, setItems] = useState([
    { label: 'Profile', value: 'profile' },
    // { label: 'Settings', value: 'settings' },
    { label: 'Logout', value: 'logout' },
    {
      label: 'Settings',
      value: 'settings',
      subItems: [
        { label: 'RoleScreen', value: 'RoleScreen' },
        { label: 'Invigilator Screen', value: 'manage_user' },
       
      ]
    }
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

  // const handleMenuPress = (value) => {
  //   setOpen(false); 
  //   if (value === 'logout') {
  //     handleLogout();
  //   } else if (value === 'profile') {  
  //     navigation.navigate('Profile');
  //   } else if (value === 'settings') {
  //     toggleMenu(); // Open submenu when "Settings" is clicked
  //   }
  // };
  
  const handleMenuPress = (value) => {
    if (value === 'logout') {
      handleLogout();
    } else if (value === 'profile') {
      navigation.navigate('Profile');
    // } else if (value === 'settings') {
    //   setSubmenuOpen(false);  // Close submenu if it was open
    //   navigation.navigate('Settings');

    } else if (value === 'settings') {
      setSubmenuOpen(!submenuOpen);  // Toggle submenu visibility
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
            } else if (route.name === 'Settings') {
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
          },
          tabBarLabelStyle: { fontSize: 14 },
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}
              >
                <Ionicons name="person-circle" size={34} color="#fff" />
                <Ionicons
                  onPress={() => setOpen(!open)}
                  name={open ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              <TouchableWithoutFeedback onPress={() => setOpen(false)}>
              <View style={{ position: 'absolute', top: 40, right: 0, zIndex: 1000 }}>
              {open && (
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            items={items}
            setItems={setItems}       
            onSelectItem={(item) => handleMenuPress(item.value)}
            containerStyle={{ width: 155 ,  borderColor: 'red' , borderWidth:0, borderBottomWidth:0  , marginTop:10 , position:"relative", left:8}}
            style={{  marginTop: 20, borderWidth:0,  backgroundColor:"rgb(219 219 219)",   display:"none"  }}
            // dropDownStyle={{ backgroundColor: 'green' ,   }}
            dropDownContainerStyle={{  borderWidth:0 ,  padding: 10, backgroundColor:"rgb(219 219 219)" , } }  // Dropdown items container style
            textStyle={{ fontSize: 16 }}
            placeholder="" // Set placeholder to null
            renderListItem={(props) => {
              const { item, isSelected } = props;

              if (item.subItems) {
                return (
                  <View>
                    <TouchableOpacity onPress={() => handleMenuPress(item.value)}>
                      <Text style={{ fontSize: 16, paddingVertical: 10, color: isSelected ? 'tomato' : 'black' }}>{item.label}</Text>
                    </TouchableOpacity>
                    {submenuOpen && item.value === 'settings' && item.subItems.map((subItem) => (
                      <TouchableOpacity key={subItem.value} onPress={() => handleMenuPress(subItem.value)} > 
                        <Text style={{ paddingLeft: 30, paddingVertical: 5, fontSize: 14, color: 'grey'  }}>{subItem.label} </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              }

              return (
                <TouchableOpacity onPress={() => handleMenuPress(item.value)}>
                  <Text style={{ fontSize: 16, paddingVertical: 10, color: isSelected ? 'tomato' : 'black' }}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
          />
)}

              </View>
              </TouchableWithoutFeedback>
            </View>
          ),
        })}
      >
        <BottomTab.Screen name="Dashboard" component={DashboardScreen} />
        <BottomTab.Screen name="Exam" component={ExamScreen} />
        <BottomTab.Screen name="Profile" component={Profile} options={{ tabBarButton: () => null }} />
        <BottomTab.Screen name="RoleScreen" component={RoleScreen} options={{ tabBarButton: () => null }} />
        <BottomTab.Screen name="UserScreen" component={UserScreen} options={{ tabBarButton: () => null }} />
        <BottomTab.Screen name="ManagePasswordScreen" component={ManagePasswordScreen} options={{ tabBarButton: () => null }} />
        <BottomTab.Screen name="Settings" component={Settings} options={{
          tabBarButton: (props) => <TouchableOpacity {...props} onPress={toggleMenu} />,
        }} />
      </BottomTab.Navigator>

      {/* Submenu Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        {/* This will catch clicks outside the menu */}
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menu}>
                <Text
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('UserScreen');
                  }}
                >
                  Manage Role
                </Text>
                <Text
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('RoleScreen');
                  }}
                >
                  Manage User
                </Text>
                <Text
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('ManagePasswordScreen');
                  }}
                >
                  Change Password
                </Text>
                <TouchableOpacity onPress={toggleMenu}>
                  <Text style={styles.closeMenu}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
    width: 150,
    backgroundColor: 'white',
    padding: 8,
    elevation: 5,
    top: 327,
    left: 132,
    alignItems:"flex-start"
    
  },
  menuItem: {
    textAlign: 'center',
    paddingTop:0,
    paddingBottom:12
  },
  closeMenu: {
    color: 'red',
    textAlign: 'center',
    // paddingVertical: 10,
 
  },
});

export default BottomTabNavigator;