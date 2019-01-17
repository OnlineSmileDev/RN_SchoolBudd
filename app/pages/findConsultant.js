import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SectionList,
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Button, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import SaleBlock from '../components/saleBlock';
import { Card, ListItem, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import LoggedOut from '../components/loggedOutScreen';
import SelectMultiple from 'react-native-select-multiple';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const {width, height} = Dimensions.get('window');

const items = [
  {
    name: "Consultant Type",
    id: 0,
    children: [{
        name: "IECA",
        id: "IECA",
      },{
        name: "Current College Student",
        id: "College Student",
      }]
  },
  {
    name: "Specialties",
    id: 1,
    children: [{
        name: "Extracurriculars in High School",
        id: "Extracurriculars in High School",
      },{
        name: "Grades in College",
        id: "Grades in College",
      },{
        name: "Fun in College",
        id: "Fun in College",
      },{
        name: "Transitioning to College",
        id: "Transitioning to College",
      },{
        name: "Internships",
        id: "Internships",
      }]
  },
  {
  name: "Hourly or Packages",
  id: 2,
  children: [{
      name: "Just Hourly",
      id: "Just Hourly",
    },{
      name: "Just Packages",
      id: "Just Packages",
    },{
      name: "Both",
      id: "Both",
    }]
    },
  ]
/*
  Displays information about Jedi
*/
export default class FindConsultant extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Find A Consultant',
    title: 'Find A Consultant',
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
    this.state = {
      jedisSectioned: [{title: 'Jedis',data:[]}],
      buttonText: 'Show me your ID Card!',
      loading: false,
      refreshing: false,
      price: 140,
      description: '',
      searchText: '',
      isModalVisible: false,
      currentCategory: 'Click Here to Change Categories',
      hasLoggedIn: false,
      selectedItems: [],
      selectedItemsComparisonArray: [],
      selectedConsultantType: false,
      selectedSpecialties: false,
      selectedAvailabilityPreferences: false,
      selectedConsultantTypeArray: [],
      selectedSpecialtiesArray: [],
      selectedAvailabilityPreferencesArray: [],
    }
  }

  async appendJedis(count, start) {
    var jedisList = this.state.jedisSectioned[0].data.slice();
    var filterPass = false;
    var database = firebase.database();
    database.ref('consultants').on('child_added', (snapshot) => {
    console.log("testing enter firebase ref");

    var childKey = snapshot.key;
    console.log("key " + childKey);

    var childData = snapshot.val();
    childData.key = childKey;
    console.log("child data pulled" + JSON.stringify(childData));
  
    jedisList.push(childData);
    console.log("jedis " + JSON.stringify(jedisList));

    this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
    console.log(childData);
});

  }

  onSelectionsChangeSpecialties = (selectedSpecialties) => {
    this.setState({ selectedSpecialties });
  }

  onSelectionsChangeConsultantType = (selectedConsultantType) => {
    this.setState({ selectedConsultantType });
  }

  componentWillMount() {
    this.checkIfUserLoggedIn();
    this.appendJedis(3,1);
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
    }
   }

  toggleModal =() => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  onPressCategory() {
    this.toggleModal();
  }

  listItemRenderer(item) {
    return (
      <SaleBlock
      jedi={item}
      bookAppointment={this.bookAppointment}
      selectConsultant={this.selectConsultant}/>
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

  onPressMiscellaneous = async() => {
    await this.setState({ isModalVisible: false, currentCategory: 'Miscellaneous'});
    console.log(this.state.currentCategory);

    this.resetList();
  }

  onSelectedItemsChange = async(selectedItems) => {
   this.setState({ selectedItems });
   console.log("typeof " + typeof this.state.selectedItems);

   var selectedItemsString = JSON.stringify(selectedItems);
   console.log("selectedItemsString " + selectedItemsString);
   console.log("typeof string" + typeof selectedItemsString);

   if (selectedItemsString.includes("IECA") || selectedItemsString.includes("Current College Student")) {
     await this.setState({ selectedConsultantType: true });
   } else {
     await this.setState({ selectedConsultantType: false });
   }
   if (selectedItemsString.includes("Just Hourly") || selectedItemsString.includes("Just Packages") || selectedItemsString.includes("Both")) {
     await this.setState({ selectedAvailabilityPreferences: true });
   } else {
    await  this.setState({ selectedAvailabilityPreferences: false });
   }
   if (selectedItemsString.includes("Extracurriculars in High School") || selectedItemsString.includes("Grades in College") || selectedItemsString.includes("Internships")
   || selectedItemsString.includes("Transitioning to College") || selectedItemsString.includes("Fun in College")) {
    await  this.setState({ selectedSpecialties: true });
   } else {
    await this.setState({ selectedSpecialties: false });
   }
 }

  bookAppointment= async (item) => {
    this.props.navigation.navigate('CalendarOtherScreen', {item: item});
  }

  selectConsultant= async (key) => {
    this.props.navigation.navigate('SelectConsultant', {key: key});
  }

  render() {
    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
              <View style={styles.purchaseBox}>
                <SearchBar
                  lightTheme
                  round
                  onChangeText={(searchText) => this.setState({searchText})}
                  onClearText={console.log('')}
                  onSubmitEditing={() => this.resetList()}
                  icon={{ type: 'font-awesome', name: 'search' }}
                  containerStyle={{width: Metrics.screenWidth*.95, marginBottom: 10}}
                  placeholder='Search For Consultant...'
                />

                <View style={{height: 100, width: Metrics.screenWidth*.9, justifyContent: 'center', marginBottom: 10}}>
                  <Slider
                    value={this.state.price}
                    thumbTintColor= 'lightblue'
                    minimumValue= {5}
                    maximumValue= {250}
                    value = {140}
                    step={1}
                    onValueChange={(price) => this.setState({price})}
                    onSlidingComplete={() => this.resetList()}
                  />
                  <Text>Maximum Price: ${this.state.price}</Text>

                  <SectionedMultiSelect
                    ref={SectionedMultiSelect => this.SectionedMultiSelect = SectionedMultiSelect}
                    items={items}
                    uniqueKey='id'
                    subKey='children'
                    selectText='Choose some things...'
                    showDropDowns={true}
                    readOnlyHeadings={true}
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectedItems={this.state.selectedItems}
                    showCancelButton={true}
                    showChips={false}
                    onConfirm={() => this.resetList()}
                    selectToggleIconComponent={  <CheckBox
                        center
                        title={"Filter Consultants"}
                        iconRight
                        iconType='material'
                        uncheckedIcon='add'
                        containerStyle={{width: Metrics.screenWidth*.95}}
                        onPress={() => this.SectionedMultiSelect._toggleSelector()}
                      />}
                  />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                </View>
              </View>

              <View style={styles.itemList}>
                <SectionList
                  sections={this.state.jedisSectioned}
                  renderItem={({item}) => this.listItemRenderer(item)}
                  ItemSeparatorComponent = {() => (<View style={{height: 10}}/>)}
                  keyExtractor={this._keyExtractor}
                  contentContainerStyle = {{alignItems: 'center'}}
                  onRefresh = {() => this.resetList()}
                  refreshing = {this.state.refreshing}
                  removeClippedSubviews = {true}
                  ListFooterComponent = {<ActivityIndicator />}
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
    height: Metrics.screenHeight*.6,
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
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 15,
  }
});
