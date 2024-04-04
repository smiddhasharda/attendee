import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from "@react-navigation/drawer";
import RoleScreen from "../../component/Roles/RoleScreen";
import ModuleScreen from "../../component/Module/ModuleScreen";
import DashboardScreen from "../../component/Dashboard/DashboardScreen";
import UserScreen from "../../component/User/UserScreen";
import ExamScreen from "../../component/Exam/ExamScreen";
import StudentScreen from "../../component/Exam/StudentScreen";
import { logout } from "../../AuthService/AuthService";
import DropDownPicker from "react-native-dropdown-picker";
import CustomeImagePicker from "../CustomeImagePicker/CustomeImagePicker";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ ...props }) => {
  const [userImage, setUserImage] = useState( props.userData?.profile_image_url || '');
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await logout();
      props?.navigation.replace("Login");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleImageChange = (imageSource) => {
    setUserImage(imageSource);
  };
  console.log("User Image : ",userImage);


  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
      <CustomeImagePicker imageUri={userImage} onImageChange={handleImageChange} />
        <Text>{props?.userData?.name}</Text>
        <DropDownPicker
          open={open}
          value={props?.userRoleIndex}
          items={props?.userRoleList}
          setOpen={setOpen}
          setValue={(value) => props?.handleRoleSelect(value)}
          containerStyle={{ marginTop: 20, width: "30%", alignSelf: "center" }}
          style={{ backgroundColor: "#fafafa" }}
          labelStyle={{ fontSize: 16, textAlign: "left", color: "#000" }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
          dropDownMaxHeight={150}
          dropDownDirection="TOP"
        />
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity onPress={handleLogout}>
        <Text style={{ margin: 16 }}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const [userRolePermission, setUserRolePermission] = useState([]);
  const [userRoleList, setUserRoleList] = useState([]);
  const [userRoleIndex, setUserRoleIndex] = useState(0);
  const [userData, setUserData] = useState("");
  const handleRoleSelect = (value) => {
    setUserRoleIndex(value);
  };

  useEffect(() => {
    const fetchUserRolePermission = async () => {
      try {
        const userRoleArray = await AsyncStorage.getItem("userRolePermission");
        const parsedUserRoleArray = userRoleArray
          ? JSON.parse(userRoleArray)
          : [];
        const userDataArray = await AsyncStorage.getItem("userData");
        const parsedUserDataArray = userDataArray
          ? JSON.parse(userDataArray)
          : [];
        const RoleList = parsedUserRoleArray?.map((item, index) => ({
          label: item?.rolePermission?.[0]?.roleName,
          value: index,
          module: item?.modulePermission,
        }));
        setUserRoleList(RoleList);
        setUserRolePermission(parsedUserRoleArray);
        setUserData(parsedUserDataArray);       
      } catch (error) {
        console.error("Error fetching user role permission:", error);
      }
    };

    fetchUserRolePermission();
  }, []);

  if (!userRolePermission || userRolePermission.length === 0 || !userRoleList) {
    return (
      <View>
        <Text>
          You do not have access to any modules. Please contact admin first!
        </Text>
      </View>
    );
  }
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          handleRoleSelect={handleRoleSelect}
          userRoleList={userRoleList}
          userRoleIndex={userRoleIndex}
          userData={userData}
        />
      )}
    >
      {userRoleList?.[userRoleIndex]?.module
        .filter((module) => module?.read === 1)
        .map((module, index) => (
          <Drawer.Screen
            key={index}
            name={module?.moduleMaster[0]?.moduleName}
            component={() => {
              switch (module?.moduleMaster[0]?.moduleName) {
                case "RoleScreen":
                  return <RoleScreen />;
                case "ModuleScreen":
                  return <ModuleScreen />;
                case "Dashboard":
                  return <DashboardScreen />;
                case "UserScreen":
                  return <UserScreen />;
                case "ExamScreen":
                  return <ExamScreen />;
                  case "StudentScreen":
                  return <StudentScreen />;
                default:
                  return null;
              }
            }}
          />
        ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
