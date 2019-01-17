import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default class TimelineBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      cardSelected: false,
      time: '',
      userID: '',
    }
  }

  render() {
    return (
      <View style={styles.cardView}>
        {/* <Card
          containerStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
          wrapperStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
          title={this.props.jedi.item}>
        </Card> */}
        <Text style = {styles.itemTxt}>{this.props.jedi.item}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth-20,
    marginLeft: 10,
    borderRadius: Metrics.buttonRadius,
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10,
    justifyContent: 'center',
    minHeight: 50,

  },
  cardSelected: {
    backgroundColor: 'powderblue',
  },
  cardNotSelected: {
    backgroundColor: 'white',
  },
  itemTxt: {
    fontSize: 18,
  },
});
