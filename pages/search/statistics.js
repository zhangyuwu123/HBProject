import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Echarts from 'native-echarts';

export default class Statistics extends Component {
  render() {
    const option = {
      title: {
        text: ''
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: '40%',
        center: ['20%', '50%'],
        data: [
          { value: 335, name: '危桥1' },
          { value: 310, name: '危桥2' },
          { value: 234, name: '危桥3' },
          { value: 135, name: '危桥4' },
          { value: 1548, name: '危桥5' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    return (
      <Echarts option={option} height={600} />
    );
  }
}
