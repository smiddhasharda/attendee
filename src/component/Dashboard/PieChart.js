import React from 'react';
import { View, Text } from 'react-native';
import { PieChart as RNChart } from 'react-native-svg-charts';

const PieChart = () => {
  const data = [
    { key: 'A', value: 50, color: '#2979FF' },
    { key: 'B', value: 30, color: '#FF5252' },
    { key: 'C', value: 20, color: '#66BB6A' },
  ];

  return (
    <View>
      <View>
        <Text>Pie Chart</Text>
      </View>
      <RNChart
        style={{ height: 200 }}
        data={data}
        valueAccessor={({ item }) => item.value}
        outerRadius={'95%'}
        innerRadius={10}
        padAngle={0.02}
        // animate // Enable animation
        // animationDuration={500} // Set animation duration
      />
    </View>
  );
};

export default PieChart;
