/**
 * Created by wangdi on 4/11/16.
 */
import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity, Dimensions, Platform, AsyncStorage, Image, TextInput, backHandler } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import px2dp from '../util/px2dp';
import utf8 from 'utf8'
import binaryToBase64 from 'binaryToBase64'

export default class SignInPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'ProvinceTestUser',
            pwd: '123',
            visible: false,
            timeid: ''
        }
    }

    componentDidMount() {
        // backHandler.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        // backHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }

    _handleBack() {
        this.state.timeid = setTimeout(() => {
            this.setState({ visible: true })
        }, 1000);
        this._Login()
    }
    _Login() {
        fetch("http://demo.d9tec.com/token", {
            method: "POST",
            headers: {
                Authorization: "Basic  " + this._getBase64String(),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials"
        })
            .then(response => response.json())
            .then(responseJson => {
                clearTimeout(this.state.timeid)
                this.setState({ visible: false })
                AsyncStorage.setItem('token', responseJson.access_token);
                this.props.navigation.navigate('Home', { token: responseJson.access_token })
            })
            .catch(error => {
                console.error(error);
            });
    }
    _getBase64String() {
        var text = this.state.username + ':' + this.state.pwd;
        var bytes = utf8.encode(text);
        var encoded = binaryToBase64(bytes);
        return encoded
    }
    _handlePassword(val) {
        this.setState({ pwd: val })
        console.log(val)
    }
    _handleUserName(val) {
        this.setState({ username: val })
        console.log(val)
    }
    _signupCallback() {
        this.props.navigator.push({
            component: SignUpPage
        });
    }

    _forgetPassword() {

    }

    render() {
        return (
            <Image source={require('../images/bg.png')} style={styles.container}>
                <View style={styles.editGroup}>
                    <View style={styles.header}>
                        <Text style={{ color: 'white', fontSize: 20 }}>湖北省养护工程进度管理</Text>
                        <View style={styles.baseline} />
                    </View>

                    <View style={styles.editView1}>
                        <TextInput
                            style={styles.edit}
                            inlineImageLeft='iconuser.png'
                            underlineColorAndroid="transparent"
                            placeholder="用户名"
                            onChangeText={this._handleUserName.bind(this)}
                            value={this.state.username}
                            placeholderTextColor="#c4c4c4" />
                    </View>

                    <View style={styles.editView2}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="密码"
                            value={this.state.pwd}
                            secureTextEntry={true}
                            onChangeText={this._handlePassword.bind(this)}
                            placeholderTextColor="#c4c4c4" />
                    </View>
                    <View style={styles.login}>
                        <TouchableOpacity style={styles.loginBtn} onPress={this._handleBack.bind(this)}>
                            <Text style={{ color: 'white', fontSize: 18 }}>登录</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
                    <Spinner style={styles.spinner} visible={this.state.visible} />
                </View>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: null,
        height: null,
        // //不加这句，就是按照屏幕高度自适应
        // //加上这句，就是按照屏幕自适应
        // resizeMode:Image.resizeMode.contain,
        // //去除内部元素的白色背景
        // backgroundColor:'rgba(0,0,0,0)',


    },
    actionBar: {
        marginTop: (Platform.OS === 'ios') ? px2dp(10) : 0,
    },
    logo: {
        alignItems: 'center',
        marginTop: px2dp(40)
    },
    edit: {
        height: px2dp(40),
        fontSize: px2dp(13),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        color: 'white'
    },
    header: {
        height: px2dp(60),
        alignItems: 'center'
    },
    editView1: {
        height: px2dp(45),
        width: Dimensions.get('window').width - 100,
        backgroundColor: 'rgba(102,115,98,0.6)',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,

    },
    editView2: {
        height: px2dp(45),
        width: Dimensions.get('window').width - 100,
        backgroundColor: 'rgba(102,115,98,0.6)',
        justifyContent: 'center',
        marginTop: 10,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    editGroup: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },
    textButtonLine: {
        marginTop: px2dp(12),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    thirdPartyView: {
        flex: 1,
        marginTop: px2dp(10),
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around'
    },
    login: {
        marginTop: px2dp(10),
        height: px2dp(60),
        width: Dimensions.get('window').width - 100,
    },
    loginBtn: {
        height: 45, marginTop: 10, backgroundColor: '#2B82EC',
        justifyContent: 'center',
        alignItems: 'center',

    },
    baseline: {
        height: 1,
        backgroundColor: 'white',
        marginTop: 10,
        width: Dimensions.get('window').width - 100,
    }
});