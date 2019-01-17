import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class AvailabilityBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      cardSelected: false,
      time: '',
      userID: '',
    }
    console.log(JSON.stringify("AvailabilityBlock props " + JSON.stringify(props)));
  }

  navigateResource() {
    this.props.navigation.navigate(this.props.jedi.item.navigationPath);
  }

  componentDidMount() {
    this.setState({ time: this.props.jedi.item.key})
  }
  render() {
    return (
      <TouchableOpacity onPress={() => this.navigateResource()}>
        <View style={styles.cardView}>
          <Card
            containerStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
            wrapperStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
            title={this.props.jedi.item.key}>
          </Card>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth,
    borderRadius: Metrics.buttonRadius,
    height: Metrics.screenHeight* .1,
  },
  cardSelected: {
    backgroundColor: 'powderblue',
  },
  cardNotSelected: {
    backgroundColor: 'white',
  },
});
