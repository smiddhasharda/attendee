import React, { useEffect, useState,useCallback } from "react";
import { View, Text, TouchableOpacity, Image,Button } from "react-native";
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
import Exam from '../../component/Dashboard/Exam';
import RoomDetail from '../../component/Dashboard/RoomDetail';
import StudentInfo from '../../component/Dashboard/StudentInfo';
import { multer } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";


const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ ...props }) => {
  const { showToast } = useToast();
  const [userImage, setUserImage] = useState( props.userData?.profile_image_url || '');
  const [open, setOpen] = useState(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

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
  const handleProfilePic = async () => {
    try {
      const authToken = await checkAuthToken();
      const formData = new FormData();
      formData.append('profile_pics', fileInputRef.current.files[0]); // Assuming you have a file input reference
      formData.append('tblName', 'tbl_user_master');
      formData.append('data', '');
      formData.append('fileParam', 'profile_image_url');
      formData.append('conditionString', `user_id = ${props.userData?.userId}`);
      console.log(formData)
      const response = await fetch('/api/multer', {
        data: formData,
        authToken
    });
      if (response) {
        showToast(
          `User File Update Successful`,
          "success"
        );
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        showToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        showToast("Module with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("Module Operation Failed", "error");
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
      <CustomeImagePicker imageUri={userImage} onImageChange={handleImageChange} />
     {props.userData?.profile_image_url != userImage && (<View style={{  flexDirection: 'row', justifyContent: 'space-between'}}>             
              <Button title="Cancel" onPress={()=>setUserImage(props.userData?.profile_image_url || '')} />
              <Button title="Save" onPress={handleProfilePic} />
            </View>)}
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

const DrawerNavigator = ({navigation}) => {
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
                  return <Exam navigation={navigation} />;
                  case "StudentScreen":
                  return <StudentScreen />;
                  case "RoomDetail":
                  return <RoomDetail />;
                  case "StudentInfo":
                    return <StudentInfo />;
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
