import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { MapView } from 'react-native-amap3d';
import styles from './styles'
let flag = require('../images/flag.png')

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
      curcoordinate: { latitude: 0, longitude: 0 },
      bridgeList: [],
      url: '',
      makerImgs: [],

    }
    this.makerImgs = []
  }
  componentWillMount() {
    // this._GetAsyncStorageBridgeList()
    this.state.url = "http://demo.d9tec.com/api/app/getxfqlxxs"
    this._GetUserInfo()
  }
  componentDidMount() {
    // this.eventEmitter = DeviceEventEmitter.addListener('updateMakers', (e) => {
    //   this.updateMakersBridgeList(e)
    // });
    // this.updateMakersTemp()
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({
          curcoordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude }
        })
      },
      error => { }
    )
  }
  componentWillReceiveProps(obj) {
    this.state.token = obj.navigation.state.params.token
    this._GetBridgeList()
  }
  componentWillUnmount() {

  }
  updateMakersBridgeList() {
    if (!this.state.bridgeList && this.state.bridgeList.length <= 0) {
      return
    }
    this.state.bridgeList.forEach((item) => {
      if (item.Gcjd && item.Gcjd.length > 0) {
        let temp = item.Gcjd[0]
        if (temp.JingDu && temp.WeiDu) {
          // this.makerImgs.push(<MapView.Marker
          //   key={temp.Id}
          //   title={item.QLMC}
          //   ref={ref => {
          //     this.marker = ref
          //   }}
          //   icon={() => (
          //     <Image style={styles.customMarker} source={require('../images/flag.png')}
          //       onLoad={() => {
          //         this.marker.sendCommand('update')
          //       }}
          //     />
          //   )}
          //   onPress={() => this._onMarkerPressTemp()}
          //   coordinate={{ latitude: 40.1498, longitude: 116.288 }}
          // />)



          this.makerImgs.push(<MapView.Marker
            key={temp.Id}
            title={item.QLMC}
            ref={ref => {
              this.marker = ref
            }}
            image="flag"
            onPress={() => this._onMarkerPressTemp()}
            coordinate={{ latitude: Number(temp.WeiDu), longitude: Number(temp.JingDu) }}
          />)
        }
      }
    })
    this.setState({ makerImgs: this.makerImgs })
    // setTimeout(() => {
    //   this.marker.sendCommand('update')
    // }, 3000);
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
        if (response.status == 401) {
          this.props.navigation.navigate('Login')
        } else {
          this._GetBridgeList()
          console.log('getUserInfo:' + JSON.stringify(response.json()))
        }
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
  _GetBridgeList() {
    fetch(this.state.url, {
      method: "POST",
      headers: {
        Authorization: "Bearer  " + this.state.token,
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('_UpdateBridgeList:' + JSON.stringify(responseJson.Result))
        if (!responseJson) {
          this.props.navigation.navigate('Login')
        } else {
          this.state.bridgeList = responseJson.Result
          this.updateMakersBridgeList()
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  pressMap = () => {
    this.refs.makerContainer.setNativeProps({ display: 'none' })
  }
  _renderItem = ({ item }) => {
    return <Text style={styles.logText}>{item.time} {item.event}: {item.data}</Text>
  }
  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <MapView
          coordinate={this.state.curcoordinate}
          zoomLevel={12}
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
          {this.state.makerImgs}
          {/* <MapView.Marker
            title="白沙园桥"
            ref={ref => {
              this.marker = ref
            }}
            icon={() => (
              <Image style={styles.customMarker} source={require('../images/flag.png')}
                onLoad={() => {
                  this.marker.sendCommand('update')
                }}
              />
            )}
            onPress={() => this._onMarkerPressTemp()}
            coordinate={{ latitude: 30.60, longitude: 114.30 }}
          /> */}
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
            <Text style={{ left: 50, position: 'absolute', fontSize: 17, color: 'black' }}> 搜索项目</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.makerContainer} ref="makerContainer" >
          <Image style={styles.makerImg} source={require('../images/20180703145902_747.jpg')} />
          <View style={styles.detail}>
            <View>
              <Text>G106</Text>
              <Text>白沙园桥</Text>
              <Text>2018-02-09</Text>
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
