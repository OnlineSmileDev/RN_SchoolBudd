import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SectionList, TextInput,
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Functions from '../Themes/Functions';
import Colors from '../Themes/Colors';
import { Input
} from "native-base";
import { Button } from 'react-native-elements'
import firebase from 'firebase';
import moment from 'moment';
import { Feather} from '@expo/vector-icons';
import DataTimes from '../Themes/DataTimes'
import Modal from "react-native-modal";
import LoggedOut from '../components/loggedOutScreen';
import AppointmentBlock from '../components/appointmentBlock';
import ConfirmAppointmentModal from '../components/confirmAppointmentModal'

const {width, height} = Dimensions.get('window');

export default class MakeAppointments extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
      headerTitle: 'Make Appointment',
      title: 'Make Appointment',
      headerRight: (
        <Feather style={{ marginRight: 15}}
          name="save"
          size={Metrics.icons.medium}
          color={Colors.lightPurple}
          onPress={params.saveAppointments}
        />
      ),
    }
};


  constructor(props) {
    super(props);
    this.state = {
      jedisSectioned: [{title: 'Jedis',data:[]}],
      buttonText: 'Show me your ID Card!',
      loading: true,
      refreshing: false,
      hasLoggedIn: true,
      selectedItems: [],
      timeslotsArray: [],
      timeslotsArrayString: "",
      totalPrice: 0,
      hourlyPrice: 0,
      consultantKey: '',
      dateString: '',
      isAppointmentModalVisible: false,
      appointmentGoal: '',
      currentUserID: '',
      year: '',
      month: '',
      day: '',
      preFeePrice : 0,
      fees: 0,
    }
    //see what props App.js is constructed with:
    console.log("make appointment screen props " + JSON.stringify(props));
  }

  componentWillMount =async() => {
    this.checkIfUserLoggedIn();
    this.props.navigation.setParams({ saveAppointments: this.toggleAppointmentModal });
    await this.setState({ consultantKey: this.props.navigation.state.params.propsCalendar});
    await this.setState({ dateString: this.props.navigation.state.params.bookingDate.dateString });
    await this.setState({ year: this.props.navigation.state.params.bookingDate.year });
    await this.setState({ month: this.props.navigation.state.params.bookingDate.month });
    await this.setState({ day: this.props.navigation.state.params.bookingDate.day });

    console.log("consultantkey " + this.state.consultantKey);

    var that = this;
    var price;
    firebase.database().ref('consultants').child(this.state.consultantKey).on('value',(snapshot) => {
    var childKey = snapshot.key;
    var childData = snapshot.val();
    price = childData.price;
  });
    const user = firebase.auth().currentUser
    await this.setState({ currentUserID: user.uid});
    // console.log("current user " + this.state.currentUserID);
    await this.setState({ hourlyPrice: price});
    this.appendJedis(3,1);
    var dateTime = "2015-06-17 02:24:36 AM";
    dateTime = moment(dateTime, 'YYYY-MM-DD, HH:mm:ss A').format('YYYY-MM-DD HH:mm:ss A');
    // console.log("test date time " + dateTime);
   
  }

  componentWillUnmount =async() => {
    await AsyncStorage.removeItem('selectedTimeslots');
  }

  toggleAppointmentModal = async() => {
    await this.setState({timeslotsArrayString : ""});
    var selectedTimeslots = await AsyncStorage.getItem('selectedTimeslots');
    console.log("time slots retrieved " +  JSON.stringify(selectedTimeslots));
    selectedTimeslots = JSON.parse(selectedTimeslots);
    if ((selectedTimeslots !== null) && (selectedTimeslots.length !== 0)) {
      var selectedTimeslotsString = selectedTimeslots[0];
      for(var i = 1; i < selectedTimeslots.length; i++ ){
        selectedTimeslotsString += ", " + selectedTimeslots[i];
      }
      await this.setState({ timeslotsArrayString : selectedTimeslotsString});
      await this.setState({ timeslotsArray: selectedTimeslots});
      await this.setState({ totalPrice: (this.state.hourlyPrice * 0.5 * selectedTimeslots.length * 1.15)});
      await this.setState({ preFeePrice: (this.state.hourlyPrice * 0.5 * selectedTimeslots.length)});
      await this.setState({ fees: (this.state.hourlyPrice * 0.5 * selectedTimeslots.length * .15)});
    } else {
      await this.setState({ timeslotsArray: []});
      await this.setState({ totalPrice: 0});
    }
    this.setState({isAppointmentModalVisible: !this.state.isAppointmentModalVisible});
  }

  async appendJedis(count, start) {

    var jedisList = this.state.jedisSectioned[0].data.slice();
    var filterPass = false;

    firebase.database().ref('consultants').child(this.state.consultantKey).child('availabilities')
    .child(this.state.dateString).on('child_added', (snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
      console.log("child data " + JSON.stringify(childData));
      jedisList.push(childData);
    });

    this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
  }

  onPressBookAppointments = async() => {
    //should be creating a charge for booking the appointments
    if (this.state.appointmentGoal == "") {
      alert("Please Fill Out a Goal for the Appointment");
    } else if (this.state.timeslotsArray.length == 0) {
      alert("Please Select a TimeSlot");
    } else {
      console.log("Testing 1 1 1 ");
      //for each loop through timeslots array {
      // await this.payForAppointment();
      // if (payment == true) { //needs to make sure student has a stripe account/credit card 
      //hooked up to the database
      var that = this;
      this.state.timeslotsArray.forEach(function(element) {
        var startTime = DataTimes[element].startTime;
        var endTime = DataTimes[element].endTime;
        // console.log("start time pre " + startTime);
        // console.log("end time pre " + endTime);
        startTime = JSON.stringify(that.state.dateString) + " " + + startTime;
        endTime = JSON.stringify(that.state.dateString) + " " + endTime;
        // console.log("end time " + endTime);
        startTime = moment(startTime, 'YYYY-MM-DD, HH:mm A').format('YYYY-MM-DD HH:mm:ss A');
        endTime = moment(endTime, 'YYYY-MM-DD, HH:mm A').format('YYYY-MM-DD HH:mm:ss A');
        // console.log("date time check start" + JSON.stringify(startTime));
        console.log("date time check end" + JSON.stringify(endTime));
        var pushRef = firebase.database().ref('appointments').push();
        var key = pushRef.key;
        console.log("pushRef " + pushRef.key);
        firebase.database().ref('appointments/' + pushRef.key).update({
          appointmentId : key,
          studentID: that.state.currentUserID,
          consultantID: that.state.consultantKey,
          summary: that.state.appointmentGoal,
          startTime: startTime,
          endTime: endTime,
          price : Number(that.state.totalPrice.toFixed(2))
        });
    //Functions.createCharge(this.state.totalPrice,card token(either from firebase or with create token function))
    //they should be able to select from previously saved cards, or navigate to the card input;
    //they should only have to navigate to the card input once, not during each iteration of the foreach loop
      var ref = firebase.database().ref('consultants').child(that.state.consultantKey).child("availabilities").child(that.state.dateString);
        firebase.database().ref('consultants').child(that.state.consultantKey).child("availabilities").child(that.state.dateString)
        .on("child_added", function(snapshot) {
        var value = snapshot.val().timeSlot;
        var key = snapshot.key;
        if (value == element) {
          ref.child(key).remove();
        }
        console.log("child data " + JSON.stringify(value));
        console.log("child key " + JSON.stringify(key));
      });
      });

      this.setState({isAppointmentModalVisible: !this.state.isAppointmentModalVisible});
      this.props.navigation.navigate('InputCreditCard',{totalPrice :Number(this.state.totalPrice.toFixed(2)), consultantId : this.state.consultantKey});
    }
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
    }
    var user = firebase.auth().currentUser;
    if (user) {
      this.setState({currentUserID: user.uid });
      // this.toggleAppointmentModal();
    } else {
      // No user is signed in.
      // alert("Please Sign In");
    }
   }

  onPressCategory() {
    this.toggleModal();
  }

  listItemRenderer(item) {
    return (
      <AppointmentBlock
      jedi={item}
      consultantKey={this.state.consultantKey}
      dateString={this.state.dateString}/>
    );
  }

  async loadMore(count, start) {
    if (start > 1 && !this.state.refreshing && !this.state.loading) {
      this.setState({loading: true});
      await this.appendJedis(count,start);
    }
  }

  _keyExtractor = (item, index) => index;


  resetList = async () => {
    await this.setState({refreshing: true, jedisSectioned: [{title: 'Jedis', data:[]}]});
    this.appendJedis(3,1);
    console.log("selectedItems " + JSON.stringify(this.state.selectedItems));
  }



  render() {

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
              <View style={styles.itemList}>
                <SectionList
                  sections={this.state.jedisSectioned}
                  // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
                  renderItem={({item}) => this.listItemRenderer(item)}
                  ItemSeparatorComponent = {() => (<View style={{height: 30}}/>)}
                  keyExtractor={this._keyExtractor}
                  contentContainerStyle = {{alignItems: 'center'}}
                  onRefresh = {() => this.resetList()}
                  refreshing = {this.state.refreshing}
                  removeClippedSubviews = {true}
                  // ListFooterComponent = {<ActivityIndicator />}
                />
              </View>

              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <ConfirmAppointmentModal
                  isVisible={this.state.isAppointmentModalVisible}
                  onBackdropPress={() => this.setState({ isAppointmentModalVisible: false })}
                  onChangeText={(text) => this.setState({appointmentGoal: text})}
                  onSubmitEditing={(text) => this.setState({appointmentGoal: text})}
                  onPress={() => this.onPressBookAppointments()}
                  preFeePrice = {this.state.preFeePrice.toFixed(2)}
                  Fees = {this.state.fees.toFixed(2)}
                  Total = {this.state.totalPrice.toFixed(2)}
                />
              </View>

            </SafeAreaView>
        </TouchableWithoutFeedback>
      );

    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    width: width,
    backgroundColor: "#ff8080",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    color: 'white',
    fontSize: 24
  },
  purchaseBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 200,
    width: Metrics.width*.9,
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemList: {
    height: Metrics.screenHeight*.8,
    width: Metrics.screenWidth,
    paddingTop: 10,
  },
  modalView: {

    height: Metrics.screenHeight*.6,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 15,

  },
  modalViewQuestion: {
    height: Metrics.screenHeight*.3,
    borderStyle: 'solid',
    borderWidth: .5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  modalText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 15,
  }
});
