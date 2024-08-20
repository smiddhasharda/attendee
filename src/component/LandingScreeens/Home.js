import { View, Text, StyleSheet, SafeAreaView, Pressable, Image, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; 
import {Icons,MaterialCommunityIcons,FontAwesome5 ,MaterialIcons ,AntDesign,FontAwesome6,Feather}from '@expo/vector-icons'
// import MyCarousel from '../ImageSlider/MyCarousel';
const Home = () => {<MaterialIcons name="smartphone" size={24} color="black" />
  const isMobile = Dimensions.get('window').width < 768;
  const screenWidth = Dimensions.get('window').width;
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

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image style={styles.heroImage} source={require('../../local-assets/banner-img.jpg')} />
            <View style={styles.overlay}>
              <Text style={styles.heroText}>Easily Track Student Attendance with Just a Tap</Text>
            </View>
            <View>
            <Pressable onPress={handleLoginNavigation}     style={styles.loginBtn}>
              <Text  style={styles.loginText}>Login</Text>
            </Pressable>
            </View>
          </View>

          {/* Carousel Section */}
          {/* <View style={styles.carouselContainer}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled 
              contentContainerStyle={{ width: screenWidth * 4 }} 
            >
              <Image
                style={[styles.carouselImage, { width: screenWidth }]}
                source={require('../../local-assets/loginbg.jpghome-img')}
              />
              <Image
                style={[styles.carouselImage, { width: screenWidth }]}
                source={require('../../local-assets/loginbg.jpg')}
              />
              <Image
                style={[styles.carouselImage, { width: screenWidth }]}
                source={require('../../local-assets/loginbg.jpg')}
              />
              <Image
                style={[styles.carouselImage, { width: screenWidth }]}
                source={require('../../local-assets/loginbg.jpg')}
              />
             
            </ScrollView>
          </View> */}
       {/* <MyCarousel/> */}
          {/* Productivity Section */}
          <View style={[styles.productivitySection]}>
            <View style={styles.productivityItem}>
            <MaterialIcons name="credit-score" size={40} color="black" />
              {/* <Image style={styles.productivityImage} source={require('../../local-assets/download (1).png')} /> */}
              <Text style={styles.productivityTitle}>Exam Tracking</Text>
              <Text style={styles.productivityDescription}>
              Stay on top of all your exams with real-time tracking. Our app ensures you’re always updated on exam schedules and changes.
              </Text>
            </View>
            <View style={styles.productivityItem}>
            <FontAwesome5 name="chalkboard-teacher" size={40} color="black" />
              <Text style={styles.productivityTitle}>Invigilator</Text>
              <Text style={styles.productivityDescription}>
              Seamlessly manage invigilation duties with our dedicated features. Get quick access to your exam locations and related tasks.
              </Text>
            </View>
            <View style={styles.productivityItem}>
            <MaterialCommunityIcons name="barcode-scan" size={40} color="black" />
              <Text style={styles.productivityTitle}>Barcode Scanning</Text>
              <Text style={styles.productivityDescription}>
              Simplify attendance tracking with barcode scanning. Quickly and accurately register student attendance during exams.
              </Text>
            </View>
            
          </View>

          {/* Get App Section */}
          <View style={styles.getAppSection}>
            <View style={{ width: "50%" }}>
              <Image style={[styles.appimg]} source={require('../../local-assets/room-left.png')} />
            </View>
            <View style={styles.appContent}>
              <Text style={styles.getAppTitle}>Get the App</Text>
              <Text style={styles.getAppDescription}>
                Download the Attendance app and never miss another case update, even when you’re on the go.
              </Text>
              <View style={styles.downloadButtons}>
                <Image style={styles.downloadBtn} source={require('../../local-assets/google-play.png')} />
                {/* Add more buttons for iOS or others as needed */}
              </View>
            </View>
          </View>

          {/* Footer */}
         <View style={styles.footerContainer}>
      <View style={styles.footerContent}>
        <View style={styles.leftSection}>
          <Text style={styles.footerHeading} onPress={handlePrivacy}>
            Privacy Policy
          </Text>
          <Text style={styles.footerLink}>Terms and Conditions</Text>
          <Text style={styles.footerDescription}>
            Affiliation: University Grants Commission has empowered Sharda University to award degrees under Section 22 of UGC Act 1956.
          </Text>
        </View>

        <View style={styles.middleSection}>
          <Text style={styles.footerHeading}>Sharda University Campus</Text>
          <Text style={styles.footerAddress}>
            Plot No. 32-34, Knowledge Park III, Greater Noida, U.P.-201310
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.footerHeading}>Contact Us</Text>
          <Text style={styles.footerContact}>
            <FontAwesome6 name="phone" size={18} color="#fff" /> +91-0120-4570000
          </Text>
          <Text style={styles.footerContact}>
            <Feather name="smartphone" size={20} color="#fff" /> +91-92055 86066
          </Text>
        </View>
      </View>

      <View style={styles.footerBottom}>
        <Text style={styles.copyrightText}>
          Copyright © Sharda University 2024. All Rights Reserved
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
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flexGrow: 1,
  },
  homeWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroSection: {
    position: 'relative',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    // textAlign: 'center',
    paddingHorizontal: 20,
  },
  productivitySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#dadada',
  },
  productivityItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor:"#fff",
    padding:10,
    borderRadius:10,
  },
  productivityImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productivityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  productivityDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  getAppSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
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
    // justifyContent: 'center',
 
  },
  downloadBtn: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
 
  footerContainer: {
    backgroundColor: '#333',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leftSection: {
    flex: 1,
    paddingHorizontal: 10,
  },
  middleSection: {
    flex: 1,
    paddingHorizontal: 10,
  },
  rightSection: {
    flex: 1,
    paddingHorizontal: 10,
  },
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
    marginTop: 8,
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
    paddingTop: 10,
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
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
