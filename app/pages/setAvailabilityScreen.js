// apikey = AIzaSyAqVJm-bHrvstuAs5IIXjxMSiNSJ4p7Jco

/*SectionList with card component; on click card, the availability is set
*/

//maybe i can store this array on the device, and when i get the key, get tge start time and
//end times too.
//json.stringify -> json.parse.startTime

import React from 'react';
import {
  AppRegistry, StyleSheet, Text, View, TouchableOpacity, StatusBar, Button,
  SectionList, ActivityIndicator, FlatList, Alert, AsyncStorage} from 'react-native';
import * as firebase from 'firebase'
import AvailabilityBlock from '../components/availabilityBlock';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';
import Modal from "react-native-modal";
import Colors from '../Themes/Colors'

const dataTimes =
[
  {key: '6:00 - 6:30 am', startTime: '6:00 am', endTime: '6:30 am'},
  {key: '6:30 - 7:00 am', startTime: '6:30 am', endTime: '7:00 am'},
  {key: '7:00 - 7:30 am', startTime: '7:00 am', endTime: '7:30 am'},
  {key: '7:30 - 8:00 am', startTime: '7:30 am', endTime: '8:00 am'},
  {key: '8:00 - 8:30 am', startTime: '8:00 am', endTime: '8:30 am'},
  {key: '8:30 - 9:00 am', startTime: '8:30 am', endTime: '9:00 am'},
  {key: '9:00 - 9:30 am', startTime: '9:00 am', endTime: '9:30 am'},
  {key: '9:30 - 10:00 am', startTime: '9:30 am', endTime: '10:00 am'},
  {key: '10:00 - 10:30 am', startTime: '10:00 am', endTime: '10:30 am'},
  {key: '10:30 - 11:00 am', startTime: '10:30 am', endTime: '11:00 am'},
  {key: '11:00 - 11:30 am', startTime: '11:00 am', endTime: '11:30 am'},
  {key: '11:30 - 12:00 pm', startTime: '11:30 am', endTime: '12:00 pm'},
  {key: '12:00 - 12:30 pm', startTime: '12:00 pm', endTime: '12:30 pm'},
  {key: '12:30 - 1:00 pm', startTime: '12:30 pm', endTime: '1:00 pm'},
  {key: '1:00 - 1:30 pm', startTime: '1:00 pm', endTime: '1:30 pm'},
  {key: '1:30 - 2:00 pm', startTime: '1:30 pm', endTime: '2:00 pm'},
  {key: '2:00 - 2:30 pm', startTime: '2:00 pm', endTime: '2:30 pm'},
  {key: '2:30 - 3:00 pm', startTime: '2:30 pm', endTime: '3:00 pm'},
  {key: '3:00 - 3:30 pm', startTime: '3:00 pm', endTime: '3:30 pm'},
  {key: '3:30 - 4:00 pm', startTime: '3:30 pm', endTime: '4:00 pm'},
  {key: '4:00 - 4:30 pm', startTime: '4:00 pm', endTime: '4:30 pm'},
  {key: '4:30 - 5:00 pm', startTime: '4:30 pm', endTime: '5:00 pm'},
  {key: '5:00 - 5:30 pm', startTime: '5:00 pm', endTime: '5:30 pm'},
  {key: '5:30 - 6:00 pm', startTime: '5:30 pm', endTime: '6:00 pm'},
  {key: '6:00 - 6:30 pm', startTime: '6:00 pm', endTime: '6:30 pm'},
  {key: '6:30 - 7:00 pm', startTime: '6:30 pm', endTime: '7:00 pm'},
  {key: '7:00 - 7:30 pm', startTime: '7:00 pm', endTime: '7:30 pm'},
  {key: '7:30 - 8:00 pm', startTime: '7:30 pm', endTime: '8:00 pm'},
  {key: '8:00 - 8:30 pm', startTime: '8:00 pm', endTime: '8:30 pm'},
  {key: '8:30 - 9:00 pm', startTime: '8:30 pm', endTime: '9:00 pm'},
  {key: '9:00 - 9:30 pm', startTime: '9:00 pm', endTime: '9:30 pm'},
  {key: '9:30 - 10:00 pm', startTime: '9:30 pm', endTime: '10:00 pm'},
  {key: '10:00 - 10:30 pm', startTime: '10:00 pm', endTime: '10:30 pm'},
  {key: '10:30 - 11:00 pm', startTime: '10:30 pm', endTime: '11:00 pm'},
  {key: '11:00 - 11:30 pm', startTime: '11:00 pm', endTime: '11:30 pm'},
  {key: '11:30 - 12:00 am', startTime: '11:00 pm', endTime: '12:00 am'},
]


export default class SetAvailabilityScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Set Availability',
    title: 'Set Availability',
    headerLeft: (
      <Feather style={styles.icon}
        name="menu"
        size={Metrics.icons.medium}
        color={Colors.lightPurple}
        onPress={() => navigate('DrawerToggle')}
      />
      )
    }
};

  constructor(props) {
     super(props);
     this.state ={
       bookingDate: this.props.navigation.state.params.bookingDate,
       jedisSectioned: [{title: 'Jedis',data:[]}],
       refreshing: false,
       showAgain: true,
     }
     console.log("set availability screen props " + JSON.stringify(props));
   }

   _keyExtractor = (item, index) => item.key;

   componentDidMount =async() => {
     console.log(JSON.stringify(this.props.navigation.state.params.bookingDate.dateString));
     console.log("book date prop " + this.state.bookingDate);
     var that = this;
     await AsyncStorage.getItem('showAgain', (err, result) => {
      console.log("result show again " + result);
      if (result == "true") {
        that.setState({showAgain: false});
      }
    });
     if (that.state.showAgain == true) {
     Alert.alert(
      'Set Availibility',
      'Clicking a time period saves it as available. Students will be able to book this timeslot for an appointment!',
      [
        {text: 'Do not show again', onPress: () => {that.doNotShowAgain()}},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
    }

   }

   doNotShowAgain = async() => {
    await AsyncStorage.setItem('showAgain', 'true');
    await AsyncStorage.getItem('showAgain', (err, result) => {
      console.log('show again test ' + result);
    });
    console.log("do not show again entered");
   }

   listItemRenderer =(item) => {
     return (
       <AvailabilityBlock
       jedi={item}
       date={this.state.bookingDate}/>
     );
   }

  _onPressBack(){
    const {goBack} = this.props.navigation
    goBack()
  }


  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <View>
          <TouchableOpacity onPress={() => this._onPressBack() }><Text>Back</Text></TouchableOpacity>
                      <Text>{this.state.bookingDate.dateString}</Text>
                      <Text></Text>
        </View>
          <FlatList
            data={dataTimes}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this.listItemRenderer}
          />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
