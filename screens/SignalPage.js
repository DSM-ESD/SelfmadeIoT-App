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
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from "convert-string";

export default class SignalPage extends Component {
  onLogout = () => {
    this.props.navigation.pop()
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
          <Text style={styles.title}>Plug Module</Text>
          <TouchableOpacity style={styles.buttons} onPress={() => {this.onSignal('sig1')}}>
            <Text style={styles.textStyle}>원격 신호 1 전송</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttons} onPress={() => {this.onSignal('sig2')}}>
            <Text style={styles.textStyle}>원격 신호 2 전송</Text>
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
        marginBottom: 30,
        marginTop: 30,
    },

    icons: {
        width: 200,
        height: 200,
        
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

