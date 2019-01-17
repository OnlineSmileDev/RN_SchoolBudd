import React from 'react';
import {
  AppRegistry, StyleSheet, Text, View, TouchableOpacity, StatusBar, Button,
  SectionList, ActivityIndicator, FlatList, TextInput, AsyncStorage} from 'react-native';
import * as firebase from 'firebase'
import TimelineBlock from '../components/timelineBlock';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';

export default class TimelineSheet extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { navigate } = navigation;
    return {
      headerTitle: params.year + " Year",
      title: 'Timeline',
      headerRight: (
        <Feather style={{ marginRight: 15}}
          name="plus-circle"
          size={Metrics.icons.medium}
          color={Colors.lightPurple}
          onPress={params.createQuestion}
        />
      ),
    }
  };

  constructor(props) {
     super(props);
     this.state ={
       jedisSectioned: [{title: 'Jedis',data:[]}],
       refreshing: false,
       goalsArray: [],
       isModalVisible: false,
       goalText: '',
       year: '',
     }
   }

   _keyExtractor = (item, index) => item.key;

  componentWillMount =async() => {
    this.props.navigation.setParams({ createQuestion: this.toggleModal });

    await this.setState({ year: this.props.navigation.state.params.year});
    var goalsArrayRetrieved = await AsyncStorage.getItem(JSON.stringify(this.state.year));

    goalsArrayRetrieved = await JSON.parse(goalsArrayRetrieved);
    
    if ((goalsArrayRetrieved !== null) && (goalsArrayRetrieved.length !== 0)) {
      await this.setState({goalsArray: goalsArrayRetrieved});
    }
    await console.log("goals array state post " + this.state.goalsArray);
  }

  toggleModal = async() => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  onPressPushGoal = async() => {
    var goals = this.state.goalsArray;
    if(this.state.goalText){
      goals.push(this.state.goalText);
      await this.setState({ goalsArray: goals});
      this.setState({isModalVisible: !this.state.isModalVisible});
    }else {
      alert("Please write question");
    }
    
  }

  onPressSaveGoals = async() => {
    await AsyncStorage.setItem(JSON.stringify(this.state.year), JSON.stringify(this.state.goalsArray));
    var testArray = await AsyncStorage.getItem(JSON.stringify(this.state.year));
  }

  listItemRenderer =(item, key) => {
    return (
      <TimelineBlock
        jedi={item}
        key = {key}
      />
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
          <TouchableOpacity onPress={() => this._onPressBack() }>
            <Text style = {styles.backBtn}>Back</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.goalsArray}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this.listItemRenderer}
        />
        <TouchableOpacity style = {styles.saveBtn} onPress={() => this.onPressSaveGoals()}>
          <Text style = {styles.saveTxt}>SAVE</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
            backdropColor={'black'}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Ask a Question!
              </Text>
              <TextInput style={styles.inputText}
                  placeholder="Ex: When are the common app essays released?"
                  underlineColorAndroid="transparent"
                  multiline={true}
                  onChangeText={(text) => this.setState({goalText: text})}
                  onSubmitEditing={(text) => this.setState({goalText: text})}
                  />
              <TouchableOpacity  onPress={() => this.onPressPushGoal()} style = {styles.selectBtn}>
                <Text style = {styles.selectBtnTxt}>Add</Text>
              </TouchableOpacity>
            </View>
          </Modal>
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
  modalView: {
    height: Metrics.screenHeight*.6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingTop: 25,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  inputText: {
    fontSize: 16,
    width: Metrics.screenWidth * .8,
    borderBottomWidth: 1,
    borderColor: Colors.steel,
    paddingBottom: 5,
    marginVertical: 15,
  },
  backBtn: {
    fontSize: 15,
    marginTop: 15,
    marginLeft: 15,
    color: Colors.lightPurple
  },
  saveBtn: {
    width: Metrics.screenWidth,
    // marginLeft: 35,
    height: 60,
    borderRadius: 5,
    backgroundColor: Colors.lightPurple,
    alignItems:'center',
    justifyContent: 'center'
  },
  saveTxt: {
    color: 'white',
    fontSize: 20,
  },
  selectBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: Metrics.screenWidth*.7,
    borderWidth: 1,
    borderColor: Colors.lightPurple,
    borderRadius: 20,
    marginTop: 15
  },
  selectBtnTxt: {
    color: Colors.lightPurple,
    fontSize: 18,
  }
});
