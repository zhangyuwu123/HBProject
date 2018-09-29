import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { MapView } from 'react-native-amap3d';
import styles from './styles'
import getAsyncStorageBridgeList from '../util/common';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showsCompass: true,
      showsScale: true,
      showsZoomControls: true,
      showsLocationButton: true,
      curLocation: null,
      realm: null,
      status: '',
      token: '',
      makerImg: '',
      makerTitle: '',
      makerRouter: '',
      makerTime: '',
      makerCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      coordinates: [],
      makerItem: '',
      eventEmitter: null,
      curcoordinate: {}
    }
    this.makerImgs = []
  }
  componentWillMount() {
    this._GetAsyncStorageBridgeList()
    navigator.geolocation.getCurrentPosition(
      location => {
        var result = "速度：" + location.coords.speed +
          "\n经度：" + location.coords.longitude +
          "\n纬度：" + location.coords.latitude +
          "\n准确度：" + location.coords.accuracy +
          "\n行进方向：" + location.coords.heading +
          "\n海拔：" + location.coords.altitude +
          "\n海拔准确度：" + location.coords.altitudeAccuracy +
          "\n时间戳：" + location.timestamp;
        console.log("result:" + result)
        this.setState({
          curcoordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude }
        })
        console.log(this.state.curcoordinate.latitude)
      },
      error => {

      }
    )
  }
  componentDidMount() {
    this.eventEmitter = DeviceEventEmitter.addListener('updateMakers', (e) => {
      this.updateMakersBridgeList(e)
    });
    // this.updateMakersTemp()
    this._GetUserInfo()
  }
  componentWillUnmount() {
    this.eventEmitter.remove()
  }
  shouldComponentUpdate(newProps, newState) {
    console.log('6、父组件是否需要更新');
    if (newState.number < 15) return true;
    return false
  }

  componentWillUpdate() {
    console.log('7、父组件将要更新');
  }
  updateMakersTemp(BridgeList) {
    let t = [{ QLMC: '', QLBM: '', CJSJ: '', }]
    debugger
    t.map((item) => {
      this.makerImgs.push(<MapView.Marker
        image="flag"
        onPress={this._onMarkerPressTemp.bind(this, item)}
        coordinate={{ latitude: 30.60, longitude: 114.30 }}
      />)
    })
    this.setState({ makerImgs: this.makerImgs })
  }
  updateMakersBridgeList(BridgeList) {
    console.log('updatebirdgelist:', BridgeList)
    if (!BridgeList) {
      return
    }
    BridgeList.map((item) => {
      this.makerImgs.push(<MapView.Marker
        image="flag"
        onPress={this._onMarkerPress.bind(this, item)}
        coordinate={{ latitude: item.WeiDu ? item.WeiDu : 40.1498, longitude: item.JingDu ? item.JingDu : 116.288 }}
      />)
    })
    this.setState({ makerImgs: this.makerImgs })
  }
  _GetAsyncStorageBridgeList = async () => {
    try {
      const value = await AsyncStorage.getItem('BridgeList');
      if (value) {
        let asyncStorageBridgeList = JSON.parse(value)
        asyncStorageBridgeList.map((item) => {
          this.makerImgs.push(<MapView.Marker
            image="flag"
            onPress={this._onMarkerPress.bind(this, item)}
            coordinate={{ latitude: item.WeiDu ? item.WeiDu : 40.1498, longitude: item.JingDu ? item.JingDu : 116.288 }}
          />)
        })
        this.setState({ makerImgs: this.state.makerImgs })
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  _GetUserInfo = async () => {
    try {
      var value = await AsyncStorage.getItem("token");
      if (value) {
        this.setState({ token: value });
        console.log('maps:' + this.state.token)
      } else {
        this.props.navigation.navigate('Login')
      }
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
    fetch("http://demo.d9tec.com/api/app/GetUserInfo", {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        console.log('status:', response)
        if (response.status == 401) {
          this.props.navigation.navigate('Login')
        }
        console.log('getUserInfo:' + JSON.stringify(response.json()))
      })
      .catch(error => {
        console.error(error);
      });
  }
  formatDate(fmt) {
    var curDate = new Date();
    var o = {
      "M+": curDate.getMonth() + 1, // 月份
      "d+": curDate.getDate(), // 日
      "h+": curDate.getHours(), // 小时
      "m+": curDate.getMinutes(), // 分
      "s+": curDate.getSeconds(), // 秒
      "q+": Math.floor((curDate.getMonth() + 3) / 3), // 季度
      "S": curDate.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (curDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  onRecord = () => {
    this.props.navigation.navigate('Record')
  }
  onEntryManage = () => {
    this.props.navigation.navigate('MySearchManage')
  }
  onSearch = () => {
    this.props.navigation.navigate('SearchManage')
  }
  onMySettings = () => {
    this.props.navigation.navigate('MySettingsManage')
  }
  onBridgeDetail = (item) => {
    this.refs.makerContainer.setNativeProps({ display: 'none' })
    this.props.navigation.navigate('Bridge', { bridgeInfo: item })
  }
  onUploadData = () => {
    console.log('uplaod');
  }
  _onMarkerPressTemp = () => {
    this.refs.makerContainer.setNativeProps({ display: 'flex' })
    this.setState({
      makerImg: 'https://www.google.com.hk/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjD0MeQr9XdAhUBNrwKHdcjCiUQjRx6BAgBEAU&url=http%3A%2F%2Fwww.aboluowang.com%2F2018%2F0725%2F1148667.html&psig=AOvVaw0TrtwZxxEbqdnC7YCTqPvU&ust=1537937852553065',
      makerTitle: '白沙园桥',
      makerRouter: 'G105',
      makerTime: '2018-02-09 ',
      makerItem: {}
    })
  }
  _onMarkerPress = (item) => {
    this.refs.makerContainer.setNativeProps({ display: 'flex' })
    console.log('_onMarkerPress', item)
    this.setState({
      makerImg: item.Files.length > 0 ? 'http://demo.d9tec.com' + item.Files[0].FilePath : '',
      makerTitle: item.QLMC,
      makerRouter: item.LXBM,
      makerTime: item.CJSJ,
      makerItem: item
    })
    if (item.JingDu && item.WeiDu) {
      this.setState({
        makerCoordinates: {
          latitude: item.JingDu,
          longitude: item.WeiDu,
        }
      })
    }
  }

  pressMap = () => {
    this.refs.makerContainer.setNativeProps({ display: 'none' })
  }
  _renderItem = ({ item }) => {
    return <Text style={styles.logText}>{item.time} {item.event}: {item.data}</Text>
  }
  render() {
    console.log('4、render(父组件挂载)');
    return (
      <View style={StyleSheet.absoluteFill}>
        <MapView
          coordinate={{ latitude: 30.60, longitude: 114.30 }}
          zoomLevel={14}
          locationInterval={1000}
          locationEnabled={this.state.showsLocationButton}
          showsCompass={this.state.showsCompass}
          showsScale={this.state.showsScale}
          showsLocationButton={this.state.showsLocationButton}
          showsZoomControls={this.state.showsZoomControls}
          onLocation={this.onLocationEvent}
          onPress={this.pressMap}
          style={styles.map}
        >
          {/* {this.makerImgs} */}
          <MapView.Marker
            image="flag"
            onPress={() => this._onMarkerPressTemp()}
            coordinate={{ latitude: 30.60, longitude: 114.30 }}
          />
        </MapView>

        <TouchableOpacity style={styles.record} onPress={this.onRecord}>
          <View style={styles.btnRecord}>
            <Image style={styles.btnAvatar} source={require('../images/icon-edit.png')} />
            <Text style={styles.text} >采集</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.search} onPress={this.onSearch}>
          <View style={styles.btnSearch}>
            <Image style={styles.btnAvatar} source={require('../images/icon-search2.png')} />
            <Text style={styles.text} >查询</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.myItem} >
          <TouchableOpacity style={styles.tpAvatar} onPress={this.onMySettings}>
            <Image style={styles.avatar} source={require('../images/myicon.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tpText} onPress={this.onEntryManage}>
            <Text style={{ left: 50, position: 'absolute' }}> 搜索项目</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.makerContainer} ref="makerContainer" >
          {
            this.state.makerImg ? <Image style={styles.makerImg} source={{ uri: this.state.makerImg }} /> : <Image style={styles.makerImg} source={require('../images/noimg.png')} />
          }
          <View style={styles.detail}>
            <View>
              <Text>{this.state.makerRouter}</Text>
              <Text>{this.state.makerTitle}</Text>
            </View>
            <View>
              <Button title="详细信息" onPress={this.onBridgeDetail.bind(this, this.state.makerItem)}></Button>
              <Text>{this.state.makerTime}</Text>
            </View>
          </View>
        </View>
      </View >
    )
  }
}
