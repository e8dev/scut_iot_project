import React, { PureComponent, useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Switch,
  Image,
  StatusBar,
  TouchableOpacity,
  PanResponder,
  Platform,
  BackHandler,
  I18nManager,
  RefreshControl,
  FlatList,
  Alert,
  Button,
  Animated,
  Easing,
  Keyboard,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground
} from "react-native";

//import PropTypes from 'prop-types';
//import { SafeAreaView } from 'react-native-safe-area-context';
//import { SafeAreaView } from 'react-navigation';

//styles
import styles from "../../../../../Themes/appStyles";
import { Images, Fonts, Metrics, Colors } from "../../../../../Themes/";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//UI/UX

//shared
import Api from "../../../Api/Api";
import AsyncStorage from "@react-native-community/async-storage";
import NetInfo from '@react-native-community/netinfo';
//constants
import TasksConstants from "../../../Stack/constants";
import AppTranslations from "../../../Stack/translations";


class AccountSettings extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      //basic
      isLoading: false,
      screen_title: "",
      app_language: "en",
      translations: null,

      //screen
      password: "",
      user_name: "",
      last_selfie_uri: "",


      showCamera: false,


    };

  }

// INITIAL FUNCTIONS

  onPressBack() {

  }

  componentDidMount(){

    //console.log("loooooo "+JSON.stringify(this.props.state.translations));

    var that = this;
    BackHandler.addEventListener("hardwareBackPress", function() {
      //that.props.navigation.navigate("CustomerMainScreen");
      return true;
    });

    const { route } = this.props;

    //console.log("test", this.props.state.contractor_profile_data);

    //this.getApiCategoriesList();
    //this.setProfileLocalData();


  }

  componentDidUpdate(prevProps) {
    // if (prevProps.state.contractor_id !== this.props.route) {
    if (prevProps.route !== this.props.route) {
      //console.log("navigation");
      //console.log(this.props.route);



    }
  }

// SCREEN FUNCTIONS & LOGIC

  isIphoneXorAbove() {
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((Metrics.HEIGHT === 812 || Metrics.WIDTH === 812) || (Metrics.HEIGHT === 896 || Metrics.WIDTH === 896))
    );
    // {this.props.state.translations ? this.props.state.translations.shared_menu_bottom_settings : ""}
  }


  render() {

    StatusBar.setBarStyle("dark-content", true);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("#ffffff", true);
      StatusBar.setTranslucent(true);
    }

    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never' }}>


        <View style={styles.header}>



            <View style={[styles.headerCenter,{width: Metrics.WIDTH}]}>
              <Text style={[styles.headerScreenName,{color:"#ab5280"}]}>Login Screen of SomeApp</Text>
            </View>

      </View>


        <View style={[styles.content, {backgroundColor: "#fff"}]}>

          <ImageBackground source={Images.login_bg} style={{
              width: Metrics.WIDTH,
              height: Metrics.HEIGHT,
              resizeMode: "cover",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: Metrics.HEIGHT*0.2
            }}>



                <View style={{paddingTop: 0}}>


                <TextInput
                  style={[styles.txtInput,{borderBottomColor:"#ab5280"}]}
                  label="Name"
                  placeholder="Login"
                  value={this.state.user_name}
                  keyboardType="default"
                  returnKeyType="done"
                  maxLength={50}
                  selectionColor={"#444"}
                  autoCapitalize="none"
                  onChangeText={user_name => this.setState({ user_name: user_name })}
                />
                <View style={{ height: 20 }} />

                <TextInput
                  style={[styles.txtInput,{borderBottomColor:"#ab5280"}]}
                  label="Name"
                  placeholder="Password"
                  value={this.state.user_name}
                  keyboardType="default"
                  returnKeyType="done"
                  maxLength={50}
                  selectionColor={"#444"}
                  autoCapitalize="none"
                  onChangeText={user_name => this.setState({ user_name: user_name })}
                />
                <View style={{ height: 10 }} />

                <Text style={[styles.headerScreenName,{color:"#ab5280",alignSelf:"center"}]}>OR</Text>

                <View style={{ height: 10 }} />

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("TestScreen");
                  }}
                  style={[styles.loginBtn,{backgroundColor:"#ab5280"}]}
                >
                  <Text style={[styles.loginBtnText,{fontSize: 20}]}>Use QuickPass to login</Text>
                </TouchableOpacity>



            </View>

            </ImageBackground>

        </View>


      </SafeAreaView>
    );
  }
}

export default AccountSettings;
