import React,{useState} from 'react'
import { View, Text, StyleSheet,TextInput,SafeAreaView,Dimensions,Pressable ,} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
const { width, height } = Dimensions.get('window');
const isMobile = width < 768; 

const ManagePasswordScreen = () => {
  const[showOldPassword,setShowOldPassword]=useState(false)
  const[showNewPassword,setshowNewPassword]=useState(false);
  const[showConfirmPassword,setshowConfirmPassword]=useState(false);

  const [password,setPassword] = useState({
    oldPassword:'',
    newPassword:'',
    confPassword:'',
    isOldPassError:'',
    isNewPassError:'',
    isConfPassError:'' 
  });
 console.log(password);

 const validatePassword=(newPassword) =>{
   const minLength=8;
   const hasUpperCase = /[A-Z]/.test(newPassword);
   const hasLowerCase = /[a-z]/.test(newPassword);
   const hasNumber = /[0-9]/.test(newPassword);
   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

   if(newPassword.length < minLength){
     return 'Password should be min lenght 8'
   }
    if(!hasUpperCase){
      return 'Password must have 1 Uppercase'
    }
    if(!hasLowerCase){
      return'Password Must have one lower case'
    }
    if(!hasNumber){
      return'must have 1 Number '
    }
    if(!hasSpecialChar){
      return 'must have 1 special char'
    }
 } 

  const handlresetPassword = () => {
    if (!password.oldPassword) {
      setPassword({
        ...password,
        isOldPassError: 'Old password is required!',
      });
      return;
    }
    const newPasswordError = validatePassword(password.newPassword);
    if (newPasswordError) {
      setPassword({ ...password, isNewPassError: newPasswordError });
      return;
    }

    // if (!password.newPassword) {
    //   setPassword({
    //     ...password,
    //     isNewPassError: 'New password is required!',
    //   });
    //   return;
    // }
  
    if (!password.confPassword) {
      setPassword({
        ...password,
        isConfPassError: 'Confirm password is required!',
      });
      return;
    }
  
    if(!(password.newPassword.match(password.confPassword))){
      setPassword({
        ...password,
        isConfPassError: 'Passwords do not match!',
      });
      return;
    }
  
   
    alert("Password successfully changed");
  
   
    setPassword({
      oldPassword: '',
      newPassword: '',
      confPassword: '',
      isOldPassError: '',
      isNewPassError: '',
      isConfPassError: ''
    });
  };

  return (
   <SafeAreaView style={styles.passwordWrap}>
      <View style={styles.container}>
      <Text style={styles.headertext}>Reset Password</Text>
      <View style={styles.managePassword}>
               <View>
                <Text style={styles.label}>Old Password</Text>
                    <View>
                    <TextInput
                    placeholder='Enter old Password'
                    value={password.oldPassword}
                    style={styles.input}
                    onChangeText={(text) =>setPassword({...password,oldPassword: text})}
                    onFocus={() =>setPassword({...password,isOldPassError: ''})}
                    secureTextEntry={!showOldPassword}
                    />
                    <Ionicons name={showOldPassword ?'eye':'eye-off'}  style={[styles.eyeicon,{top:10}] } onPress={()=> setShowOldPassword(!showOldPassword)}    />
                    {password.isOldPassError && <Text style={{color:'red'}}>{password.isOldPassError}</Text>}
                    </View>
                    <View style={[styles.inputWrap, isMobile ? styles.inputmobWrap : null]}>
                        <View style={{width: isMobile ? "100%" :"48%"}}>
                          <Text style={styles.label}>New Password</Text>
                        <TextInput
                        placeholder='Enter New  Password'
                        value={password.newPassword}
                        style={styles.input}
                        onChangeText={(text) =>setPassword({...password,newPassword: text})}
                        onFocus={() =>setPassword({...password,isNewPassError: '',isConfPassError:''})}
                        secureTextEntry={!showNewPassword} // it hide the text if false
                        
                        />
                        
                        {password.isNewPassError && <Text style={{color:'red'}}>{password.isNewPassError}</Text>}

                              <Ionicons name={showNewPassword ? 'eye':'eye-off'} style={styles.eyeicon}   onPress={() => setshowNewPassword(!showNewPassword)}/>
                        </View>
                        <View style={{width: isMobile ? "100%" :"48%"}}>    
                      <Text style={styles.label}>Confirm Password</Text>
                          <TextInput
                          placeholder='Enter your confirm Password'
                          value={password.confPassword}
                          style={styles.input}
                          onChangeText={(text) =>setPassword({...password,confPassword: text})}
                          onFocus={() =>setPassword({...password,isNewPassError: '',isConfPassError:''})}
                          secureTextEntry={!showConfirmPassword}
                          />
                          {password.isConfPassError && <Text style={{color:'red'}}>{password.isConfPassError}</Text>}
                          <Ionicons name={showConfirmPassword ? 'eye':'eye-off'} style={styles.eyeicon}  onPress={()=>setshowConfirmPassword(!showConfirmPassword)}/>
                        </View>
                    </View>
                </View>
        <Pressable style={styles.resetbtn} onPress={handlresetPassword}>
          <Text style={{textAlign:"center",color:"#fff"}}>Reset</Text>
        </Pressable>
      </View>
      </View>
   </SafeAreaView>
  )
}

export default ManagePasswordScreen;

const styles = StyleSheet.create({ 
    passwordWrap:{
      flex:1,
      // backgroundColor:"#fff",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center"
    },
    managePassword:{
      // backgroundColor:"#f6f6f6",
      // minWidth:isMobile ? 240: 400,
      // minHeight:isMobile ? 200: 240,
      padding:10,
      borderRadius:10,
    },
    container:{
        width: isMobile ?"90%" :"95%",
        backgroundColor:"#fff",
        padding:20,
        borderRadius:5
    },
    input:{
      borderWidth:1,
      borderColor:"#ccc",
      borderRadius:8,
      padding:10,
      backgroundColor:"#fff",
    },
    label:{
      fontSize:16,
      marginBottom:10,
      fontWeight:600
    },
    headertext:{
      fontSize:18,
      fontWeight:"600",
      marginBottom:10
    },
    resetbtn:{
      backgroundColor:"green",
      padding:8,
      borderRadius:6,
      marginTop:20,
    },
    eyeicon:{
      fontSize:20,
      position:"absolute",
      right:18,
      top:40
    },
    inputWrap:{
      flexDirection:"row",
      justifyContent:"space-between",
    },
    inputmobWrap:{
      flexDirection:"column",

    }

})