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
  WebView,
  TextInput,
  Animated,
  Easing
} from 'react-native';

import { Font } from 'expo';


import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

const api = 'http://localhost:5000/';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  slideContainer: {
    backgroundColor: 'black'
  },
  backgroundImage: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
  },
  slide: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%'
  },
  /*
    Buttons
  */
  buttonContainer: {
    position: 'absolute',
    bottom: '5%',
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
  getStartedCompleteBtn: {
    width: 158,
    height: 49,
    borderRadius: 4,
    backgroundColor: "#2a95f1",
    marginLeft: 15,
    marginTop: 20
  },
  signInCompleteBtn: {
    width: 158,
    height: 49,
    borderRadius: 4,
    backgroundColor: "#2a95f1",
    marginLeft: 15,
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: "NunitoSans",
    fontSize: 18,
    letterSpacing: 0.34,
  },
  /*
    Forms
  */
  signInForm: {
    height: 300,
    width: null,
    alignItems: 'center',
    marginTop: 100
  },
  input: {
    width: 200,
    height: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 10,
    fontFamily: "NunitoSans",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0.45,
    color: "#5bd9fb"
  },
  heading: {
    fontFamily: "NunitoSans",
    fontSize: 36,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0.45,
    textAlign: "center",
    color: "#ffffff"
  },
  label: {
    fontFamily: "NunitoSans",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0.45,
    color: "#ffffff"
  }
});

class SignInButtons extends React.Component {

  render() {
    return (
      <View style={styles.buttonContainer}>
              <TouchableOpacity  style={styles.signInBtn}>
                <Text style={styles.buttonText} onPress={this.props.goToSignIn.bind(this)}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.getStartedBtn}>
                <Text style={styles.buttonText} onPress={this.props.goToGetStarted.bind(this)}>Get Started</Text>
              </TouchableOpacity>
            </View>
    );
  }
}

class Slideshow extends React.Component {

  constructor() {
    super();

    this.slides = [
      require("../assets/images/slides/SplashScreenLivingRoom.png"),
      require("../assets/images/slides/SplashScreenPhotos.png"),
      require("../assets/images/slides/SplashScreenMarketingassets.png"),
      require("../assets/images/slides/SplashScreenVideo.png")
    ];

    this.state = {
      currentSlideIndex: 0
    };
  }

  nextSlide() {
    if (this.state.currentSlideIndex < this.slides.length - 1) {
      this.setState(prevState => {
        return { currentSlideIndex: prevState.currentSlideIndex + 1};
      });
    }
  }

  render() {

      let signInButtons = null;
      if (this.props.fontsLoaded) {
        signInButtons = (<SignInButtons goToSignIn={this.props.goToSignIn.bind(this)} goToGetStarted={this.props.goToGetStarted.bind(this) } />);
      }
      let video = null;
      if (this.state.currentSlideIndex == 3) {

        video = (
          <View style={{position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center'}}>
          <WebView
              style={{flex: 1, width: 200, height: 120}}
              javaScriptEnabled={true}
              scalesPageToFit={false}
              source={{uri: 'https://www.youtube.com/embed/4YFGy4B0SFI?rel=0&autoplay=0&showinfo=0&controls=0'}}
          />
          </View>);
      }

      return (
          <View style={StyleSheet.flatten([styles.container, styles.slideContainer])}>
            <TouchableWithoutFeedback onPress={this.nextSlide.bind(this)}>
              <Image style={styles.slide} source={this.slides[this.state.currentSlideIndex]}></Image>
            </TouchableWithoutFeedback>
            {video} 
            {signInButtons}
          </View>
        );
    }
}

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to Walkthrough',
  };

  constructor() {
    super();

    this.state = {
      hasSeenSlideshow: false,
      fontsLoaded: false,
      isNewUser: false,
      username: '',
      password: ''
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'NunitoSans': require('../assets/fonts/NunitoSans-Regular.ttf'),
    });

    this.setState(prevState => { return {fontsLoaded: true} });

