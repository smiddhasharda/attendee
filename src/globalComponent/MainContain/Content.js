import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function Content({ title, items }) {
  return (
    
    <View style={styles.maincontain}>
      <Text style={styles.attendacehead}>{title}</Text>
        <View style={styles.boxmain}>
        {items.map((item, index) => (
     
      <View key={index} style={styles.boxesWrap}>
            <Text style={styles.boxcount}>{item.count}</Text>
            <Text>{item.label}</Text>
          </View>
        ))}
        </View>
      </View>
 
  )
}

export default Content


const styles = StyleSheet.create({
  container:{
     flex:1,
     alignItems:"center"
  },
 
maincontain:{
   width:"100%",
},

maincontain:{
  backgroundColor:"#fff",
  width:"90%",
  padding:20,
  borderRadius:"20px"
},
attendacehead:{
  fontSize:"16px",
  fontWeight:"600",
  marginBottom:"10px",
},
boxmain:{
flexDirection:"row",
justifyContent:"space-between",
flexWrap:"wrap",
},
boxesWrap:{
  borderWidth:1,
  borderColor:"#ccc",
  padding:"10px",
  backgroundColor:"rgb(219 233 245);",
  marginBottom:"10px",
  borderRadius:"10px",
  marginRight:"10px",
  alignItems:"center",
  width:"42%",
  // marginRight:"10px"

},
boxcount:{
  fontWeight:"bold",
},
facultyWrap:{
  flexDirection:"row",
  marginRight:"20px",
  padding:"10px"
}
});