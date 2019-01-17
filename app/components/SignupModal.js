import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import GenerateForm from 'react-native-form-builder';

const fieldsSignUp = [
  {
    type: 'text',
    name: 'firstName',
    required: true,
    icon: 'ios-person',
    label: 'First Name',
  },
  {
    type: 'text',
    name: 'lastName',
    icon: 'ios-lock',
    required: true,
    label: 'Last Name',
  },
  {
    type: 'text',
    name: 'skypeName',
    icon: 'ios-lock',
    required: false,
    label: 'Skype Username (if you have one)',
  },
  {
    type: 'text',
    name: 'emailAddress',
    required: true,
    icon: 'ios-person',
    label: 'Email Address',
  },
  {
    type: 'password',
    name: 'password',
    icon: 'ios-lock',
    required: true,
    label: 'Password',
  },
];

export default class SignupModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.onBackdropPress}
        backdropColor={'black'} >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Please Sign Up!
          </Text>
          <View style = {{ width:Metrics.screenWidth - 40, height: Metrics.screenHeight }}>
            <GenerateForm
              scrollViewProps={{overScrollMode: 'never'}}
              fields={fieldsSignUp}
              ref={async(c) => { 
                this.formGenerator = c;
                await AsyncStorage.setItem('KK', JSON.stringify(c.getValues()))
              }}
            />
          </View>
          <TouchableOpacity
            style = {styles.saveBtnView}
            onPress={this.props.onPressSaveNewUser}>
            <Text style = { styles.saveBtn }>SAVE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    height: Metrics.screenHeight*0.6,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    paddingTop: 25,
    marginBottom: 30,
    alignItems: 'center',
    overflow: 'hidden'
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  inputText: {
    width: Metrics.screenWidth*.75,
    height: 35,
    alignItems: 'center',
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#D9D5DC',
    paddingBottom: 2,
    marginTop: 15,

  },
  saveBtn: {
    color: Colors.lightPurple,
    fontSize: 18
  },
  saveBtnView: {
    position: 'absolute',
    bottom: 20
  },
});
