import React from 'react';
import { StyleSheet, TouchableOpacity, AsyncStorage, Button, TextInput, Alert, ScrollView } from 'react-native';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import Modal from "react-native-modal";
import { WebBrowser } from 'expo';
import GenerateForm from 'react-native-form-builder';
import { View, Text } from 'native-base';
import Colors from '../Themes/Colors';
import SignupModal from '../components/SignupModal'
import LoginModal from '../components/LoginModal'

const stripe_url = 'https://api.stripe.com/v1/'
// const secret_key = firebase.config().stripe.token;
//create token
const stripe = require('stripe-client')('pk_test_qkgEe4JVlRcszR12vsEMODWU');


// These Fields will create a login form with three fields
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

export default class Login extends React.Component {

  static navigationOptions = {
     title: 'Login',
   };

   constructor(props) {
     super(props);
     this.state = {
       isLoginModalVisible: false,
       isSignUpModalVisible: false,
       signUpName: '',
       signUpEmail: '',
       signUpPassword: '',
       loginEmail: '',
       loginPassword: '',
       errorMessageSignUp: null,
       errorMessageLogin: '',
       skypeNameValid: false,
       skypeName: '',
       skypeAlertClear: false,
       formGenerator: null,
     }
     //see what props App.js is constructed with:
     // console.log(JSON.stringify(props));
   }

  componentDidMount() {
    this.checkIfUserLoggedIn();
  }


  toggleLoginModal =() => {
    this.setState({isLoginModalVisible: !this.state.isLoginModalVisible});
  }

  toggleSignUpModal =() => {
    this.setState({isSignUpModalVisible: !this.state.isSignUpModalVisible});
  }

  checkSkype =async() => {
    await this.toggleSignUpModal();
    WebBrowser.openBrowserAsync('https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1533498381&rver=7.0.6730.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D360605%26redirect_uri%3Dhttps%253A%252F%252Fsecure.skype.com%252Fportal%252Flogin%253Freturn_url%253Dhttps%25253A%25252F%25252Fsecure.skype.com%25252Fportal%25252Foverview%26response_type%3Dpostgrant%26state%3DNECRz3UFw8Yx%26site_name%3Dlw.skype.com&lc=1033&id=293290&mkt=en-US&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=hsu%2CReservedFlight33%2CReservedFlight67');
  }

  skypeAlert =async(formValues) => {
    if ((formValues.skypeName =="" )|| (this.state.skypeNameValid == false)) {
      await Alert.alert(
    'Skype',
    'You Will Need a Skype Username for Messaging',
    [
      {text: 'Make One Now', onPress: () => this.makeSkype()},
      {text: 'Check If I Have One', onPress: () => this.checkSkype()},
      {text: 'Make One Later', onPress: () => this.setState({skypeAlertClear: true}), style: 'cancel'},
    ],
    { cancelable: false }
  )
    }
  }

  makeSkype =async() => {
  await this.toggleSignUpModal();
    WebBrowser.openBrowserAsync('https://signup.live.com/signup?lcid=1033&wa=wsignin1.0&rpsnv=13&ct=1533497773&rver=7.0.6730.0&wp=MBI_SSL&wreply=https%3a%2f%2flw.skype.com%2flogin%2foauth%2fproxy%3fclient_id%3d578134%26redirect_uri%3dhttps%253A%252F%252Fweb.skype.com%26source%3dscomnav%26form%3dmicrosoft_registration%26site_name%3dlw.skype.com%26fl%3dphone2&lc=1033&id=293290&mkt=en-US&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=hsu%2CReservedFlight33%2CReservedF&fl=phone2&uaid=b20753c004f74358a6b9f4925476f546&lic=1');
  }

  verifyEmail = async() => {
    await firebase.auth().currentUser.sendEmailVerification()
    .then(function() {
      // Verification email sent.
      console.log("email Verification sent");
    })
    .catch(function(error) {
      // Error occurred. Inspect error.code.
    });
    await Alert.alert(
    'Email Verification',
    '',
    [
      {text: "We've sent a user verification email. Please click the link in your email inbox to be verified as a user", onPress: () => this.setState({skypeAlertClear: true}), style: 'cancel'},
    ],
    { cancelable: false }
  )
  }


