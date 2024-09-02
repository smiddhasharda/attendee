import { View, Text, StyleSheet, SafeAreaView, Pressable, Image, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; 
import {Icons,MaterialCommunityIcons,FontAwesome5 ,MaterialIcons ,AntDesign,FontAwesome6,Feather}from '@expo/vector-icons'
import { style } from '@mui/system';
// import MyCarousel from '../ImageSlider/MyCarousel';
const { width, height } = Dimensions.get('window');
const isMobile = width < 768; 
const Home = () => {

  const navigation = useNavigation(); 
  const handleLoginNavigation = () => {
    navigation.replace('Login');
  };
  const handlePrivacy = () => {
    navigation.navigate('Privacy');
  };
 
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.homeWrap}>

          {/* Slider Section */}
          {/* <View style={styles.heroSection}>
            <Image style={[styles.heroImage,{height:isMobile?320:460}]} source={require('../../local-assets/banner-img.jpg')} />
            <View style={[styles.overlay,]}>
              <Text style={[styles.heroText ,{ fontSize: isMobile ? 40 : 60 ,width:isMobile?"100%" :"50%" }]}>Easily Track Student Attendance </Text>
            </View>
            <View>
              <Pressable onPress={handleLoginNavigation} style={styles.loginBtn}>
                <Text  style={styles.loginText}>Login</Text>
              </Pressable>
            </View>
          </View> */}

          {/* Main Section */}
          <View style={[styles.mainSection]}>

            {/* Features Section */}
            <View style={[styles.featuresWrap, { flexDirection : isMobile ? "column" : "row" }]}>
              <View style={{ order: isMobile ? 2 : 1, width: isMobile?"100%":"60%" }}>
                <Text style={styles.secHeading}>Easily Track Student Attendance</Text>
                <View style={styles.listItem}>
                  <View style={styles.leftSection}>
                    <Image style={styles.secImage} source={require('../../local-assets/track-icon.png')} />
                  </View>
                  <View style={styles.rightSection}>
                    <Text style={styles.heading}>Exam Tracking</Text>
                    <Text style={styles.paragraph}>
                      Stay on top of all your exams with real-time tracking. Our app ensures you’re always updated on exam schedules and changes.
                    </Text>
                  </View>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.leftSection}>
                    <Image style={styles.secImage} source={require('../../local-assets/eye-icon.png')} />
                  </View>
                  <View style={styles.rightSection}>
                    <Text style={styles.heading}>Invigilator</Text>
                    <Text style={styles.paragraph}>
                      Seamlessly manage invigilation duties with our dedicated features. Get quick access to your exam locations and related tasks.
                    </Text>
                  </View>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.leftSection}>
                    <Image style={styles.secImage} source={require('../../local-assets/scan-icon.png')} />
                  </View>
                  <View style={styles.rightSection}>
                    <Text style={styles.heading}>Barcode Scanning</Text>
                    <Text style={styles.paragraph}>
                      Simplify attendance tracking with barcode scanning. Quickly and accurately register student attendance during exams.
                    </Text>
                  </View>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.playLeftSection}>
                    <Image style={styles.playIcon} source={require('../../local-assets/google-play.png')} />
                  </View>
                  <View style={styles.playRightSection}>
                    <Text style={styles.download}>Download The App</Text>
                  </View>
                </View>
              </View>

              <View style={{  order: isMobile ? 1 : 2,width: isMobile?"100%":"40%" }}>
              <Image style={[styles.featureImg]} source={require('../../local-assets/room-left.png')} />
              </View>
            </View>

          </View>

          {/* Features Section */}
          {/* <View style={[styles.productivitySection,{flexDirection:isMobile? "column" :"row"}]}>
            <View style={[styles.productivityItem,{width:isMobile?"100%" :'30%' ,marginBottom:isMobile?15:0 ,marginTop:isMobile?15:0}]}>
            <MaterialIcons name="credit-score" size={40} color="rgb(0 93 84)" />
              <Text style={styles.productivityTitle}>Exam Tracking</Text>
              <Text style={styles.productivityDescription}>
              Stay on top of all your exams with real-time tracking. Our app ensures you’re always updated on exam schedules and changes.
              </Text>
            </View>
            <View style={[styles.productivityItem,{width:isMobile?"100%" :'30%',marginBottom:isMobile?15:0}]}>
            <FontAwesome5 name="chalkboard-teacher" size={38} color="rgb(0 93 84)" />
              <Text style={styles.productivityTitle}>Invigilator</Text>
              <Text style={styles.productivityDescription}>
              Seamlessly manage invigilation duties with our dedicated features. Get quick access to your exam locations and related tasks.
              </Text>
            </View>
            
            <View  style={[styles.productivityItem,{width:isMobile?"100%" :'30%',marginBottom:isMobile?15:0}]}>
            <MaterialCommunityIcons name="barcode-scan" size={40} color="rgb(0 93 84)" />
              <Text style={styles.productivityTitle}>Barcode Scanning</Text>
              <Text style={styles.productivityDescription}>
              Simplify attendance tracking with barcode scanning. Quickly and accurately register student attendance during exams.
              </Text>
            </View>           
          </View> */}

          {/* Get App Section */}
          {/* <View style={[styles.getAppSection,{flexDirection:isMobile?"column":"row"}]}>
            <View style={{ width: isMobile?"100%":"50%" }}>
              <Image style={[styles.appimg]} source={require('../../local-assets/room-left.png')} />
            </View>
            <View style={[styles.appContent,{width:isMobile?"100%":"50%", padding:isMobile?24 :40}]}>
              <Text style={[styles.getAppTitle ,]}>Get the App</Text>
              <Text style={styles.getAppDescription}>
                Download the Attendance app and never miss another case update, even when you’re on the go.
              </Text>
              <View style={[styles.downloadButtons,]}>
                <Image style={styles.downloadBtn} source={require('../../local-assets/google-play.png')} />
              </View>
            </View>
          </View> */}

          {/* Footer Section  */}
        {/* Footer Section */}
        <View style={styles.footer}>
          <View style={[styles.footerSection ,{flexDirection:isMobile?"column":"row"}] }>
          <Text style={[styles.affiliation, { width: isMobile ? "100%" : '32%', marginBottom: isMobile ? 20 : '' }]}>
                <Text style={{ fontWeight: "600" }}>Affiliation:</Text> University Grants Commission has empowered Sharda University to award degrees under Section 22 of UGC Act 1956.
              </Text>
            <View style={[styles.address,{width:isMobile?"100%":'32%',marginBottom:isMobile?20:''}]}>
              <View style={styles.addressIconWrap}>
                <Image style={styles.iconImg} source={require('../../local-assets/map.png')} />
                <View style={styles.textWrapper}>
                  <Text style={styles.footerText}>Sharda University</Text>
                  <Text style={styles.footerText}>Plot No. 32-34, Knowledge Park III, Greater Noida, UP - 201310</Text>  
                </View>
              </View>
            </View>
            <View style={[styles.contactDetails,{width:isMobile?"100%":"",}]}>
              <View style={styles.addressIconWrap}>
                <Image style={styles.iconImgphone} source={require('../../local-assets/call.png')} />
                <View style={styles.textWrapper}>
                  <Text style={styles.footerText}>+91-120-4570000</Text>
                  <Text style={styles.footerText}>+91-92055 88466</Text>
                </View>
              </View>  
            </View>
          </View>
          <View style={styles.copyright}>
            <Text style={styles.link}>
              Copyright © Sharda University 2024. All Rights Reserved
            </Text>
            <Text style={styles.privacy} onPress={handlePrivacy}>
                Privacy Policy
            </Text>
          </View>
        </View>
     </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f7ff',
  },
  scrollView: {
    flexGrow: 1,
  },
  homeWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainSection: {
    flex: 1,
    maxWidth: isMobile ? "100%" : 1140,
    paddingRight: isMobile ? 8 : 15,
    paddingLeft: isMobile ? 8 : 15,
    marginRight: 'auto',
    marginLeft: 'auto',
    // fontFamily: ['Lato', 'sans-serif'],
    width: '100%'  // Ensure it takes full width within the maxWidth
  },
  secHeading: {
    fontSize: isMobile?20:34,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingBottom: 20,
    // fontFamily: ['Lato', 'sans-serif'],
    // color:"#00ade3"
  },
  listItem: {
    flexDirection: 'row',
    //alignItems: 'center',
    marginBottom: 20, // Space between list items
    maxWidth: '100%',
    width: '100%',
    // fontFamily: ['Lato', 'sans-serif']
  },
  leftSection: {
    flex: 13, // 13% of the width
    marginRight: 10, // Space between the image and the text
  },
  rightSection: {
    flex: 87, // 87% of the width
  },
  secImage: {
    width: '100%', // Make sure the image takes the full width of the left section
    height: 50, // Adjust the height as needed
    resizeMode: 'contain',
  },
  playLeftSection: {
    // flex: 28, // 28% of the width
    marginRight: 10, // Space between the image and the text
  },
  playRightSection: {
    // flex: 72, // 72% of the width
    justifyContent:"center"
  },
  download: {
    fontSize: 14,
    fontWeight: "700",
    width:70,
    textAlign:"center"
  },
  playIcon: {
    width: isMobile?120:160,
    height: isMobile?40 :54
  },
  heading: {
    fontSize: isMobile?16:18,
    fontWeight: 'bold',
    marginBottom: 5,
    // fontFamily: ['Lato', 'sans-serif']
  },
  paragraph: {
    fontSize: isMobile ?12:14,
    color: '#000',
    // fontFamily: ['Lato', 'sans-serif']
  },
  heroSection: {
    position: 'relative',
    backgroundColor: '#f2f7ff'
  },
  heroImage: {
    width: '100%',
    height: 460,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    // alignItems: 'center',
    justifyContent: 'center',

  },
  heroText: {
    // fontSize: isMobile ? 40 :40,
    fontWeight: 'bold',
    color: '#fff',
    // textAlign: 'center',
    paddingHorizontal: 20,
    width:"50%",
  },
  productivitySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#dadada',
  },
  // productivityItem: {
  //   width: "30%",
  //   alignItems: 'center',
  //   backgroundColor:"#fff",
  //   padding:10,
  //   borderRadius:10,
  //   // marginBottom:20,
  //   shadowColor: '#00ade3',
  //   shadowOpacity: 0.3,
  //   shadowRadius: 8,
  //   // shadowOffset: { width: 0, height: 5 },
  //   // elevation: 5,
  // },
  // productivityImage: {
  //   width: 80,
  //   height: 80,
  //   resizeMode: 'contain',
  //   marginBottom: 10,
  // },
  // productivityTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginVertical: 10,
  //   textAlign: 'center',
  //   // color:"#00ade3"
  // },
  // productivityDescription: {
  //   fontSize: 14,
  //   color: '#666',
  //   textAlign: 'center',
  // },
  featuresWrap:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: '100%',  // Ensure the flex container takes the full width
  },
  featureImg: {
    width: '100%',
    height: 500,
    resizeMode: 'contain',
  },
  // secImage: {
  //   width: 75,
  //   height: 75
  // },
  getAppSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
  },
  appimg: {
    width: '100%',
    height: 500,
    resizeMode: 'contain',
  },
  appContent: {
    width: "50%",
    backgroundColor:"#fff",
    padding:40,
    borderRadius:5,
     shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
  },
  getAppTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    // textAlign: 'center',
    marginBottom: 10,
  },
  getAppDescription: {
    fontSize: 16,
    color: '#666',
    // textAlign: 'center',
    marginBottom: 20,
  },
  downloadButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
  },
  downloadBtn: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
 
  footerContainer: {
    backgroundColor: '#333',
    paddingVertical: 50,
    paddingHorizontal: 50,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  // leftSection: {
  //   width:"30%",
  //   paddingHorizontal: 10,
  // },
  // middleSection: {
  //   width:"30%",
  //   paddingHorizontal: 10,
  // },
  // rightSection: {
  //   width:"30%",
  //   paddingHorizontal: 10,
  // },
  footerHeading: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footerLink: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 8,
  },
  footerDescription: {
    fontSize: 14,
    color: '#ccc',
    // marginTop: 8,
    lineHeight: 22,
    
  },
  footerAddress: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
    lineHeight: 22,
  },
  footerContact: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 20,
    // paddingHorizontal:40,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 14,
    color: '#bbb',
  },
  carouselContainer: {
    height: 230, // Adjust as per your image height
    backgroundColor: '#f5f5f5',
  },
  carouselImage: {
    height: 230, // Adjust as per your image height
    resizeMode: 'cover',
  },
  loginBtn: {
    backgroundColor: 'rgb(17, 65, 102)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    width:100,
    marginBottom:10,
    position:"relative",
    left:20,
    bottom:30,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',

  },
  footer: {
    backgroundColor: '#f0f4f8',
    paddingVertical: isMobile ? 8 :20,
    paddingHorizontal: isMobile ? 8 :15,
    borderTopWidth: 1,
    borderColor: '#d1d1d1',
    alignItems: 'center',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  affiliation: {
    fontSize: 12,
    color: '#333',
    width: '32%',
    textAlign: 'left',
  },
  address: {
    
    width: '32%',
    justifyContent: 'center',
  },
  contactDetails: {
    // width:"32%",
    justifyContent: 'center',
  },
  addressIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
 
  },
  iconImg: {
    width: 19,
    height: 26,
    marginRight: 10,
  },
  iconImgphone:{
   width:16,
   height:26,
   marginRight:10
  },
  textWrapper: {
    // flex: 1,
 
  },
  // textBold: {
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  // },
  copyright: {
    flexDirection: isMobile?"column":'row',
    justifyContent: 'center',
    marginTop: isMobile?0:20,
  },
  privacy:{
    borderLeftWidth:isMobile?0:1,
    borderLeftColor:"#ccc",
    marginLeft:10,
    paddingLeft:10,
    fontSize:12,
    textAlign:isMobile?"center":'',
    textDecorationLine:"underline",
    color:"#1A73E8"
  },
  footerText:{
    fontSize:12,
  },
  link: {
    // color: '#1A73E8',
    fontSize: 12,
    // marginHorizontal: 10,
    // textDecorationLine: 'underline',
  },
 
});
