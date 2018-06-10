import React from 'react';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';

import { Font } from 'expo';
import YouTube from 'react-native-youtube';


import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slideContainer: {
    backgroundColor: 'black'
  },
  backgroundImage: {
        flex: 1,
  },
  slide: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    height: null,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  signInBtn: {
    width: 158,
    height: 49,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  getStartedBtn: {
    width: 158,
    height: 49,
    borderRadius: 4,
    backgroundColor: "#2a95f1",
    marginLeft: 15
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: "NunitoSans",
    fontSize: 18,
    letterSpacing: 0.34,
  }
});

class SignInButtons extends React.Component {

  render() {
    return (
      <View style={styles.buttonContainer}>
              <TouchableOpacity  style={styles.signInBtn}>
                <Text style={styles.buttonText} onPress={this._signInAsync}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.getStartedBtn}>
                <Text style={styles.buttonText} onPress={this._signInAsync}>Get Started</Text>
              </TouchableOpacity>
            </View>
    );
  }
}

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  constructor() {
    super();

    this.state = {
      hasSeenSlideshow: false,
      currentSlideIndex: 0,
      fontsLoaded: false
    }

    this.slides = [
      require("../assets/images/slides/SplashScreenLivingRoom.png"),
      require("../assets/images/slides/SplashScreenPhotos.png"),
      require("../assets/images/slides/SplashScreenMarketingassets.png"),
      require("../assets/images/slides/SplashScreenVideo.png")
    ];
  }

  async componentDidMount() {
    await Font.loadAsync({
      'NunitoSans': require('../assets/fonts/NunitoSans-Regular.ttf'),
    });

    this.setState(prevState => { return {fontsLoaded: true} });
  }

  _nextSlide() {
    this.setState(prevState => {
      return { currentSlideIndex: prevState.currentSlideIndex + 1};
    });

    if (this.state.currentSlideIndex >= this.slides.length - 1) {
      this.setState(prevState => {
        return { hasSeenSlideshow: true };
      });
    }
  }

  render() {
    if (!this.state.hasSeenSlideshow) {
    
      let signInButtons = null;
      if (this.state.fontsLoaded) {
        signInButtons = (<SignInButtons />);
      }
      let video = null;
      if (this.state.currentSlideIndex == 3) {

        video = (
          <YouTube
            videoId={'4YFGy4B0SFI'}
            apiKey={'AIzaSyAoeSFkUuzUcO00Em_C9NzhqZLrurK2ziM'}
            style={{ alignSelf: 'stretch', height: 200 }}
          />);
      }

      return (
          <View style={StyleSheet.flatten([styles.container, styles.slideContainer])}>
            <TouchableWithoutFeedback onPress={this._nextSlide.bind(this)}>
              <Image style={styles.slide} source={this.slides[this.state.currentSlideIndex]}></Image>
            </TouchableWithoutFeedback>
            {video}
            {signInButtons}
          </View>
        )
    }

    let signInButtons = null;
    if (this.state.fontsLoaded) {
      signInButtons = (<SignInButtons />);
    }

    return (
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require("../assets/images/bg.png")}>
          { signInButtons }
        </ImageBackground>
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}