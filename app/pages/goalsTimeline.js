import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity, Button} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import metrics from '../Themes/Metrics';
import { Col } from 'native-base';

export default class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { navigate } = navigation;
    return {
      headerTitle: 'Four Year Plan',
      title: 'Four Year Plan',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
    }
    //see what props App.js is constructed with:
    console.log("goals timeline " + JSON.stringify(props));
  }

  navigateFreshmanYear= async() =>{
    this.props.navigation.navigate("TimelineSheet", {year: 'Freshman'});
  }

  navigateSophomoreYear= async() =>{
    this.props.navigation.navigate("TimelineSheet", {year: 'Sophomore'});
  }

  navigateJuniorYear= async() =>{
    this.props.navigation.navigate("TimelineSheet", {year: 'Junior'});
  }

  navigateSeniorYear= async() =>{
    this.props.navigation.navigate("TimelineSheet", {year: 'Senior'});
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container} >
        <TouchableOpacity style = {styles.btnView} onPress={() => this.navigateFreshmanYear()}>
          <Text style = {styles.btnTxt}>Freshman Year</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.btnView} onPress={() => this.navigateSophomoreYear()}>
          <Text style = {styles.btnTxt}>Sophomore Year</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.btnView} onPress={() => this.navigateJuniorYear()}>
          <Text style = {styles.btnTxt}>Junior Year</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.btnView} onPress={() => this.navigateSeniorYear()}>
          <Text style = {styles.btnTxt}>Senior Year</Text>
        </TouchableOpacity>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 15
  },
  btnView: {
    width: Metrics.screenWidth*.8,
    height: 40,
    borderRadius: 20,
    borderColor: Colors.lightPurple,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  btnTxt : {
    fontSize: 20,
    color: Colors.lightPurple,
  }
  
});
