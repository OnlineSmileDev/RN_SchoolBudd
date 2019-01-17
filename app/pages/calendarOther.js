import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';

export default class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
    console.log("calendar screen props " + JSON.stringify(props));

  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
    console.log("pressed " + JSON.stringify(this.state));
    this.props.navigation.navigate('MakeAppointmentsScreen', { 
      propsCalendar: this.props.navigation.state.params.item.key, 
      bookingDate : day 
    });
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
        <TouchableOpacity onPress={() => this._onPressBack() }>
            <Text style = {styles.backBtn}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style = {styles.calendarView}>
          <Calendar
            onDayPress={this.onDayPress}
            style={styles.calendar}
            hideExtraDays
            markedDates={{[this.state.selected]: {selected: true}}}
            theme={{
              selectedDayBackgroundColor: 'green',
              todayTextColor: 'green',
              arrowColor: 'green',
            }}
          />
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.frost
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 350
  },
  backBtn: {
    fontSize: 15,
    marginTop: 15,
    marginLeft: 15,
    color: Colors.lightPurple
  },
  calendarView: {
    marginTop: 30,
    width: Metrics.screenWidth*.9,
    flex: 1,
    marginLeft: Metrics.screenWidth*.05
  },
});