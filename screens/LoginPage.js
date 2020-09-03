import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';


export default class LoginPage extends Component {   
  state = {
    Id: '',
    Password: '',
  }

  onLogin = () => {
    const { Id, Password } = this.state
    this.props.navigation.navigate('Main')
    fetch(`http://192.168.0.15:5000/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: Id,
              password: Password
            })
        }).then(result => {return result.text()}).then(data => {
                if (data == 'success')
                {
                    this.props.navigation.navigate('Main')
                }
                else
                {
                    Alert.alert(
                        '로그인 실패 : ',
                        data,
                    );
                }
            })
        console.log('dasd')
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Image 
          style={styles.bayernImage} 
          source={require('./../res/icon.png')}>
        </Image>
        <Text style={styles.title}>
          Selfmade-IoT
        </Text>
    
        <TextInput 
          style={styles.inputs}
          onChangeText={Id => this.setState({Id})}>
        </TextInput>
          
        <TextInput 
          secureTextEntry={true}
          style={styles.inputs}
          onChangeText={Password => this.setState({Password})}>
        </TextInput>

        <TouchableOpacity style={styles.login} onPress={this.onLogin}>
          <Text style={{color: "#FFFFFF"}}>
            로그인
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.register} onPress={() => {this.props.navigation.navigate('Register')}}>
          <Text style={{color: "#0075DA", textAlign: "right"}}>
            회원가입
          </Text>
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
    fontSize: 24,
    color: "#505050",
    marginBottom: 40,
  },

  bayernImage: {
    marginBottom: 20,
    width: 200,
    height: 200,
  },

  inputs: {
    width: "70%",
    height: "7%",
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DADFE3",
    textAlign: "center",
  },

  login: {
    width: "70%",
    height: "5%",
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#0075DA",
    justifyContent: "center",
    alignItems: "center",
  },

  register: {
    width: "70%",
    height: "5%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
});

