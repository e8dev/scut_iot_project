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
  ActivityIndicator
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

import RNFetchBlob from 'rn-fetch-blob'


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



      user_name: "",
      user_email: "",
      user_phone: "",
      password: "",

      last_selfie_uri: "",

      my_user_name: "",
      my_azure_id: "",


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

    // get Azure id from Async storage
    AsyncStorage.multiGet([

      "user_azure_id",
      "user_name"

    ]).then(data => {

      console.log("data",data);

      this.getProfile(data[0][1]);

      this.setState({
        my_azure_id: data[0][1],
        my_user_name: data[1][1],
      });

    });

  }

  componentDidUpdate(prevProps) {
    // if (prevProps.state.contractor_id !== this.props.route) {
    if (prevProps.route !== this.props.route) {
      console.log("LL0987 navigation");
      //console.log(this.props.route);
      AsyncStorage.multiGet([

        "user_azure_id",
        "user_name"

      ]).then(data => {

        console.log("data",data);

        this.setState({
          my_azure_id: data[0][1],
          my_user_name: data[1][1],
        });

      });


    }
  }

// SCREEN FUNCTIONS & LOGIC

  async getProfile(my_azure_id){

    NetInfo.fetch().then(state => {

      if(state.isConnected){

        this.setState({
          isLoading: true
        });

        //var im_path = response.uri;
        //var full_url = "http://dev2.rusrocket.com/test/api-delete-azure-id";

        var postData = {
          azure_id: my_azure_id
        };

        console.log("post 1", postData);

        Api.post("api-get-profile", postData)
        .then(response => {
          return response;
        })
        .then(responseJSON => {

          console.log("DATA", responseJSON);

          //var data = JSON.parse(responseJSON);
          var data = responseJSON;

          if(data && data.success && data.success==true){

            //alert("Success");

            this.setState({
              user_name: data.data.name,
              user_email: data.data.email,
              user_phone: data.data.phone,
              password: data.data.password,
            });

          }else if (data && data.message){

            alert(data.message);

          }

          this.setState({
            isLoading: false
          });

        });



      }

      });

  }

  async updateProfile(){

    NetInfo.fetch().then(state => {

      if(state.isConnected){

        this.setState({
          isLoading: true
        });

        //var im_path = response.uri;
        //var full_url = "http://dev2.rusrocket.com/test/api-delete-azure-id";

        var postData = {
          azure_id: this.state.my_azure_id,
          name: this.state.user_name,
          email: this.state.user_email,
          phone: this.state.user_phone,
          password: this.state.password,
        };

        console.log("post 1", postData);

        Api.post("api-update-profile", postData)
        .then(response => {
          return response;
        })
        .then(responseJSON => {

          console.log("DATA", responseJSON);

          //var data = JSON.parse(responseJSON);
          var data = responseJSON;

          if(data && data.success && data.success==true){

            alert("Success");

            this.setState({
              my_user_name: "",
              my_azure_id: "",
            });

          }else if (data && data.message){

            alert(data.message);

          }

          this.setState({
            isLoading: false
          });

        });



      }

      });

  }



  async deleteAzureId(){

    NetInfo.fetch().then(state => {

      if(state.isConnected){

        this.setState({
          isLoading: true
        });

        //var im_path = response.uri;
        //var full_url = "http://dev2.rusrocket.com/test/api-delete-azure-id";

        var postData = {
          azure_id: this.state.my_azure_id
        };

        console.log("post 1", postData);

        Api.post("api-delete-azure-id", postData)
        .then(response => {
          return response;
        })
        .then(responseJSON => {


          console.log("DATA", responseJSON);

          //var data = JSON.parse(responseJSON);
          var data = responseJSON;

          if(data && data.success && data.success==true){

            alert("Success");

            this.setState({
              my_user_name: "",
              my_azure_id: "",
            });

            /*
            AsyncStorage.multiSet([
              [ "user_azure_id", "" ],
              [ "user_name", "" ]
            ]);
            */

            this.setState({
              user_name: "",
              user_email: "",
              user_phone: "",
              password: "",
            });

            AsyncStorage.clear();

          }else if (data && data.message){

            alert(data.message);

          }

          this.setState({
            isLoading: false
          });

        });



      }

      });

    }


  isIphoneXorAbove() {
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((Metrics.HEIGHT === 812 || Metrics.WIDTH === 812) || (Metrics.HEIGHT === 896 || Metrics.WIDTH === 896))
    );
    // {this.props.state.translations ? this.props.state.translations.shared_menu_bottom_settings : ""}
  }


  _renderFooter = () => {

    //if(this.props.state.user_type == 2){
      //contractor
      return (
        <View style={[styles.footer, this.isIphoneXorAbove() ? {alignItems: "flex-start", paddingTop:Metrics.HEIGHT*0.015} : null ]}>


          <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => { this.props.navigation.navigate("TestLogin"); }} >
            <FontAwesome5
              name={"barcode"}
              size={Fonts.moderateScale(22)}
              color={Colors.appAccent}
              style={{ alignSelf: "center" }}
            />
            <Text style={[styles.footerButtonText,{color: Colors.appAccent}]}>Test</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => { this.props.navigation.navigate("AccountSettings"); }}>
            <FontAwesome5
              name={"boxes"}
              size={Fonts.moderateScale(22)}
              color={Colors.appAccent}
              style={{ alignSelf: "center" }}
            />
            <Text style={[styles.footerButtonText,{color: Colors.appAccent}]}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => { this.props.navigation.navigate("MyProfile"); }}>
            <FontAwesome5
              name={"user"}
              size={Fonts.moderateScale(22)}
              color={"#ab5280"}
              style={{ alignSelf: "center" }}
            />
            <Text style={[styles.footerButtonText,{color: "#ab5280"}]}>My Profile</Text>
          </TouchableOpacity>

        </View>
      );

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

            <TouchableOpacity style={styles.headerLeft} onPress={() => {this.props.navigation.openDrawer();} }>
                <FontAwesome5
                  name={"bars"}
                  size={Fonts.moderateScale(19)}
                  color={"#ab5280"}
                  style={{ alignSelf: "center", marginRight: 8 }}
                />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={[styles.headerScreenName,{color:"#ab5280"}]}>My Profile</Text>
            </View>
            <TouchableOpacity style={styles.headerRight}></TouchableOpacity>
      </View>


        <View style={[styles.content, {backgroundColor: "#fff"}]}>

          <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={{ justifyContent: "center" }}>

                <View style={[styles.contractorProfileBlockSeparator,{backgroundColor:"#ab5280"}]}>
                  <Text style={styles.contractorProfileBlockSeparatorText}>Face recognition</Text>
                </View>

                <View style={{paddingTop: 0}}>

                <Text style={styles.txtInputLabelText}>User Azure Id: {this.state.my_azure_id}</Text>

                <View style={{ height: 10 }} />


                <TouchableOpacity
                  onPress={() => {
                    // DELETE USER API
                    this.deleteAzureId()
                  }}
                  style={[styles.loginBtn,{backgroundColor:"#ab5280"}]}
                >
                  <Text style={styles.loginBtnText}>DELETE MY PROFILE</Text>
                </TouchableOpacity>


                <View style={{paddingTop: 20}}/>

                { this.state.isLoading? (<ActivityIndicator size={60} color={Colors.appAccent} style={{margin:10,alignSelf:"center"}} />) : null }




                  <Text style={styles.txtInputLabelText}>Name:</Text>
                  <TextInput
                    style={styles.txtInput}
                    label="Name"
                    placeholder="Name"
                    value={this.state.user_name}
                    keyboardType="default"
                    returnKeyType="done"
                    maxLength={50}
                    selectionColor={"#444"}
                    autoCapitalize="none"
                    onChangeText={user_name => this.setState({ user_name: user_name })}
                  />
                  <View style={{ height: 10 }} />


                  <Text style={styles.txtInputLabelText}>Email:</Text>
                  <TextInput
                    style={styles.txtInput}
                    label="Email"
                    placeholder="Email"
                    value={this.state.user_email}
                    keyboardType="default"
                    returnKeyType="done"
                    maxLength={50}
                    selectionColor={"#444"}
                    autoCapitalize="none"
                    onChangeText={user_email => this.setState({ user_email: user_email })}
                  />
                  <View style={{ height: 10 }} />


                  <Text style={styles.txtInputLabelText}>Phone:</Text>
                  <TextInput
                    style={styles.txtInput}
                    label="Phone"
                    placeholder="Phone"
                    value={this.state.user_phone}
                    keyboardType="default"
                    returnKeyType="done"
                    maxLength={50}
                    selectionColor={"#444"}
                    autoCapitalize="none"
                    onChangeText={user_phone => this.setState({ user_phone: user_phone })}
                  />
                  <View style={{ height: 10 }} />

                  <Text style={styles.txtInputLabelText}>Password:</Text>
                  <TextInput
                    style={styles.txtInput}
                    label="Password"
                    placeholder="Password"
                    value={this.state.password}
                    keyboardType="default"
                    returnKeyType="done"
                    maxLength={50}
                    selectionColor={"#444"}
                    autoCapitalize="none"
                    onChangeText={password => this.setState({ password: password })}
                  />
                  <View style={{ height: 10 }} />

                  <TouchableOpacity
                    onPress={() => {
                      this.updateProfile()
                    }}
                    style={[styles.loginBtn,{backgroundColor:"#ab5280"}]}
                  >
                    <Text style={styles.loginBtnText}>UPDATE MY PROFILE</Text>
                  </TouchableOpacity>




                <View style={{ height: 20 }} />

            </View>

          </KeyboardAwareScrollView>
        </View>

        {this._renderFooter()}

      </SafeAreaView>
    );
  }
}

export default AccountSettings;
