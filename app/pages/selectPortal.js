import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Metrics from '../Themes/Metrics';

export default class OnboardingScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
  };

  static propTypes = {
      selectPortalStudent: PropTypes.func.isRequired,
      selectPortalConsultant: PropTypes.func.isRequired,
      selectPortalSchool: PropTypes.func.isRequired,
      selectPortalParent: PropTypes.func.isRequired,
  };

  _selectPortalStudent = () => {
    if (this.props.selectPortalStudent) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalStudent();
      }
  }

  _selectPortalConsultant = () => {
    if (this.props.selectPortalConsultant) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalConsultant();
      }
  }

  _selectPortalSchool = () => {
    if (this.props.selectPortalSchool) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalSchool();
      }
  }

  _selectPortalParent = () => {
    if (this.props.selectPortalParent) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalParent();
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleTxt}>MoveItMoveIt</Text>
        <TouchableOpacity 
          style = {styles.btnView}
          onPress={this._selectPortalStudent}>
          <Text style = {styles.btnLabel}>Students</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style = {styles.btnView}
          onPress={this._selectPortalConsultant}>
          <Text style = {styles.btnLabel}>Consultants</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style = {styles.btnView}
          onPress={this._selectPortalSchool}>
          <Text style = {styles.btnLabel}>Educators</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style = {styles.btnView}
          onPress={this._selectPortalParent}>
          <Text style = {styles.btnLabel}>Parents</Text>
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
    justifyContent: 'center',
  },
  titleTxt: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15
  },
  btnView: {
    marginTop: 15,
    backgroundColor: '#30baec',
    height: 40,
    borderRadius: 20,
    width: Metrics.screenWidth*0.7,
    alignItems: 'center',
    justifyContent: 'center'
  },  
  btnLabel: {
    fontSize: 18,
    color: 'white',
  }
});
