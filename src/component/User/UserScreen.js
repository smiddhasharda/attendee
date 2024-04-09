import React, { useState, useEffect, useCallback } from "react";
import {Image, View, Text, Button, TextInput, FlatList, StyleSheet, Pressable, LayoutAnimation} from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import passwordValidator from "../../helpers/passwordValidator";
import emailValidator from "../../helpers/emailValidator";
import useStateWithCallback from "../../helpers/useStateWithCallback";
import Tooltip from "../../globalComponent/ToolTip/Tooltip";
import CheckBox from "expo-checkbox";
const UserScreen = () => { 
  const { showToast } = useToast();
  const [userData, setUserData] = useState({
    userId: '',
    name: '',
    password: '',
    emailId:'',
    contactNumber:'',
    status: 1,
    rolePermissions:[]
  });
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [userContainerVisible, setUserContainerVisible] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isEmailTooltipVisible, setEmailTooltipVisible] = useStateWithCallback(false);
  const [isNameTooltipVisible, setNameTooltipVisible] = useStateWithCallback(false);
  const [isContactNumberTooltipVisible, setContactNumberTooltipVisible] = useStateWithCallback(false);
  const [isPasswordTooltipVisible, setPasswordTooltipVisible] = useStateWithCallback(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleAddUser = async () => {
    try {
      const authToken = await checkAuthToken();
      if (!handleNameValidation()) return;
      if (!handlePasswordValidation()) return;
      if (!handleEmailValidation()) return;
      if (!handleContactNumberValidation()) return;
      const response = await insert(
        {
          operation: "insert",
          tblName: "tbl_user_master",
          data: {
            username: userData.emailId,
            name: userData.name,           
            password: userData.password,
            contact_number: userData.contactNumber,
            email_id: userData.emailId,
            isActive: userData.status,
            isVerified: 1
          },
          conditionString: '',
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        if (userData?.rolePermissions) {
          const rolePermissionsWithId = userData?.rolePermissions?.map(
            (permissions) => ({
              FK_userId: response?.data?.insertId,
              ...permissions,
            })
          );

          await insert(
            {
              operation: "insert",
              tblName: "tbl_user_role_permission",
              data: rolePermissionsWithId,
              conditionString: "",
              checkAvailability: "",
              customQuery: "",
            },
            authToken
          );

          showToast("User Add Successful", "success");
          await handleClose();
          handleGetUserList();
        }
        else {
          showToast("User Add Successful", "success");
          await handleClose();
          handleGetUserList();
        }
     
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const authToken = await checkAuthToken();
      handleNameValidation();
      handlePasswordValidation();
      handleEmailValidation();
      handleContactNumberValidation();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_user_master",
          data: {
            name: userData.name,           
            password: userData.password,
            contact_number: userData.contactNumber,
            email_id: userData.emailId,
            isActive: userData.status,
          },
          conditionString: `user_id = ${userData.userId}`,
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        if (userData?.rolePermissions) {
          const rolePermissionsWithId = userData?.rolePermissions?.map(
            (permissions) => (
              permissions?.Id
                ? { ...permissions }
                : {
                    Id: 0,
                    FK_userId: userData?.userId,
                    ...permissions,
                  }
            )
          );

          await update(
            {
              operation: "update",
              tblName: "tbl_user_role_permission",
              data: rolePermissionsWithId,
              conditionString: `PK_user_role_permissionId = ? `,
              checkAvailability: true,
              customQuery: "",
            },
            authToken
          );

          showToast("User Update Successful", "success");
          await handleClose();
          handleGetUserList();
        }
        else {
          showToast("User Update Successful", "success");
          await handleClose();
          handleGetUserList();
        }
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetUserList = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "custom",
          tblName: "tbl_user_master",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: `select JSON_ARRAYAGG(json_object('user_id',p.user_id,'username',username,'password',p.password,'name',p.name,'contact_number',p.contact_number,'email_id',p.email_id,'profile_image_url',p.profile_image_url,'isActive',p.isActive,'rolePermission',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'Id',q.PK_user_role_permissionId,'FK_userId', q.FK_userId,'FK_RoleId', q.FK_RoleId,'isActive',q.isActive) ), ']') AS JSON ) FROM tbl_user_role_permission q WHERE q.FK_userId = p.user_id ))) AS UserMaster from tbl_user_master p`,
        },
        authToken
      );

      if (response) {
        setUserList(response?.data?.[0]?.UserMaster);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUserStatus = async (userId, status) => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_user_master",
          data: { isActive: !status },
          conditionString: `user_id = ${userId}`,
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        showToast(
          `User ${status === 0 ? "Active" : "Inactive"} Successful`,
          "success"
        );
        handleGetUserList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleEditUser = async (selectedUser) => {
      setUserData({
        userId: selectedUser.user_id,
        name: selectedUser.name,
        password: selectedUser.password,
        emailId: selectedUser.email_id,
        contactNumber: selectedUser.contact_number,
        status: selectedUser.isActive,
        rolePermissions: selectedUser.rolePermission
      });
      setUserContainerVisible(true);
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        showToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        showToast("User with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("User Operation Failed", "error");
    }
  };

  const handleClose = async () => {
    setUserContainerVisible(false);
    setUserData({
      userId: '',
      name: '',
      password: '',
      emailId:'',
      contactNumber:'',
      status: 1,
      rolePermissions:[]
    });
  };
  const handlePasswordChange = (text) => {
    isPasswordTooltipVisible && setPasswordTooltipVisible(false);
    setUserData({ ...userData, password: text });
  };
  const handleEyePress = () => {
    setPasswordVisible((oldValue) => !oldValue);
  };
  const handlePasswordValidation = () => {
    if (passwordValidator(userData.password)) {
        setPasswordTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setPasswordTooltipVisible(true);
      return false;
    }
  };
  const renderPasswordInput = () => {
    const eyeIcon = isPasswordVisible
      ? require("../../local-assets/eye.png")
      : require("../../local-assets/eye-off.png");


    const renderTooltipContent = () =>
        <View style={styles.passwordTooltipContainer}>
          <Text style={styles.passwordTooltipTextStyle}>
            Incorrect{" "}
            <Text style={styles.passwordTooltipRedTextStyle}>password</Text>
          </Text>
        </View>;

    return (
        <View style={styles.passwordTextInputContainer}>
          {isPasswordTooltipVisible && (
            <Tooltip>{renderTooltipContent()}</Tooltip>
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={userData.password}
            secureTextEntry={!isPasswordVisible}
            onChangeText={handlePasswordChange}
            enableIcon
            iconImageSource={eyeIcon}
            autoCapitalize="none"
            onFocus={() => {
              setPasswordTooltipVisible(false);
            }}
            onIconPress={handleEyePress}
          />
           {/* <TextInput
          style={styles.input} 
          placeholder="Password"
          value={userData.password}
          secureTextEntry={!isPasswordVisible}
          onChangeText={handlePasswordChange}
          autoCapitalize="none"
          onFocus={() => {
            setPasswordTooltipVisible(false);
          }}
        />
        <Pressable
          style={styles.eyeIconContainer}
          onPress={handleEyePress}
        >
          <Image
            style={styles.eyeIcon}
            source={eyeIcon}
            resizeMode="contain"
          />
        </Pressable> */}
        </View>
    );
  };

  const renderEmailInput = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That{" "}
          <Text style={styles.emailTooltipRedTextStyle}>email address</Text>{" "}
          doesn't look right
        </Text>
      </View>
    );
    return (
      <View style={styles.emailTextInputContainer}>
        <>
          {isEmailTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
               style={styles.input}
            placeholder="emailId"
            value={userData.emailId}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            onFocus={() => setEmailTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const handleEmailValidation = () => {
    if (emailValidator(userData.emailId)) {
        setEmailTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setEmailTooltipVisible(true);
      return false;
    }
  };
  const handleEmailChange = (text) => {
    isEmailTooltipVisible && setEmailTooltipVisible(false);
    setUserData({ ...userData, emailId: text });
  };

  const renderNameInput = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That{" "}
          <Text style={styles.emailTooltipRedTextStyle}>name</Text>{" "}
          is required !
        </Text>
      </View>
    );
    return (
      <View style={styles.nameTextInputContainer}>
        <>
          {isNameTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={userData.name}
            onChangeText={handleNameChange}
            onFocus={() => setNameTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const handleNameValidation = () => {
    if (userData.name) {
      setNameTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setNameTooltipVisible(true);
      return false;
    }
  };
  const handleNameChange = (text) => {
    isNameTooltipVisible && setNameTooltipVisible(false);
    setUserData({ ...userData, name: text });
  };

  const renderContactNumberInput = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That{" "}
          <Text style={styles.emailTooltipRedTextStyle}>contact number</Text>{" "}
          is required !
        </Text>
      </View>
    );
    return (
      <View style={styles.contactTextInputContainer}>
        <>
          {isContactNumberTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
            style={styles.input}
            placeholder="Contact Number "
            value={userData.contactNumber}
            onChangeText={handleContactNumberChange}
            onFocus={() => setContactNumberTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const handleContactNumberValidation = () => {
    if (userData.contactNumber) {
      setContactNumberTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setContactNumberTooltipVisible(true);
      return false;
    }
  };
  const handleContactNumberChange = (text) => {
    isContactNumberTooltipVisible && setContactNumberTooltipVisible(false);
    setUserData({ ...userData, contactNumber: text });
  };
  const handleUpdatePermissions = (role,permission) => {
    setUserData((prevData) => {
      const updatedRolePermissions = prevData?.rolePermissions ? [...prevData.rolePermissions] : [];
      const existingRoleIndex = updatedRolePermissions.findIndex(
        (data) => data?.FK_RoleId === role?.PK_RoleId
      );
      if (existingRoleIndex !== -1) {
        const updatedRole = {
          ...updatedRolePermissions[existingRoleIndex],
          [permission]:
            !updatedRolePermissions[existingRoleIndex][permission],
        };

        updatedRolePermissions[existingRoleIndex] = updatedRole;
      }
      // if (existingRoleIndex !== -1) {
      //   updatedRolePermissions.splice(existingRoleIndex, 1);
      // }
       else {
        const newRole = {
          FK_RoleId: role?.PK_RoleId,
          isActive : 1
        };
  
        updatedRolePermissions.push(newRole);
      }
  
      return {
        ...prevData,
        rolePermissions: updatedRolePermissions,
      };
    });
  };
  const getRolePermission = (role, permission) => {
    const roleData = userData?.rolePermissions?.find(
      (item) => item?.FK_RoleId === role?.PK_RoleId
    );
    return roleData?.[permission] || false;
  };
  
  const renderRoleCheckboxes = (item) => {
    return (
      <View style={styles.listItem} key={item?.PK_ModuleId}>
        <Text style={[styles.listItemText, { flex: 2 }]}>
          {item?.roleName}
        </Text>
        <View style={[styles.checkboxContainer, { flex: 1 }]}>
          <CheckBox
            value={getRolePermission(item,'isActive')}
            onValueChange={() =>handleUpdatePermissions(item,'isActive') }
          />
        </View>
      </View>
    );
  };

  const handleGetRoleList = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "fetch",
          tblName: "tbl_role_master",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        setRoleList(response?.data);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const renderRoleList = () =>{
    return(
  <View>
    <Text style={styles.header}> Role List : </Text>
    <FlatList
      data={roleList}
      keyExtractor={(item) => item?.PK_RoleId?.toString()}
      ListHeaderComponent={() => (
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>
            Role Name
          </Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>
            Access
          </Text>
        </View>
      )}
      renderItem={({ item }) => renderRoleCheckboxes(item)}
    />
    </View>
    )
  }

  useEffect(() => {
    handleGetUserList();
    handleGetRoleList();
  }, []);
  // const renderItem = ({ item }) => (
  //   <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
  //     <Text>Name: {item.name}</Text>
  //     <Text>Role: {item.role}</Text>
  //   </View>
  // );
    return (
      <View style={styles.container}>
      {userContainerVisible ? (
        <View style={styles.formContainer}>
          {renderNameInput()}
          {renderPasswordInput()}
          {renderEmailInput()}
          {renderContactNumberInput()}
          {renderRoleList()}
          {userData.userId ? (
            <View style={styles.buttonContainer}>
              <Button title="Update User" onPress={handleUpdateUser} />
              <Button title="Cancel" onPress={handleClose} />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Button title="Add New User" onPress={handleAddUser} />
              <Button title="Cancel" onPress={handleClose} />
            </View>
          )}
        </View>
      ) : <View>
        <Text style={styles.header}>User List:</Text>
      <Button title="Add" onPress={() => setUserContainerVisible(true)} />
      <FlatList
  data={userList}
  keyExtractor={(item) => item.user_id.toString()}
  ListHeaderComponent={() => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderText, { flex: 2 }]}>User Name</Text>
      <Text style={[styles.tableHeaderText, { flex: 3 }]}>Contact Number</Text>
      <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
      <Text style={[styles.tableHeaderText, { flex: 1 }]}>Actions</Text>
    </View>
  )}
  renderItem={({ item }) => (
    <View style={styles.listItem}>
      <Text style={[styles.listItemText, { flex: 2 }]}>{item.name}</Text>
      <Text style={[styles.listItemText, { flex: 3 }]}>{item.contact_number}</Text>
      <Pressable onPress={() =>handleUserStatus(item.user_id, item?.isActive)}>
      <Text style={[styles.listItemText, { flex: 1 }, item.isActive ? styles.listItemActiveStatus : styles.listItemInactiveStatus]}>{item.isActive ? "Active" : "Inactive"}</Text>
      </Pressable>
  
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button
          title="Edit"
          onPress={() => handleEditUser(item)}
          style={styles.listItemEditButton}
          textStyle={styles.listItemEditText}
        />
      </View>
    </View>
  )}
/>
        </View>}
    </View>
       
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  listItemText: {
    flex: 1,
  },
  listItemActiveStatus: {
    color: 'green',
  },
  listItemInactiveStatus: {
    color: 'red',
  },
  listItemEditButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
  listItemEditText: {
    color: 'white',
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
  passwordTextInputContainer: {
    // marginTop: 16,
    // alignItems: "center",
    // justifyContent: "center",
  },
  dividerStyle: {
    height: 0.5,
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 16,
    alignSelf: "center",
    backgroundColor: "#ccc",
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
    // alignItems: "center",
    // justifyContent: "center",
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
});

export default UserScreen;