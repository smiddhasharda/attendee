import React, { useState, useEffect, useCallback } from "react";
import {View, Text, TextInput, FlatList, StyleSheet, Pressable, LayoutAnimation, Dimensions,Platform} from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import passwordValidator from "../../helpers/passwordValidator";
import emailValidator from "../../helpers/emailValidator";
import useStateWithCallback from "../../helpers/useStateWithCallback";
import Tooltip from "../../globalComponent/ToolTip/Tooltip";
import CheckBox from "expo-checkbox";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons,AntDesign,Feather} from "@expo/vector-icons";
import Pagination from "../../globalComponent/Pagination/PaginationComponent";
import ShimmerEffect from "../../globalComponent/Refresh/ShimmerEffect";
import CryptoJS from 'crypto-js';

const UserScreen = ({userAccess,userData}) => { 
  const UserAccess = userAccess?.module?.find( (item) => item?.FK_ModuleId === 4 );
  const [refreshing, setRefreshing] = useState(false);
  const { addToast } = useToast();
  const [userDetails, setUserDetails] = useState({
    userId: '',
    name: '',
    password: '',
    emailId:'',
    contactNumber:'',
    username:'',
    status: 1,
    rolePermissions:[]
  });
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [userContainerVisible, setUserContainerVisible] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isEmailTooltipVisible, setEmailTooltipVisible] = useStateWithCallback(false);
  const [isNameTooltipVisible, setNameTooltipVisible] = useStateWithCallback(false);
  const [isEmplyIdTooltipVisible, setEmplyIdTooltipVisible] = useStateWithCallback(false);
  const [isContactNumberTooltipVisible, setContactNumberTooltipVisible] = useStateWithCallback(false);
  const [isPasswordTooltipVisible, setPasswordTooltipVisible] = useStateWithCallback(false);
    //---------------------------------------------------- dimension based view--------------------------------------------//
    const { width, height } = Dimensions.get('window');
    const isMobile = width < 768; 
    const tableWidth = isMobile ? width  : width * 0.95; 
    const tableHeight = isMobile ? height * 0.68 : height * 0.6; 
    // console.log(`Table Width: ${tableWidth}, Table Height: ${tableHeight} `,);
    const tableWidth1 = isMobile ? width-200 : width * 0.96; 
    const tableHeight1 = isMobile ? height * 0.4  : height * 0.24; 
    // console.log(`Table Width1: ${tableWidth1}, Table Height1: ${tableHeight1}, `,);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 25;
  const paginatedData = userList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // const duplicatePageSize = 10;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const checkAuthToken = useCallback(async () => {
    const authToken = atob( await AsyncStorage.getItem(btoa("authToken")));

    if (!authToken) {
      addToast("Authentication token is not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [addToast]);

  const decrypt = (encryptedData) => {
    const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
    const [iv, encrypted] = encryptedData.split(':');
    const ivBytes = CryptoJS.enc.Hex.parse(iv);
    const encryptedBytes = CryptoJS.enc.Hex.parse(encrypted);
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedBytes },
      CryptoJS.enc.Utf8.parse(encryptScreteKey),
      {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  const generateIV = () => {
    if (Platform.OS === 'web') {
      // For web, use CryptoJS's random generator
      return CryptoJS.lib.WordArray.random(16);
    } else {
      // For React Native, use a simple random number generator
      const arr = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return CryptoJS.lib.WordArray.create(arr);
    }
  };
  
  const encrypt = (plaintext) => {
    const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
    const iv = generateIV();
    const key = CryptoJS.enc.Utf8.parse(encryptScreteKey);
    
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  
    const encryptedBase64 = encrypted.toString();
    const ivHex = CryptoJS.enc.Hex.stringify(iv);
  
    return `${ivHex}:${encryptedBase64}`;
  };

  const handleAddUser = async () => {
    try {
      const authToken = await checkAuthToken();
      if (!handleNameValidation()) return;
      if (!handleEmployeeIdValidation()) return;
      if (!handlePasswordValidation()) return;
      if (!handleEmailValidation()) return;
      if (!handleContactNumberValidation()) return;
      const Parameter ={
        operation: "insert",
        tblName: "tbl_user_master",
        data: {
          username: userDetails.emailId,
          name: userDetails.name,           
          password: userDetails.password,
          contact_number: userDetails.contactNumber,
          email_id: userDetails.emailId,
          username:userDetails.username,
          isActive: userDetails.status,
          status:'External',
          isVerified: 1,
          firstLoginStatus:0,
          createdBy:`${userData?.name} (${userData?.username})`
        },
        conditionString: `username = '${userDetails.emailId}' OR email_id = '${userDetails.emailId}'` ,
        checkAvailability: true,
        customQuery: '',
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      const response = await insert(
        encryptedParams,
        authToken
      );

      if (response) {
        if (userDetails?.rolePermissions) {
          const rolePermissionsWithId = userDetails?.rolePermissions?.map(
            (permissions) => ({
              FK_userId: response?.data?.receivedData?.insertId,
              created_by:`${userData?.name} (${userData?.username})`,
              ...permissions,
            })
          );
          const Parameter1 ={
            operation: "insert",
            tblName: "tbl_user_role_permission",
            data: rolePermissionsWithId,
            conditionString: "",
            checkAvailability: "",
            customQuery: "",
          };
          const encryptedParams1 = encrypt(JSON.stringify(Parameter1));
          
          await insert(
            encryptedParams1,
            authToken
          );

          addToast("User is created successfully!", "success");
          await handleClose();
          handleGetUserList();
        }
        else {
          addToast("User is created successfully!", "success");
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
      handleEmailValidation();
      handlePasswordValidation();
      handleEmailValidation();
      handleContactNumberValidation();
      const Parameter ={
        operation: "update",
        tblName: "tbl_user_master",
        data: {
          name: userDetails.name,           
          password: userDetails.password,
          contact_number: userDetails.contactNumber,
          email_id: userDetails.emailId,
          username:userDetails.username,
          isActive: userDetails.status,
          firstLoginStatus:0,
          updatedBy:`${userData?.name} (${userData?.username})`
        },
        conditionString: `user_id = ${userDetails.userId}`,
        checkAvailability: '',
        customQuery: '',
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      const response = await update(
        encryptedParams,
        authToken
      );

      if (response) {
        if (userDetails?.rolePermissions) {
          const rolePermissionsWithId = userDetails?.rolePermissions?.map(
            (permissions) => (
              permissions?.Id
                ? { ...permissions }
                : {
                    Id: 0,
                    FK_userId: userDetails?.userId,
                    updated_by:`${userData?.name} (${userData?.username})`,
                    ...permissions,
                  }
            )
          );

          const Parameter1 = {
            operation: "update",
            tblName: "tbl_user_role_permission",
            data: rolePermissionsWithId,
            conditionString: `PK_user_role_permissionId = ? `,
            checkAvailability: true,
            customQuery: "",
          };
          const encryptedParams1 = encrypt(JSON.stringify(Parameter1));

          await update(
            encryptedParams1,
            authToken
          );

          addToast("User is updated successfully!", "success");
          await handleClose();
          handleGetUserList();
        }
        else {
          addToast("User is updated successfully!", "success");
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
      const Parameter =  {
        operation: "custom",
        tblName: "tbl_user_master",
        data: '',
        conditionString: '',
        checkAvailability: '',
        customQuery: `select JSON_ARRAYAGG(json_object('user_id',p.user_id,'username',username,'password',p.password,'name',p.name,'contact_number',p.contact_number,'email_id',p.email_id,'profile_image_url',p.profile_image_url,'status',p.status,'createdBy',p.createdBy,'updatedBy',p.updatedBy,'createdDate',p.createdDate,'updatedDate',p.updatedDate,'firstLoginStatus',p.firstLoginStatus,'isActive',p.isActive,'rolePermission',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'Id',q.PK_user_role_permissionId,'FK_userId', q.FK_userId,'FK_RoleId', q.FK_RoleId,'isActive',q.isActive) ), ']') AS JSON ) FROM tbl_user_role_permission q WHERE q.FK_userId = p.user_id ))) AS UserMaster from tbl_user_master p`,
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      const response = await fetch(
        encryptedParams,
        authToken
      );

      if (response) {
        const decryptedData = decrypt(response?.data?.receivedData);
        const DecryptedData = JSON.parse(decryptedData);
        setUserList(DecryptedData?.[0]?.UserMaster);
        setRefreshing(false);
      }
    } catch (error) {
      handleAuthErrors(error);
      setRefreshing(false);
    }
  };

  const handleUserStatus = async (userId, status) => {
    try {
      const authToken = await checkAuthToken();

      const Parameter ={
        operation: "update",
        tblName: "tbl_user_master",
        data: { isActive: !status,firstLoginStatus:0,updatedBy:`${userData?.name} (${userData?.username})` },
        conditionString: `user_id = ${userId}`,
        checkAvailability: '',
        customQuery: '',
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      
      const response = await update(
        encryptedParams,
        authToken
      );

      if (response) {
        addToast(
          `User ${status === 0 ? "Active" : "Inactive"} Successful`,
          "success"
        );
        handleGetUserList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUserAttemptStatus = async (userId, status) => {
    try {
      const authToken = await checkAuthToken();

      const Parameter ={
        operation: "update",
        tblName: "tbl_user_master",
        data: { firstLoginStatus: 0 },
        conditionString: `user_id = ${userId}`,
        checkAvailability: '',
        customQuery: '',
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      
      const response = await update(
        encryptedParams,
        authToken
      );

      if (response) {
        addToast(`Reset Attempts Successful`, "success" );
        handleGetUserList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleEditUser = async (selectedUser) => {
      setUserDetails({
        userId: selectedUser.user_id,
        name: selectedUser.name,
        password: selectedUser.password,
        emailId: selectedUser.email_id,
        contactNumber: selectedUser.contact_number,
        username: selectedUser.username,
        status: selectedUser.isActive,
        rolePermissions: selectedUser.rolePermission,
        
      });
      setUserContainerVisible(true);
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        addToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        addToast("User already exists!", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("User Operation Failed", "error");
    }
  };

  const handleClose = async () => {
    setUserContainerVisible(false);
    setUserDetails({
      userId: '',
      name: '',
      password: '',
      emailId:'',
      contactNumber:'',
      username:'',
      status: 1,
      rolePermissions:[]
    });
  };
  const handlePasswordChange = (text) => {
    isPasswordTooltipVisible && setPasswordTooltipVisible(false);
    setUserDetails({ ...userDetails, password: text });
  };
  const handleEyePress = () => {
    setPasswordVisible((oldValue) => !oldValue);
  };
  const handlePasswordValidation = () => {
    if (passwordValidator(userDetails.password)) {
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
       ( <View style={styles.passwordTooltipContainer}>
          <Text style={styles.passwordTooltipTextStyle}>
            Incorrect
            <Text style={styles.passwordTooltipRedTextStyle}>password</Text>
          </Text>
        </View>);

    return (
        <View style={styles.passwordTextInputContainer}>
          {isPasswordTooltipVisible && (
            <Tooltip>{renderTooltipContent()}</Tooltip>
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={userDetails.password}
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
        </View>
    );
  };

  const renderEmailInput = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That
          <Text style={styles.emailTooltipRedTextStyle}>email address</Text>
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
            value={userDetails.emailId}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            onFocus={() => setEmailTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const handleEmailValidation = () => {
    if (emailValidator(userDetails.emailId)) {
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
    setUserDetails({ ...userDetails, emailId: text });
  };

  const renderNameInput = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That
          <Text style={styles.emailTooltipRedTextStyle}>name</Text>
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
            value={userDetails.name}
            onChangeText={handleNameChange}
            onFocus={() => setNameTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const renderEmployeeId = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That
          <Text style={styles.emailTooltipRedTextStyle}>EmployeeId</Text>
          is required !
        </Text>
      </View>
    );
    return (
      <View style={styles.nameTextInputContainer}>
        <>
          {isEmplyIdTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
            style={styles.input}
            placeholder="Employee Id"
            value={userDetails.username}
            onChangeText={handleEmployeeIdChange}
            onFocus={() => setEmplyIdTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const handleNameValidation = () => {
    if (userDetails.name) {
      setNameTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setNameTooltipVisible(true);
      return false;
    }
  };
  const handleEmployeeIdValidation = () => {
    if (userDetails.username) {
      setEmplyIdTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setEmplyIdTooltipVisible(true);
      return false;
    }
  };
  const handleNameChange = (text) => {
    isNameTooltipVisible && setNameTooltipVisible(false);
    setUserDetails({ ...userDetails, name: text });
  };

  const handleEmployeeIdChange = (text) => {
    isEmailTooltipVisible && setEmplyIdTooltipVisible(false);
    setUserDetails({ ...userDetails, username: text });
  };

  const renderContactNumberInput = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That
          <Text style={styles.emailTooltipRedTextStyle}>contact number</Text>
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
            value={userDetails.contactNumber}
            onChangeText={handleContactNumberChange}
            onFocus={() => setContactNumberTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const handleContactNumberValidation = () => {
    if (userDetails.contactNumber) {
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
    setUserDetails({ ...userDetails, contactNumber: text });
  };
  const handleUpdatePermissions = (role,permission) => {
    setUserDetails((prevData) => {
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
    const roleData = userDetails?.rolePermissions?.find(
      (item) => item?.FK_RoleId === role?.PK_RoleId
    );
    return roleData?.[permission] || false;
  };
  
  const renderRoleCheckboxes = (item) => {
    return (
      <View style={styles.listItem} key={item?.PK_ModuleId}>
        <Text style={[styles.listItemText,]}>
          {item?.roleName}
        </Text>
        <View style={[styles.checkboxContainer, ]}>
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
      const Parameter = {
        operation: "fetch",
        tblName: "tbl_role_master",
        data: "",
        conditionString: "",
        checkAvailability: "",
        customQuery: "",
      }
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      const response = await fetch(
        encryptedParams,
        authToken
      );

      if (response) {
        const decryptedData = decrypt(response?.data?.receivedData);
        const DecryptedData = JSON.parse(decryptedData);
        setRoleList(DecryptedData);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const HorizontalItem = ({ item }) => (
    <View style={styles.horizontalItem}>
      <Text>{item.key}</Text>
    </View>
  );
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetUserList();
  }, []);

  const VerticalItem = ({ item }) => (
    <FlatList
      horizontal
      data={item}
      renderItem={({ item }) => <HorizontalItem item={item} />}
      keyExtractor={(item) => item.key}
      showsHorizontalScrollIndicator={false}
    />
  );

  const renderRoleList = () =>{
    return(
        <View>
        <Text style={[styles.header,{marginTop:10}]}> Role List : </Text>
        <View style={{maxHeight: tableHeight1, minWidth: isMobile ? tableWidth1 :tableWidth1 }}>
        <FlatList
          data={roleList}
          keyExtractor={(item) => item?.PK_RoleId?.toString()}
          ListHeaderComponent={() => (
            <View style={[styles.tableHeader ,]}>
              <Text style={[styles.tableHeaderText, ]}>
                Role Name
              </Text>
              <Text style={[styles.tableHeaderText,]}>
                Access
              </Text>
            </View>
          )}
          renderItem={({ item }) => renderRoleCheckboxes(item)}
          stickyHeaderIndices={[0]} 
        />
        </View>
        </View>
    )
  }
  
  useEffect(() => {
    handleGetUserList();
    handleGetRoleList();
  }, [UserAccess]);
    return (
      <View style={styles.container}>
      {userContainerVisible ? (
        <View style={styles.formContainer}>
          {renderNameInput()}
          {renderEmployeeId()}
          {renderPasswordInput()}
          {renderEmailInput()}
          {renderContactNumberInput()}
          {renderRoleList()}
          <View style={styles.adddetails}>
          {userDetails.userId ? (
            <View style={styles.buttonContainer}>
              <Pressable  style={styles.addbtnWrap} onPress={() => handleUpdateUser()}>
                    <Text  numberOfLines={1} style={styles.addbtntext }  >Update User</Text>
                  </Pressable>
                  <Pressable onPress={() => handleClose()}>
                    <Text  style={styles.cancelbtn}>Cancel</Text>
                  </Pressable>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Pressable style={styles.addbtnWrap} onPress={() => handleAddUser()}>
                    <Text  numberOfLines={1} style={styles.addbtntext } >Add User</Text>
                  </Pressable>
                  <Pressable onPress={() => handleClose()}>
                    <Text style={styles.cancelbtn}>Cancel</Text>
                  </Pressable>
            </View>
          )}
        </View>
        </View>
      ) : 
    (<View style={styles.userListWrap}>
        <Text style={styles.header}>User List:</Text>      
          <View style={{alignItems:"flex-end"}}>
          {UserAccess?.create === 1 &&    
         ( <Pressable onPress={() => setUserContainerVisible(true)}>
                    <Text style={styles.addBtn}> 
                      <Ionicons name="add-circle-outline" size={28} color="black" style={styles.icons} />
                    </Text>
                  </Pressable>) }
          </View>
          <ScrollView horizontal>
          <View style={{maxHeight: tableHeight, minWidth: isMobile ? tableWidth :tableWidth }}>
        <FlatList 
          data={paginatedData}
          keyExtractor={(item) => item.user_id.toString()}
          ListHeaderComponent={() => (
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText,{width:120}, ]}>Employee Id</Text>
              <Text style={[styles.tableHeaderText,{width:200,textAlign:"center"}, ]}>Name</Text>
              <Text style={[styles.tableHeaderText, {width:170,textAlign:"center"} ]}>Mob.No</Text>
              <Text style={[styles.tableHeaderText,{width:200,textAlign:"center"}  ]}>User Status</Text>
              <Text style={[styles.tableHeaderText,{width:90,textAlign:"center"}  ]}>Status</Text>
              <Text style={[styles.tableHeaderText,{width:90,textAlign:"center"}  ]}>Attempt Status</Text>
              <Text style={[styles.tableHeaderText,{width:120 ,textAlign:"center"}, ]}>Created Date</Text>
              <Text style={[styles.tableHeaderText,{width:120 ,textAlign:"center"}, ]}>Updated Date</Text>
              <Text style={[styles.tableHeaderText,{width:120,textAlign:"center"}, ]}>Created By</Text>
              <Text style={[styles.tableHeaderText,{width:120,textAlign:"center"}, ]}>Updated By</Text>
              <Text style={[styles.tableHeaderText,{width:60, textAlign:"center"} ]}>Actions</Text>
            </View>
          )}
          renderItem={({ item }) => (
            refreshing ? <ShimmerEffect/> :
            <View style={styles.listItem}>
              <Text style={[styles.listItemText,{width:120}]}>{item.username}</Text>
              <Text style={[styles.listItemText,{width:200,textAlign:"center"}]}>{item.name}</Text>
              <Text style={[styles.listItemText, {width:170,textAlign:"center"}]}>{item.contact_number}</Text>
              <Text style={[styles.listItemText, {width:200,textAlign:"center"}]}>{item.status} User</Text>
                    <View style={[styles.listItemText, {display:"inline-block", alignItems:"center", textAlign:"center", width:90}]}>
                      <Pressable style={{display:"inline-block" ,alignItems:"center"} } onPress={() =>UserAccess?.update === 1 ? handleUserStatus(item.user_id, item?.isActive) : ''}>
                    <Text style={[styles.listItemText,  item.isActive ? styles.actionbtn : styles.inactivebtn,]}>{item.isActive ? "Active" : "Inactive"}</Text>
                    </Pressable>     
                    </View>  
                    <View style={[styles.listItemText, {display:"inline-block", alignItems:"center", textAlign:"center", width:90}]}>
                      <Pressable style={{display:"inline-block" ,alignItems:"center"} } onPress={() =>UserAccess?.update === 1 ? handleUserAttemptStatus(item.user_id) : ''}>
                    <Text style={[styles.listItemText,  item.firstLoginStatus === 3 ? styles.inactivebtn : styles.actionbtn,]}>{ `${3 - item.firstLoginStatus} Remains`}</Text>
                    </Pressable>     
                    </View>  
                    <Text style={[styles.listItemText, { width: 120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                      {item.createdDate ? new Date(item.createdDate.split('T')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'N/A'}
                    </Text>
                    <Text style={[styles.listItemText, { width: 120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                    {item.updatedDate ? new Date(item.updatedDate.split('T')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'N/A'}
                    </Text>   
                    <Text style={[styles.listItemText, { width: 120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                      {item.createdBy ? item.createdBy: 'N/A'}
                    </Text>
                    <Text style={[styles.listItemText, { width: 120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                    {item.updatedBy ? item.updatedBy: 'N/A'}
                    </Text>
              <View style={{width:60, display:"inline-block", alignItems:"center",textAlign:"center"}}>
              {UserAccess?.update === 1 ? 
              (<Pressable style={[styles.listItemEditButton ,{display:"inline-block"}]} onPress={() => handleEditUser(item)}>
                    <Text style={styles.listItemEditText} ><Feather name="edit" size={16} color="#0C7C62" /></Text>
                  </Pressable>) : (<Text>-</Text>)}
              </View>
            </View>
          )}
          stickyHeaderIndices={[0]} 
          refreshing={refreshing}
          onRefresh={()=>onRefresh()}
         />
         </View>
         </ScrollView>         
         <Pagination
          totalItems={userList?.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
              />
      </View>)
      }
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
    backgroundColor:"#fff",
    padding:20,
    elevation:2,
  },
  userListWrap:{
   backgroundColor:"#fff",
   padding:20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent:"space-between",
    backgroundColor: "rgb(17, 65, 102)",
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    padding: 10,
    marginBottom: 10,
    borderRadius:5,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color:"#fff",
    textAlign:"left",
    alignItems:"center",
    // flexShrink:1,
    fontSize:14,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',   
  },
  listItemText: {
    fontSize:14,
    // textWrap:"noWrap"
  },
  listItemActiveStatus: {
    color: 'green',
  },
  listItemInactiveStatus: {
    color: 'red',
  },
  listItemEditButton: {
    //backgroundColor: "#0C7C62",
    padding: 0,
    borderRadius: 5,
  },
  listItemEditText: {
    color: '#0C7C62',
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
  addWrap:{
   width:100,
   alignSelf:"flex-end",
   marginBottom:10,
  },
  addbtnWrap:{
    width:100,
    alignSelf:"flex-end",
    marginBottom:10,
    backgroundColor:"#0C7C62",
    padding:10,
    borderRadius:5,
  },
  addbtntext:{
    color:"#fff",
    textAlign:"center",
   },
   addBtn: {
    alignItems:"flex-end", 
    position: "relative", 
    bottom: 34,
  },
   cancelbtn:{
    width:100,
    marginBottom:10,
    backgroundColor:"rgb(237, 52, 52)",
    padding:10,
    borderRadius:5,
    textAlign:"center",
    color:"#fff"
  },
  actionbtn:{
    backgroundColor:"#0CB551",
    borderRadius:4,
    width:60,
    padding:5, 
    color:"#fff",
    textAlign:"center",

},
inactivebtn:{
 backgroundColor:"red",
    borderRadius:4,
    width:60,
    padding:5, 
    color:"#fff",
    textAlign:"center",
},
});

export default UserScreen;