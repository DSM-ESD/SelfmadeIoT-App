import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity, 
  AsyncStorage,
  BackHandler
} from 'react-native';

export default class MainPage extends Component {
  onLogout = () => {
    this.props.navigation.pop()
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.title}>Selfmade-IoT</Text>
          <TouchableOpacity style={styles.buttons} onPress={() => {this.props.navigation.navigate('Connect')}}>
            <Image style={styles.icons} source={require('../res/link.png')}></Image>        
            <Text style={styles.textStyle}>모듈 연결</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttons} onPress={() => {this.props.navigation.navigate('Signal')}}>
            <Image style={styles.icons} source={require('../res/remote.png')}></Image>        
            <Text style={styles.textStyle}>모듈 컨트롤</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttons} onPress={() => {this.props.navigation.navigate('Code')}}>
            <Image style={styles.icons} source={require('../res/code.png')}></Image>        
            <Text style={styles.textStyle}>코드 업로드</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttons} onPress={() => {this.props.navigation.pop()}}>
            <Image style={styles.icons} source={require('../res/logout.png')}></Image>        
            <Text style={styles.textStyle}>로그아웃</Text>
          </TouchableOpacity>
          
      </View>
    );
  }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },

    title: {
        color: '#000000',
        fontSize: 25,
        fontWeight: "bold",
        marginRight: 150,
        marginBottom: 10,
    },

    icons: {
        width: 35,
        height: 35,
        
    },
    buttons: {
        width: "90%",
        height: "15%",
        margin: 5,
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        shadowOffset: {
	        width: 0,
	        height: 2,
        },
        shadowOpacity: 0.46,
        shadowRadius: 11.14,
        elevation: 5,
        marginBottom: 15,
    },

    textStyle: {
        color: '#505050',
        fontSize: 20,
        margin: 5
    }
});

