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

import { RNCamera } from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob';

import Moment from "moment";

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

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
    this.props.navigation.navigate("ContractorProfile");
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



alertFieldsShow(header, message){
  Alert.alert(
    header,
    message,
  [
    {text: "OK", onPress: () => { /*do nothing*/ }}
  ]);
}


async takePicture(){

    if (this.camera) {

      try {

        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        console.log(data.uri);

        this.setState({
          last_selfie_uri: data.uri
        });

        this.uploadImgOne(data.uri);

      } catch (err) {
        console.log(err.message);
      }

    }

  }

async uploadImgOne(im_path){

  NetInfo.fetch().then(state => {

    if(state.isConnected){

      this.setState({
        isLoading: true,
        showCamera: false
      });

      //var im_path = response.uri;
      var full_url = "http://dev2.rusrocket.com/test/api-add-user";

      RNFetchBlob.fetch('POST', full_url, {
        // dropbox upload headers
        'Content-Type' : 'multipart/form-data',
      }, [
        // append field data from file path
        {
          name: 'avatar',
          filename: 'avatar.jpg',
          // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
          // Or simply wrap the file path with RNFetchBlob.wrap().
          data: RNFetchBlob.wrap(im_path)
        },
        //{ name : 'user_id', data : this.state.user_id},
        { name: "user_name", data : this.state.user_name },
        { name: "password", data : this.state.password },
        { name: 'api_token', data : "j9Ofd5iAXyI9507Hmp4fT0"},

      ])
      .then((response) => {

        var data = JSON.parse(response.data);

        console.log("DATA", data);

        if(data && data.success && data.success==true){

          alert("Success");

          var azure_id = data.data.azure_id;
          var name = data.data.name;

          //save

          AsyncStorage.multiSet([
            [ "user_azure_id", azure_id.toString() ],
            [ "user_name", name.toString() ]
          ]);

        }else if (data && data.data && data.error_code && data.error_code==999) {

          alert(data.message);

          console.log("data existed", data.data.azure_id.toString());

          //AsyncStorage.multiSet([
            //[ "user_azure_id", data.data.azure_id.toString() ],
            //[ "user_name", name.toString() ]
          //]);

        }else if (data && data.message){

          alert(data.message);

        }


              this.setState({
                isLoading: false
              });

      })
      .catch((err) => {
        // error handling ..
        console.log(err);


              this.setState({
                isLoading: false
              });


      })


    }else{

      Alert.alert(
        'Network connection error', //title
        "Please check your internet connection", //text
        [{text: 'OK', onPress: () => this._doNothing()}] //buttons
      );

    }

  })

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
              color={"#ab5280"}
              style={{ alignSelf: "center" }}
            />
            <Text style={[styles.footerButtonText,{color: "#ab5280"}]}>Settings</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => { this.props.navigation.navigate( "MyProfile", {time: Moment().unix()} ); }}>
            <FontAwesome5
              name={"user"}
              size={Fonts.moderateScale(22)}
              color={Colors.appAccent}
              style={{ alignSelf: "center" }}
            />
            <Text style={[styles.footerButtonText,{color: Colors.appAccent}]}>My Profile</Text>
          </TouchableOpacity>


        </View>
      );

  }

  onPressMakePhoto(){

    console.log("showcamra");

    if(this.state.showCamera == true){
      this.setState({showCamera: false});
    }
    if(this.state.showCamera == false){
      this.setState({showCamera: true});
    }

  }

  _renderCamera(){

    if(this.state.showCamera == true){

      return (
        <View style={{
          flex: 1
        }}>

                        <RNCamera
                          style={{
                            width: Metrics.WIDTH,
                            height: Metrics.HEIGHT*0.4,
                            marginTop: 90,
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                          }}
                          ref={ref => {
                            this.camera = ref;
                          }}
                          type={RNCamera.Constants.Type.front}
                          flashMode={RNCamera.Constants.FlashMode.off}
                          androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                          }}
                          captureAudio={false}
                          androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                          }}
                        >
                          {({ camera, status, recordAudioPermissionStatus }) => {
                            if (status !== 'READY') return <PendingView />;
                            return (
                              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this.takePicture(camera)} style={{flex: 0,
                                    backgroundColor: '#fff',
                                    borderRadius: 5,
                                    padding: 15,
                                    paddingHorizontal: 20,
                                    alignSelf: 'center',
                                    margin: 20,
                                  }}>
                                  <Text style={{ fontSize: 14 }}> TAKE PHOTO </Text>
                                </TouchableOpacity>
                              </View>
                            );
                          }}
                        </RNCamera>
        </View>
      );

    }

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
                  color={Colors.appAccent}
                  style={{ alignSelf: "center", marginRight: 8 }}
                />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerScreenName}>Account setup</Text>
            </View>
            <TouchableOpacity style={styles.headerRight}></TouchableOpacity>
      </View>


        <View style={[styles.content, {backgroundColor: "#fff"}]}>

          <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={{ justifyContent: "center" }}>

                <View style={styles.contractorProfileBlockSeparator}>
                  <Text style={styles.contractorProfileBlockSeparatorText}>Face recognition</Text>
                </View>


              { this.state.isLoading == true ? (
                <ActivityIndicator size={60} color={Colors.appAccent} style={{margin:10,alignSelf:"center"}} />
              ) : null }


                <View style={{paddingTop: 0}}>


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


                { this.state.showCamera == false ? (<TouchableOpacity
                  onPress={() => {
                    if(this.state.user_name && this.state.password){

                      if(this.state.showCamera == true){
                        this.setState({showCamera: false});
                      }else{
                        this.setState({showCamera: true});
                      }
                    }else{

                      alert("Please set the name & password!");

                    }
                  }}
                  style={[styles.loginBtn]}
                >
                  <Text style={styles.loginBtnText}>Please take selfie photo looking at the camera</Text>
                </TouchableOpacity>) : null }


                <View style={{paddingTop: 40}}/>


                { this._renderCamera() }

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
