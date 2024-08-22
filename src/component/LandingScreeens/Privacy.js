import { View, Text, StyleSheet, SafeAreaView, FlatList, ScrollView ,Dimensions} from 'react-native';
import React from 'react';

const Privacy = () => {
    const privacydata = [
        {
            id: 1,
            title: 'Account',
            description: 'means a unique account created for You to access our Service or parts of our Service.'
        },
        {
            id: 2,
            title: 'Affiliate',
            description: 'means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for election of directors or other managing authority.'
        },
        {
            id: 3,
            title: 'Application',
            description: 'refers to e-Nirikshak, the software program provided by the Company.'
        },
        {
            id: 4,
            title: 'Company',
            description: '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Sharda University, plot no 32, 34, Knowledge Park III, Greater Noida, Ruhallapur, Uttar Pradesh 201310.'
        },
        {
            id: 5,
            title: 'Country',
            description: 'refers to: Uttar Pradesh, India.'
        },
        {
            id: 6,
            title: 'Device',
            description: 'means any device that can access the Service such as a computer, a cellphone or a digital tablet.'
        },
        {
            id: 7,
            title: 'Personal Data',
            description: 'is any information that relates to an identified or identifiable individual.'
        },
        {
            id: 8,
            title: 'Service',
            description: 'refers to the Application.'
        },
        {
            id: 9,
            title: 'Service Provider',
            description: 'means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service, or to assist the Company in analyzing how the Service is used.'
        },
        {
            id: 10,
            title: 'Usage Data',
            description: 'refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).'
        },
        {
            id: 11,
            title: 'You',
            description: 'means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.'
        },
    ];
    const { width, height } = Dimensions.get('window');
    const isMobile = width < 768; 
   
    const personaldata=[
        {
            id:1,
            name:'Email address'
        },
        {
            id:2,
            name:'First name and last name'
        },
        {
            id:3,
            name:'Phone number'
        },

        {
            id:4,
            name:'Address, State, Province, ZIP/Postal code, City'
        },
        {
            id:5,
            name:'Usage Data'
        }
        

    ];
    const usagedata=[
     {
         id:1,
         para:'Usage Data is collected automatically when using the Service.'
     },
 
    {
        id: 2,
        para: "Usage Data may include information such as Your Device's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers, and other diagnostic data."
    },
    
    {
     id:3,
     para:'When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.'

    },
    {
        id:4,
        para:'We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.'
    }

    ]
    
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.listheading}>• {item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );
    const persenaldataitems = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.description}>• {item.name}</Text>
            
        </View>
    );
    const usagedataitems = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.description}> {item.para}</Text>
            
        </View>
    );
    const yourpersonaldataitem = ({ item }) => (
        <View style={styles.item}>
        <Text style={styles.listheading}>• {item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            
        </View>
    );
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.formContainer}>
                    <Text style={styles.heading}>Privacy Policy</Text>
                    {/* <Text style={styles.updateDate}>Last updated: August 09, 2024</Text> */}
                    <Text style={styles.text}>
                        This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                    </Text>
                    <Text style={styles.text}>
                        We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. 
                    </Text>

                    <Text style={styles.heading}>Interpretation and Definitions</Text>
                    <Text style={styles.subheading}>Interpretation</Text>
                    <Text style={styles.text}>
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                    </Text>

                    <Text style={styles.heading}>Definitions</Text>
                    <Text style={styles.subheading}>For the purposes of this Privacy Policy:</Text>

                    {/* <FlatList
                        data={privacydata}
                        renderItem={renderItem}
                      
                    /> */}
                    <View>
                    <Text style={styles.subheading}>Account</Text>
                    <Text style={styles.text}>means a unique account created for You to access our Service or parts of our Service</Text>
                    <Text style={styles.subheading}>Affiliate</Text>
                    <Text style={styles.text}>means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for election of directors or other managing authority</Text>
                    <Text style={styles.subheading}>Application</Text>
                    <Text style={styles.text}>refers to Attendee, the software program provided by the Company.</Text>
                    <Text style={styles.subheading}>Company</Text>
                    <Text style={styles.text}>  Plot No. 32-34, Knowledge Park III, Greater Noida, U.P.-201310</Text>
                    <Text style={styles.subheading}>Country</Text>
                    <Text style={styles.text}>refers to: Uttar Pradesh, India</Text>
                    <Text style={styles.subheading}>Device</Text>
                    <Text style={styles.text}>means any device that can access the Service such as a computer, a cellphone or a digital tablet</Text>
                    <Text style={styles.subheading}>Personal Data</Text>
                    <Text style={styles.text}>is any information that relates to an identified or identifiable individual</Text>
                    <Text style={styles.subheading}>Service</Text>
                    <Text style={styles.text}>refers to the Application</Text>
                    <Text style={styles.subheading}>Service Provider</Text>
                    <Text style={styles.text}>means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service, or to assist the Company in analyzing how the Service is used</Text>
                    <Text style={styles.subheading}>Usage Data</Text>
                    <Text style={styles.text}>refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit)</Text>
                    <Text style={styles.subheading}>You</Text>
                    <Text style={styles.text}>means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable</Text>                  
                    </View>
               <View>
                    <Text style={styles.heading}>Collecting and Using Your Personal Data</Text>
                    <Text style={styles.subheading}>Types of Data Collected</Text>
                    <Text style={styles.subheadingchild}>Personal Data</Text>
                    <Text style={styles.text}>
                        While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                    </Text>
                    <FlatList
                        data={personaldata}
                        renderItem={persenaldataitems}
                    />

            </View>
            <View>
                <Text style={styles.heading}>Usage Data</Text>
                <FlatList 
                    data={usagedata}
                    renderItem={usagedataitems}

                />
            </View>
            <View>
                <Text style={styles.heading}>Information Collected while Using the Application</Text>
                <Text style={styles.text}>While using Our Application, in order to provide features of Our Application, We may collect, with Your prior permission:</Text>
                <Text style={styles.text}>Pictures and other information from your Device's camera and photo library</Text>
                <Text style={styles.text}>We use this information to provide features of Our Service, to improve and customize Our Service. The information may be uploaded to the Company's servers and/or a Service Provider's server or it may be simply stored on Your device.</Text>
                <Text style={styles.text}>You can enable or disable access to this information at any time, through Your Device settings.</Text>
            </View>
            <View>
                <Text style={styles.heading}>Use of Your Personal Data</Text>
               
                <Text style={styles.subheading}>To provide and maintain our Service</Text>               
                    <Text style={styles.text}>including to monitor the usage of our Service</Text> 
                         
                <Text style={styles.subheading}>To manage Your Account</Text>               
                    <Text style={styles.text}>to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user</Text> 
               
                    <Text style={styles.subheading}>For the performance of a contract</Text>               
                    <Text style={styles.text}>the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</Text> 

                    <Text style={styles.subheading}>To contact You</Text>               
                    <Text style={styles.text}>  To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</Text> 
                    <Text style={styles.subheading}>To provide You</Text>               
                    <Text style={styles.text}> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</Text>
                    <Text style={styles.subheading}>To manage Your requests</Text>               
                    <Text style={styles.text}>To attend and manage Your requests to Us</Text>
                    <Text style={styles.subheading}>For business transfers</Text>               
                    <Text style={styles.text}>We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred</Text>
                    <Text style={styles.subheading}>For other purposes</Text>               
                    <Text style={styles.text}> We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience</Text>   

                  
                {/* <FlatList
                    data={yourpersonaldata}
                    renderItem={yourpersonaldataitem}
                /> */}
                   {/* <View style={styles.item}>
                    <Text style={styles.listheading}>To provide and maintain our Service</Text>
                    <Text  style={styles.description}>including to monitor the usage of our Service</Text>
                        </View>
                        <View style={styles.item}>
                    <Text style={styles.listheading}>To manage Your Account</Text>
                    <Text  style={styles.description}>to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</Text>
                        </View>
                        <View style={styles.item}>
                    <Text style={styles.listheading}>For the performance of a contract</Text>
                    <Text  style={styles.description}>the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</Text>
                        </View>
                        <View style={styles.item}>
                    <Text style={styles.listheading}>To contact You:</Text>
                    <Text  style={styles.description}>To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</Text>
                        </View> */}
                <View>
                    <Text style={styles.heading} >
                    We may share Your personal information in the following situations:
                    </Text>
                    <View style={[styles.item ,{flexDirection:isMobile?"column":"row"}]}>
                    <Text style={styles.listheading}>With Service Providers</Text>
                    <Text  style={[styles.description ]}>We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.</Text>
                        </View>
                    <View style={[styles.item ,{flexDirection:isMobile?"column":"row"}]}>
                    <Text style={styles.listheading}>For business transfers</Text>
                    <Text  style={styles.description}> We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company</Text>
                        </View>
                        <View style={[styles.item ,{flexDirection:isMobile?"column":"row"}]}>
                    <Text style={styles.listheading}>With Affiliates:</Text>
                    <Text  style={styles.description}>We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</Text>
                        </View>
                        <View style={[styles.item ,{flexDirection:isMobile?"column":"row"}]}>
                    <Text style={styles.listheading}>With business partners:</Text>
                    <Text  style={styles.description}>We may share Your information with Our business partners to offer You certain products, services or promotions</Text>
                    </View>
                    <View style={[styles.item ,{flexDirection:isMobile?"column":"row"}]}>
                    <Text style={styles.listheading}>With Your consent:</Text>
                    <Text  style={styles.description}>We may disclose Your personal information for any other purpose with Your consent.</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.heading}>Retention of Your Personal Data</Text>
                    <Text style={styles.text}>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</Text>
                    <Text style={styles.text}>The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Transfer of Your Personal Data</Text>
                    <Text style={styles.text}>Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.</Text>
                    <Text style={styles.text}>Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.</Text>
                    <Text style={styles.text}> The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Delete Your Personal Data</Text>
                    <Text style={styles.text}>You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</Text>
                    <Text style={styles.text}>Our Service may give You the ability to delete certain information about You from within the Service</Text>
                    <Text style={styles.text}> You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.</Text>
                    <Text style={styles.text}>Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Disclosure of Your Personal Data</Text>
                    
                    <Text style={styles.subheading}>Business Transactions</Text>
                    <Text style={styles.text}>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</Text>
                    <Text style={styles.subheading}>Law enforcement</Text>
                    <Text style={styles.text}>Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</Text>
                    <Text style={styles.subheading}>Other legal requirements</Text>
                    <Text style={styles.text}>The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</Text>
                    <Text style={styles.text}>Comply with a legal obligation</Text>
                    <Text style={styles.text}>Protect and defend the rights or property of the Company</Text>
                    <Text style={styles.text}>Prevent or investigate possible wrongdoing in connection with the Service</Text>
                    <Text style={styles.text}>Protect the personal safety of Users of the Service or the public</Text>
                    <Text style={styles.text}>Protect against legal liability</Text>      
                </View>
                <View>
                    <Text style={styles.heading}>Security of Your Personal Data</Text>
                    <Text style={styles.text}>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</Text>
                    <Text style={styles.heading}>Children's Privacy</Text>
                    <Text style={styles.text}>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.</Text>
                    <Text style={styles.text}>If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Links to Other Websites</Text>
                    <Text style={styles.text}>Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.</Text>        
                    <Text style={styles.text}>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</Text>
                    
                </View>
                <View>
                    <Text style={styles.heading}>Changes to this Privacy Policy</Text>
                    <Text style={styles.text}>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</Text>        
                    <Text style={styles.text}>We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.</Text>
                    <Text style={styles.text}>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page</Text>
                   
                </View>
                <View>
                    <Text style={styles.heading}>Contact Us</Text>
                    <Text style={styles.text}>If you have any questions about this Privacy Policy, You can contact us:</Text>        
                    <Text style={styles.text}>Contact nO:-92055 86066</Text>  
                </View>
            </View>
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
        // shadowColor: '#000',
        // shadowOpacity: 0.1,
        // shadowRadius: 10,
        // shadowOffset: { width: 0, height: 5 },
        // elevation: 5,
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
        textDecorationLine: 'underline',
    },
});
