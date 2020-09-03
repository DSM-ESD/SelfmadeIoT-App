import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity, 
  AsyncStorage,
  BackHandler,
  ScrollView
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from "convert-string";

export default class CodePage extends Component {
    state = {
        code: ''
    }

  onLogout = () => {
    this.props.navigation.pop()
  }

  componentDidMount() {
      this.state.codes = []
    fetch(`http://192.168.0.15:5000/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: 'dd',
        })
    }).then(result => {return result.text()}).then(data => {
            data = data.split("'").join('"')
            var codes = JSON.parse(data)
            this.setState({code: codes[codes.length - 1]})
        })
  }

  onSignal = (msg) => {
    setTimeout(() => {
        BleManager.retrieveServices('00:13:AA:00:16:2B').then((peripheralInfo) => {
          console.log(peripheralInfo);
          var service = 'ffe0';
          var bakeCharacteristic = 'ffe1';
          var crustCharacteristic = 'ffe1';
          
          var data = stringToBytes(msg)
          setTimeout(() => {
            BleManager.startNotification('00:13:AA:00:16:2B', service, bakeCharacteristic).then(() => {
              console.log('Started notification on ' + '00:13:AA:00:16:2B');
              setTimeout(() => {
                BleManager.write('00:13:AA:00:16:2B', service, crustCharacteristic, data).then(() => {
                  console.log('Writed NORMAL crust');
                });
              }, 500);
            }).catch((error) => {
              console.log('Notification error', error);
            });
          }, 200);
        });
      }, 900);
  }


  render() {
    return (
      <View style={styles.container}>
          <Image style={styles.icons} source={require('../res/module.png')}></Image>        
          <Text style={styles.title}>{this.state.code}</Text>
          <TouchableOpacity style={styles.buttons} onPress={this.onSignal(this.state.code)}>
              <Text style={styles.textStyle}>코드 업로드</Text>
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
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 30,
        marginTop: 30,
    },

    icons: {
        width: 200,
        height: 200,
        
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
        borderRadius: 10,
      },
    row: {
        margin: 10,
        borderRadius: 10,
    },
    
    buttons: {
        width: "90%",
        height: "5%",
        margin: 5,
        borderRadius: 10,
        backgroundColor: "#0075DA",
        justifyContent: "center",
        alignItems: "center",
    },

    textStyle: {
        color: '#FFF',
        fontSize: 20,
        margin: 5
    }
});

