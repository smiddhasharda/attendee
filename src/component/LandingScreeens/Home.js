import { View, Text, StyleSheet, SafeAreaView, Pressable, Image, ScrollView, Dimensions } from 'react-native';
import React from 'react';

const Home = () => {
  const isMobile = Dimensions.get('window').width < 768;

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.homeWrap}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image style={styles.logo} source={require('../../local-assets/shardalogo.png')} />
              <Pressable style={styles.loginBtn}>
                <Text style={styles.loginText}>Login</Text>
              </Pressable>
            </View>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image style={styles.heroImage} source={require('../../local-assets/banner-img.jpg')} />
            <View style={styles.overlay}>
              <Text style={styles.heroText}>Keep track of attendance easily</Text>
            </View>
          </View>

          {/* Productivity Section */}
          <View style={[styles.productivitySection,]}>
            <View style={styles.productivityItem}>
              <Image style={styles.productivityImage} source={require('../../local-assets/download (1).png')} />
              <Text style={styles.productivityTitle}>Exam Details</Text>
              <Text style={styles.productivityDescription}>
                Stay informed with the latest exam updates. Our app checks for new information multiple times a day, ensuring you receive updates within minutes.
              </Text>
            </View>
            <View style={styles.productivityItem}>
              <Image style={styles.productivityImage} source={require('../../local-assets/download (1).png')} />
              <Text style={styles.productivityTitle}>Room</Text>
              <Text style={styles.productivityDescription}>
                Manage your exam preparations efficiently with our Room feature. View all essential details about your exam locations at a glance.
              </Text>
            </View>
            <View style={styles.productivityItem}>
              <Image style={styles.productivityImage} source={require('../../local-assets/download (1).png')} />
              <Text style={styles.productivityTitle}>Student Info</Text>
              <Text style={styles.productivityDescription}>
                Keep track of all your exam schedules with our unique Calendar View. It lets you see all your exams for the month at a glance.
              </Text>
            </View>
          </View>

          {/* Get App Section */}
          <View style={styles.getAppSection}>
          <View style={{width:"50%" ,}}>
  <Image style={[styles.appimg, ]} source={require('../../local-assets/room-left.png')} />
 
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
                <Text style={styles.footerHeading}>Privacy Policy</Text>
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
                <Text style={styles.footerContact}>📞 +91-0120-4570000</Text>
                <Text style={styles.footerContact}>📱 +91-92055 86066</Text>
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
  header: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  loginBtn: {
    backgroundColor: 'rgb(17, 65, 102)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  productivitySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  productivitySectionMobile: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  productivityItem: {
    width: '30%',
    alignItems: 'center',
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
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    // marginTop: 20,
  },
  appimg: {
    width: '100%',
    height: 500,
    resizeMode: 'contain',
    // transform: [{ rotate: '46deg' }],
  },
  appimgMobile: {
    width: '100%',
    height: 150,
  },
  getAppTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  getAppDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  downloadButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  downloadBtn: {
    width: 140,
    height: 50,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  footerContainer: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  leftSection: {
    flex: 1,
    marginRight: 10,
  },
  middleSection: {
    flex: 1,
    marginHorizontal: 10,
  },
  rightSection: {
    flex: 1,
    marginLeft: 10,
  },
  footerHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  footerLink: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  footerDescription: {
    fontSize: 14,
    color: '#ccc',
  },
  footerAddress: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  footerContact: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#444',
    marginTop: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  appContent:{
      width:"50%",
    //   backgroundColor:"#fff",
    //   borderWidth:1,
    //   borderColor:"#ccc"
  }
});