    if (await Expo.SecureStore.getItemAsync('userToken')) {
      const { navigate } = this.props.navigation;
      navigate('App')
    }
  }

  goToSignIn() {
    this.setState(prevState => { return {hasSeenSlideshow: true, isNewUser: false} });
  }

  goToGetStarted() {
    this.setState(prevState => { return {hasSeenSlideshow: true, isNewUser: true} });
  }

  completeSignIn() {
    this.setState(prevState => { return {hasSeenSlideshow: true, isNewUser: false} });

    Expo.SecureStore.setItemAsync('userToken', '123456789');
    
    const { navigate } = this.props.navigation;
    navigate('App');
  }

  validate() {
    return this.state.username
      && this.state.password1
      && this.state.password1 === this.state.password2;
  }

  completeGetStarted() {
    if (!this.validate()) { return false; }

    fetch(`${api}people`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password1,
      }),
    }).then(() => {
      this.setState(prevState => { return {hasSeenSlideshow: true, isNewUser: true} });

      Expo.SecureStore.setItemAsync('userToken', '123456789');

      const { navigate } = this.props.navigation;
      navigate('App');
    }).catch(() => {
      alert('Unable to connect')
    });
  }

  getUsernameField() {
    return (<TextInput
                autoCapitalize={'none'}
                autoCorrect={false}
                autoFocus={true}
                style={styles.input}
                onChangeText={(text)=>{this.setState({username:text})}}/>);
  }

  getPasswordField(isSecond) {
    
    var changeTextKey = 'password'+(isSecond?2:1);
    let onChangeText = (text) => {
      let stateUpdate = {};
      stateUpdate[changeTextKey] = text;
      this.setState(stateUpdate);
    };

    return (<TextInput
                autoCapitalize={'none'}
                autoCorrect={false}
                secureTextEntry={true}
                style={styles.input}
                onChangeText={onChangeText} />);
  }

  getUserForm() {
    let userForm;

    if (this.state.isNewUser) {
      userForm = (
          <View style={styles.signInForm}>
            <Text style={styles.heading}>Let's Get Started</Text>
            <View style={{marginTop:60}}>
              <Text style={styles.label}>Choose a username</Text>
              {this.getUsernameField()}
              <Text style={styles.label}>Choose a password</Text>
              {this.getPasswordField()}
              <Text style={styles.label}>Confirm Password</Text>
              {this.getPasswordField(true)}
              <TouchableOpacity style={styles.getStartedCompleteBtn} onPress={this.completeGetStarted.bind(this)}>
                <Text style={styles.buttonText}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

    } else {
      userForm = (
          <View style={styles.signInForm}>
            <Text style={styles.heading}>Welcome back</Text>
            <View style={{marginTop:60}}>
              <Text style={styles.label}>Username</Text>
              {this.getUsernameField()}
              <Text style={styles.label}>Password</Text>
              {this.getPasswordField()}
              <TouchableOpacity style={styles.signInCompleteBtn} onPress={this.completeSignIn.bind(this)}>
                <Text style={styles.buttonText}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }

    return userForm;
  }

  render() {
    if (!this.state.hasSeenSlideshow) {
        return (<Slideshow 
          goToSignIn={this.goToSignIn.bind(this)}
          goToGetStarted={this.goToGetStarted.bind(this)}
          fontsLoaded={this.state.fontsLoaded}
        />);
    }

    let signInButtons = null;
    if (this.state.fontsLoaded) {
      signInButtons = (<SignInButtons goToSignIn={this.goToSignIn.bind(this)} goToGetStarted={this.goToGetStarted.bind(this) } />);
    }

    let userForm = this.getUserForm();
    let userFormStyle = StyleSheet.flatten([styles.backgroundImage, /*{transform:[{translateY:translateY}]}*/]);

    return (
      <View style={styles.container}>
        <Animated.View style={styles.backgroundImage}>
          <ImageBackground style={styles.backgroundImage} source={require("../assets/images/bg.png")}>
          { userForm }
          </ImageBackground>
        </Animated.View>
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}