import { View, Text, StyleSheet, SafeAreaView, FlatList, ScrollView ,Dimensions} from 'react-native';
import React from 'react';

const Privacy = () => {    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.formContainer}>

                    <Text style={styles.heading}>Privacy Policy</Text>

                    <Text style={styles.text}>
            Sharda University operates the website
            <Text style={styles.link} onPress={() => Linking.openURL('https://examination.sharda.ac.in/e-Nirikshak')}>
                https://examination.sharda.ac.in/e-Nirikshak
            </Text>
            and the corresponding mobile application.
        </Text>

                    <Text style={styles.text}>
                        This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of our e-Nirikshak product.
                    </Text>

                    <Text style={styles.subheading}>Information Collection And Use</Text>
                    <Text style={styles.text}>
                        While using our website, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your Name, Email Address, Phone Numbers & Address.
                    </Text>

                    <Text style={styles.subheading}>Log Data</Text>

                    <Text style={styles.text}>
                        Like most website operators, e-Nirikshak collects information that your browser sends whenever you visit our website.
                    </Text>

                    <Text style={styles.text}>
                        This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages and other statistics.
                    </Text>

                    <Text style={styles.text}>
                        In addition, we may use third party services such as Google Analytics that collect, monitor and analyze this information.
                    </Text>
                
                    <Text style={styles.subheading}>Communications</Text>

                    <Text style={styles.text}>
                        We may use your Personal Information to contact you through emails, newsletters and telephonic support. This may be used to share marketing or promotional materials and other product related information such as new feature announcement etc.
                    </Text>

                    <Text style={styles.subheading}>Cookies</Text>

                    <Text style={styles.text}>
                        Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.
                    </Text>

                    <Text style={styles.text}>
                    Like many other websites, we use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website to their full potential.
                    </Text>

                    <Text style={styles.subheading}>Security</Text>

                    <Text style={styles.text}>
                        The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                    </Text>

                    <Text style={styles.subheading}>Changes To This Privacy Policy</Text>

                    <Text style={styles.text}>
                        We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.
                    </Text>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Privacy;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10,
        color: '#333',
    },
    updateDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    subheading: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 5,
        color: '#444',
    },
    subheadingchild: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 5,
        color: '#555',
    },
    text: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 15,
    },
    listheading: {
        fontSize: 16,
        fontWeight: '700',
        color: '#444',
        marginRight: 5, 
    },
    item: {
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        marginBottom: 10, 
    },
    description: {
        flex: 1,  
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    link: {
        color: '#1E90FF',
    },
});
