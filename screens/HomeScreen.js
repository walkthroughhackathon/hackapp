import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  TextInput,
  WebView
} from 'react-native';
import { WebBrowser, Font } from 'expo';
import { GOOGLE_MAPS_EMBED_APIKEY } from 'react-native-dotenv'

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
      addressSearch: '3911%20zuni%20st'
    };
    this.mapRef;
  }

  async componentDidMount() {
    await Font.loadAsync({
      'NunitoSans': require('../assets/fonts/NunitoSans-Regular.ttf'),
    });

    this.setState(prevState => { return {fontsLoaded: true} });
  }

  addressOnChangeText(text) {
    // this.mapRef && this.mapRef.reload();
    this.setState(prevState => ({addressSearch:text}));
    
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.state.addressSearch.length > 3) {
        this.setState(prevState => ({mapSource:`<iframe width="400" height="300" frameborder="0" style="border:0"src="https://www.google.com/maps/embed/v1/place?q=${this.state.addressSearch}&key=${GOOGLE_MAPS_EMBED_APIKEY}" allowfullscreen></iframe>`}));
      }
    }, 1000);
  }

  render() {
    // let iframe = `<iframe width="600" height="450" frameborder="0" style="border:0"src="https://www.google.com/maps/embed/v1/place?q=${this.state.addressSearch}&key=${GOOGLE_MAPS_EMBED_APIKEY}" allowfullscreen></iframe>`;
    // let iframe = `<iframe width="600" height="450" frameborder="0" style="border:0"src="https://fbbt-upload.gardenhouse.io/" allowfullscreen></iframe>`;
    let form = this.state.fontsLoaded ? (<View style={styles.form}>
                <Text style={styles.heading}>List your property</Text>
                <View style={{marginTop:10}}>
                  <Text style={styles.label}>Enter an Address</Text>
                  <TextInput
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    style={styles.input}
                    onChangeText={this.addressOnChangeText.bind(this)} />
                </View>
                <View style={{position: 'absolute', top: '40%', left: 0, right: 0, alignItems: 'center'}}>
                  <WebView
                    ref={ wv => this.mapRef = wv}
                    style={{flex: 1, width: 400, height: 300}}
                    javaScriptEnabled={true}
                    scalesPageToFit={false}
                    source={{html:this.state.mapSource}}
                  />
              </View>
              </View>) : null;
    return (
      <View style={styles.container}>
          <View style={styles.container}>
            <ImageBackground style={styles.backgroundImage} source={require("../assets/images/bg.png")}>
              {form}
            </ImageBackground>
          </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },


  form: {
    height: 300,
    width: null,
    alignItems: 'center',
    marginTop: 100
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
});
