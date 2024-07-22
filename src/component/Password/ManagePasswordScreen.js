import React,{useState} from 'react'
import { View, Text, StyleSheet,TextInput,SafeAreaView,Dimensions,Pressable ,} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
const { width, height } = Dimensions.get('window');
const isMobile = width < 768; 

const ManagePasswordScreen = () => {
  const [password,setPassword] = useState({
    oldPassword:'',
    newPassword:'',
    confPassword:'',
    isOldPassError:'',
    isNewPassError:'',
    isConfPassError:'' 
  });

  const handlresetPassword=()=>{
   if(!password.oldPassword){
    setPassword({...password,isOldPassError: 'old password is requiured !'})
     return;
   }
   if( !password.newPassword){
    setPassword({...password,isNewPassError: 'new password is requiured !'})
     return;
   }
   if(!password.confPassword){
    setPassword({...password,isConfPassError: 'Confirm password is requiured !'})
   }
  else if(!(password.newPassword.match(password.confPassword))){
      setPassword({...password,isNewPassError: 'Password Not Matched !',isConfPassError: 'Password Not Matched !'})
       return;
  }
   alert("Password reset sucessfully");
  }

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
                    />
                    <Ionicons name='eye' style={[styles.eyeicon,{top:10}]
                    }/>
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
                        />
                        {password.isNewPassError && <Text style={{color:'red'}}>{password.isNewPassError}</Text>}
                              <Ionicons name='eye' style={styles.eyeicon}/>
                        </View>
                        <View style={{width: isMobile ? "100%" :"48%"}}>    
                      <Text style={styles.label}>Confirm Password</Text>
                          <TextInput
                          placeholder='Enter your confirm Password'
                          value={password.confPassword}
                          style={styles.input}
                          onChangeText={(text) =>setPassword({...password,confPassword: text})}
                          onFocus={() =>setPassword({...password,isNewPassError: '',isConfPassError:''})}
                          />
                          {password.isConfPassError && <Text style={{color:'red'}}>{password.isConfPassError}</Text>}
                          <Ionicons name='eye' style={styles.eyeicon}/>
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