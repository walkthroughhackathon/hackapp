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
  WebView,
  Animated,
  Easing
} from 'react-native';
import { WebBrowser, Font } from 'expo';
import { GOOGLE_MAPS_EMBED_APIKEY, GOOGLE_MAPS_PLACES_APIKEY } from 'react-native-dotenv'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MonoText } from '../components/StyledText';


const Buttons = (props) => (
  <View style={styles.buttonContainer}>
                    <TouchableOpacity  style={styles.procedeBtn}>
                      <Text style={styles.buttonText} onPress={props.procede}>Confirm Address</Text>
                    </TouchableOpacity>
                  </View>
);

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
      addressSearch: "1624%20Market%20St%20%23211%2C%20Denver%2C%20CO%2080202",
      mapSource: this.getMapSource("1624%20Market%20St%20%23211%2C%20Denver%2C%20CO%2080202")
    };
    this.mapRef;
    this.animateValue = new Animated.Value(0);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'NunitoSans': require('../assets/fonts/NunitoSans-Regular.ttf'),
    });

    this.setState(prevState => { return {fontsLoaded: true} });
  }

slideUp () {
  this.animateValue.setValue(0);
  Animated.timing(
    this.animateValue,
    {
      toValue: 1,
      duration: 500,
      easing: Easing.ease
    }
  ).start(() => {});
}

  getMapSource(src) {
    return `<iframe width="400" height="300" frameborder="0" style="border:0"src="https://www.google.com/maps/embed/v1/place?q=${src}&key=${GOOGLE_MAPS_EMBED_APIKEY}" allowfullscreen></iframe>`
  }

  addressOnChangeText(text) {
    // this.mapRef && this.mapRef.reload();
    this.setState(prevState => ({addressSearch:text}));
    
    this.setState(prevState => ({mapSource:this.getMapSource(this.state.addressSearch)}));
  }

  procede() {
    this.slideUp();
  }

  render() {
    // let iframe = `<iframe width="600" height="450" frameborder="0" style="border:0"src="https://www.google.com/maps/embed/v1/place?q=${this.state.addressSearch}&key=${GOOGLE_MAPS_EMBED_APIKEY}" allowfullscreen></iframe>`;
    // let iframe = `<iframe width="600" height="450" frameborder="0" style="border:0"src="https://fbbt-upload.gardenhouse.io/" allowfullscreen></iframe>`;
    let form = this.state.fontsLoaded ? (<View style={styles.form}>
                <Text style={styles.heading}>List your property</Text>
                <View style={{marginTop:10}}>
                  <Text style={styles.label}>Enter an Address</Text>
                  
                </View>
                <View style={{position: 'absolute', top: '41%', left: 0, right: 0, alignItems: 'center'}}>
                  <WebView
                    ref={ wv => this.mapRef = wv}
                    style={{flex: 1, width: 400, height: 300}}
                    javaScriptEnabled={true}
                    scalesPageToFit={false}
                    source={{html:this.state.mapSource}}
                  />
              </View>
              <GooglePlacesAutocomplete
                  placeholder='1624 Market St #211, Denver, CO 80202'
                  minLength={2} // minimum length of text to search
                  autoFocus={true}
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  listViewDisplayed='auto'    // true/false/undefined
                  fetchDetails={true}
                  onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    this.addressOnChangeText(data.description)
                  }}
                  
                  getDefaultValue={() => ''}
                  
                  query={{
                    key: GOOGLE_MAPS_PLACES_APIKEY,
                    language: 'en', // language of the results
                    types: 'address' // default: 'geocode'
                  }}
                  
                  styles={{
                    textInputContainer: {
                      width: '100%',
                      backgroundColor: 'transparent'
                    },
                    description: {
                      fontWeight: 'bold'
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb'
                    },
                    listView: {
                      backgroundColor: 'white',
                      width: 396,
                      left: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#CCCCCC'
                    },
                    poweredContainer: {
                      display: 'none'
                    }
                  }}
                  
                  currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                  currentLocationLabel="Current location"
                  nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                  GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                  }}
                  GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance'
                  }}
                  debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                />
                
              </View>) : null;
      let translateY = this.animateValue.interpolate({
         inputRange: [0, 1],
          outputRange: [0, -1000],
          useNativeDriver: true
          });

    return (
      <View style={styles.container}>
          <View style={styles.container}>
            <ImageBackground style={styles.backgroundImage} source={require("../assets/images/bg.png")}>

            </ImageBackground>
            <Animated.View style={StyleSheet.flatten([styles.backgroundImage, {transform:[{translateY:translateY}]}])}>
              <ImageBackground style={styles.backgroundImage} source={require("../assets/images/bg.png")}>
                {form}
                <Buttons procede={this.procede.bind(this)} />
              </ImageBackground>
            </Animated.View>
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
  procedeBtn: {
    width: 158,
    height: 49,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: "NunitoSans",
    fontSize: 18,
    letterSpacing: 0.34,
  },
});
