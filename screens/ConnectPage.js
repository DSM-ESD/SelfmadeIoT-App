import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { stringToBytes } from "convert-string";

const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


export default class ConnectPage extends Component {
  constructor(){
    super()

    this.state = {
      scanning:false,
      peripherals: new Map(),
      appState: ''
    }

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    BleManager.start({showAlert: false});

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );



    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
      });
    }

  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({peripherals});
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  startScan() {
    if (!this.state.scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.scan([], 3, true).then((results) => {
        console.log('Scanning...');
        this.setState({scanning:true});
      });
    }
  }

  retrieveConnected(){
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      console.log(results);
      var peripherals = this.state.peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
      }
    });
  }

  handleDiscoverPeripheral(peripheral){
    var peripherals = this.state.peripherals;
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    this.setState({ peripherals });
  }

  test(peripheral) {
    if (peripheral){
      if (peripheral.connected){
        BleManager.disconnect(peripheral.id);
      }else{
        BleManager.connect(peripheral.id).then(() => {
          let peripherals = this.state.peripherals;
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            this.setState({peripherals});
          }
          console.log('Connected to ' + peripheral.id);

          /*
          setTimeout(() => {


            console.log(peripheral.id)
            BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
              console.log(peripheralInfo);
              var service = 'ffe0';
              var bakeCharacteristic = 'ffe1';
              var crustCharacteristic = 'ffe1';
              
              var data = stringToBytes('thisistest')
              setTimeout(() => {
                BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                  console.log('Started notification on ' + peripheral.id);
                  setTimeout(() => {
                    BleManager.write(peripheral.id, service, crustCharacteristic, data).then(() => {
                      console.log('Writed NORMAL crust');
                      BleManager.write(peripheral.id, service, bakeCharacteristic, data).then(() => {
                        console.log('Writed 351 temperature, the pizza should be BAKED');

                      });
                    });

                  }, 500);
                }).catch((error) => {
                  console.log('Notification error', error);
                });
              }, 200);
            });

          }, 900);*/
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
    }
  }

  renderItem(item) {
    const color = item.connected ? '#126CE6' : '#fff';
    const textColor = item.connected ? '#FFFFFF' : '#000000';
    return (
      <TouchableHighlight onPress={() => this.test(item) }>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 20, textAlign: 'center', color: textColor, paddingTop: 10}}>{item.name}</Text>
          <Text style={{fontSize: 8, textAlign: 'center', color: textColor, padding: 2, paddingBottom: 20}}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  }


  render() {
    const list = Array.from(this.state.peripherals.values());
    const btnScanTitle = !this.state.scanning ? '모듈 스캔' : '스캔 중 ...';

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll}>
            {(list.length == 0) &&
              <View style={{flex:1, margin: 20}}>
              </View>
            }
          <FlatList
            data={list}
            renderItem={({ item }) => this.renderItem(item) }
            keyExtractor={item => item.id}/>
        </ScrollView>

            <TouchableOpacity style={styles.button}  onPress={() => this.startScan() }>
              <Text style={{color: '#FFF'}}>{btnScanTitle}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => this.retrieveConnected()}>
              <Text style={{color: '#FFF'}}>{'연결 된 모듈 불러오기'}</Text>  
            </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height
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
  flat: {
    borderRadius: 10
  },
  button: {
    height: 40,
    margin: 10,
    marginTop: 0,
    borderRadius: 10,
    backgroundColor: "#0075DA",
    justifyContent: "center",
    alignItems: "center",
  },
});