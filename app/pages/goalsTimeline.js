import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements'
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors'
import { LinearGradient } from 'expo';

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

        {/* <TouchableOpacity onPress={() => this.navigateFreshmanYear()}>
          <LinearGradient
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            colors={['#CE9FFC', '#7367F0']}
            style={styles.yearItem}>
            <Text style={styles.btnTxt}>
              Freshman Year
            </Text>
          </LinearGradient>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => this.navigateFreshmanYear()}>
            <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              colors={['#CE9FFC', '#7367F0']}
              style={styles.yearItem}>
              <View style = {[styles.circleView, {borderColor: '#CE9FFC'}]}>
                <Text style = {[styles.numberTxt, {color: '#CE9FFC'} ]}>1</Text>
              </View>
              <Text style={styles.btnTxt}>
                Freshman Year
              </Text>
            </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.navigateSophomoreYear()}>
            <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              colors={['#FEB692', '#EA5455']}
              style={styles.yearItem}>
              <View style = {[styles.circleView, {borderColor: '#FEB692'}]}>
                <Text style = {[styles.numberTxt, {color: '#FEB692'} ]}>2</Text>
              </View>
              <Text style={styles.btnTxt}>
                Sophomore Year
              </Text>
            </LinearGradient>
        </TouchableOpacity> 

        <TouchableOpacity onPress={() => this.navigateSophomoreYear()}>
            <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              colors={['#FEB692', '#EA5455']}
              style={styles.yearItem}>
              <View style = {[styles.circleView, {borderColor: '#FEB692'}]}>
                <Text style = {[styles.numberTxt, {color: '#FEB692'} ]}>2</Text>
              </View>
              <Text style={styles.btnTxt}>
                Sophomore Year
              </Text>
            </LinearGradient>
        </TouchableOpacity> 

        <Button
          buttonStyle={ styles.yearItem }
          onPress={() => this.navigateJuniorYear()}
          title='Junior Year'>
        </Button>

        <Button
          buttonStyle={ styles.yearItem }
          onPress={() => this.navigateSeniorYear()}
          title='Senior Year'>
        </Button>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50
  },
  yearItem: {
    backgroundColor : Colors.lightPurple, 
    width : 300,
    height: 50,
    borderRadius : 25, 
    margin : 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  btnTxt: {
    backgroundColor: 'transparent',
    fontSize: 18,
    color: '#fff',
  },
  circleView: {
    backgroundColor: 'white',
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    position:  'absolute',
    left: 0
  },
  numberTxt: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