  onPressSaveNewUser =async() => {
    const formValues = this.formGenerator.getValues();

    // var formValues1 = await AsyncStorage.getItem('KK');
    // console.log('FORM VALUES1', JSON.parse(formValues1));
    // var formValues = JSON.parse(formValues1)

    await this.setState({signUpEmail: formValues.emailAddress, signUpPassword: formValues.password });
    console.log("email " + this.state.signUpEmail);
    console.log("password " + this.state.signUpPassword);

    await firebase
    .auth()
    .createUserWithEmailAndPassword(this.state.signUpEmail, this.state.signUpPassword)
    .then(() => this.verifyEmail())
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else if (errorCode == 'auth/email-already-in-use'){
          alert('This email already has an account');
        } else if (errorCode == 'auth/invalid-email'){
          alert('Please enter a valid email');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
    

    var user = firebase.auth().currentUser;
    firebase.database().ref('users').child(user.uid).child('firstName').set(formValues.firstName);
    firebase.database().ref('users').child(user.uid).child('lastName').set(formValues.lastName);
  //   firebase.database().ref('users').child(user.uid).child('portal').set(portalType);
    firebase.database().ref('users').child(user.uid).child('email').set(this.state.signUpEmail);
    firebase.database().ref('users').child(user.uid).child('skypeName').set(this.state.skypeName);

    await AsyncStorage.setItem("hasLoggedIn", "true");

    this.toggleSignUpModal();


      //create stripe account if he is a consultant
      const selectedPortal = await AsyncStorage.getItem('portal');
      if (selectedPortal === 'consultant') {
        var consultantDetails = {
          "type" : 'custom',
          "email" : formValues.emailAddress,
          "business_name" : formValues.firstName + " " + formValues.lastName
            };
    
        var formBody = [];
        for (var property in consultantDetails) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(consultantDetails[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        var that = this;
        return fetch(stripe_url + 'accounts', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody
        }).then((response) => {
          response.json().then(solved => {
            console.log("Account " + JSON.stringify(solved));
            Alert.alert("Your custom stripe account is registered to this platform correctly.");
            firebase.database().ref('stripe_customers').child(firebase.auth().currentUser.uid).child('account').set({
              id : solved.id,
              email : solved.email,
              type : solved.type,
              created : solved.created
            });
          });
        }).catch((error) => {  
            console.error(error);
          });
      }
      
    // }
  }

  onPressSaveLogin =async() => {
    await firebase.auth().signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword)
    .catch(error => this.setState({ errorMessageLogin: error.message }));

    if (this.state.errorMessageLogin == "") {
      // var user = await firebase.auth().currentUser;
      console.log("email " + this.state.loginEmail);
      console.log("password " + this.state.loginPassword);
      // firebase.database().ref('users').child(user.uid).child('name');
      await AsyncStorage.setItem("hasLoggedIn", "true");
      this.toggleLoginModal();
    } else {
      alert(this.state.errorMessageLogin);
    }
  }

  onPressMakeAccount= async() => {
    await this.setState({
      isLoginModalVisible: false,
      isSignUpModalVisible: true
    })
  }

  checkIfUserLoggedIn = async() => {
    var _this = this;
    var user = firebase.auth().currentUser;
    if (user) {
      // console.warn('user already logged in');
    await AsyncStorage.setItem("hasLoggedIn", "true");
    } else {
      // console.warn('Prompt log in');
      // _this.logInWithFacebook(); //Change this line to log in with email or use Facebook Login
    }
  }

  async logInWithFacebook() {
    //This line obtains a token. A good guide on how to set up Facebook login
    // could be found on Expo website https://docs.expo.io/versions/latest/sdk/facebook.html
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('344994569331151', {permissions: ['public_profile', 'email'],});
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      const name = (await response.json()).name;
      //Signs up the user in Firebase authentication. Before being able to use
      //this make sure that you have Facebook enabled in the sign-in methods
      // in Firebase
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      var result = await firebase.auth().signInWithCredential(credential);

      //After signing in/up, we add some additional user info to the database
      //so that we can use it for other things, e.g. users needing to know
      //names of each other
      firebase.database().ref('users').child(result.uid).child('name').set(name);
      await AsyncStorage.setItem("hasLoggedIn", "true");
    } else {
      // this.logInWithFacebook();
    }
  }

  onChangeTextEmail(email) {
    this.setState({ loginEmail: email });
  }

  onChangeTextPassword(password) {
    this.setState({ loginPassword: password })
  }

  render() {
    const { navigate } = this.props.navigation;    
      return(
        <View style={styles.container}>
          <View style={styles.feedbackBox}>
            <Text style={styles.textStyles}>Here at MoveItMoveIt, we appreciate your usage of the app.</Text>

            <View style={styles.buttonsRow}>
              <MaterialCommunityIcons style={styles.icon}
                name='shield'
                size={Metrics.icons.large}
                color={Colors.lightPurple}
                onPress={() => this.toggleLoginModal()}
              />
              <MaterialCommunityIcons style={styles.icon}
                name="facebook"
                size={Metrics.icons.large}
                color={Colors.lightPurple}
                onPress={() => this.logInWithFacebook()}
              />
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center' }} >
            {
              this.state.isSignUpModalVisible === true? (
                <Modal
                  isVisible={this.state.isSignUpModalVisible}
                  onBackdropPress={() => this.setState({ isSignUpModalVisible: false })}
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
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      style = {styles.saveBtnView}
                      onPress={() => this.onPressSaveNewUser()}>
                      <Text style = { styles.saveBtn }>SAVE</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              ) : (
                <LoginModal 
                  isVisible={this.state.isLoginModalVisible}
                  onBackdropPress={() => this.setState({ isLoginModalVisible: false })}
                  onPressSaveLogin = {() => this.onPressSaveLogin()}
                  onPressMakeAccount = {() => this.onPressMakeAccount()}
                  onChangeTextEmail = {(email) => this.onChangeTextEmail(email)}
                  onChangeTextPassword = {(password) =>this.onChangeTextPassword(password)}
                />
              )
            }
            </View>
          </View>
        </View>
      );
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center'
    },
    feedbackBox: {
      width: Metrics.screenWidth*.9,
      height: Metrics.screenHeight*.3,
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 10,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: Colors.lightPurple,
      borderRadius: Metrics.screenWidth*.05,
      backgroundColor: 'white',
    },
    textStyles: {
      fontStyle: 'italic',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: 20,
    },
    logoutButton: {
      width: Metrics.screenWidth*.7,
      height: Metrics.screenHeight*.05,
      borderWidth: 1,
      marginBottom: 55,
      backgroundColor: 'lightblue',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: Metrics.screenWidth*.5,
    },
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
})
