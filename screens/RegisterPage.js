import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default class RegisterPage extends Component {   
  state = {
    Id: '',
    Password: '',
    Repeat: ''
  }

  onRegister = () => {
    const { Id, Password, Repeat } = this.state
    if (Repeat == Password)
    {
        fetch('http://192.168.0.6:5000/signup', {
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
                    Alert.alert(
                        '회원가입 성공',
                        '로그인을 해주세요',
                    );
                    this.props.navigation.navigate('Login')
                }
                else
                {
                    Alert.alert(
                        '회원가입 실패 : ',
                        data,
                    );
                }
            })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>회원가입</Text>
        
        <Text style={styles.label}>아이디</Text>
        <TextInput 
          style={styles.inputs}
          onChangeText={Id => this.setState({Id})}>
        </TextInput>
        
        <Text style={styles.label}>비밀번호</Text>
        <TextInput 
          secureTextEntry={true}
          style={styles.inputs}
          onChangeText={Password => this.setState({Password})}>
        </TextInput>

        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput 
          secureTextEntry={true}
          style={styles.inputs}
          onChangeText={Repeat => this.setState({Repeat})}>
        </TextInput>

        <TouchableOpacity style={styles.button} onPress={this.onRegister}>
          <Text style={{color: "#FFFFFF"}}>
            회원가입
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.login} onPress={() => {this.props.navigation.navigate('Login')}}>
          <Text style={{color: "#0075DA"}}>
            취소
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  title: {
    marginTop: 20,
    fontSize: 24,
    marginBottom: 50,
  },

  inputs: {
    width: "80%",
    height: "7%",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#DADFE3",
  },

  label: {
    width: "80%",
    color: "#000000",
    fontSize: 13,
    textAlign: "left",
  },

  button: {
    width: "70%",
    height: "5%",
    marginTop: "50%",
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#0075DA",
    justifyContent: "center",
    alignItems: "center",
  },

  login: {
    width: "70%",
    height: "5%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0075DA",
    justifyContent: "center",
    alignItems: "center",
  },

});

