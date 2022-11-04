import React, { Component } from 'react';
import {
  Alert, StyleSheet, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000)

const heightKey = '@MyApp:key1';
const BMIKey = '@MyApp:key2';

export default class App extends Component {
  state = {
    weight: 0,
    height: 0,
    BMI: 0,
  };

  constructor(props) {
    super(props);
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const height = await AsyncStorage.getItem(heightKey);
      const BMI = await AsyncStorage.getItem(BMIKey);
      this.setState({ height, BMI });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onSave = async () => {
    const { height, BMI } = this.state;

    try {
      await AsyncStorage.setItem(heightKey, height);
      await AsyncStorage.setItem(BMIKey, BMI);
      Alert.alert('Saved', 'Successfully saved on device');
    } catch (error) {
      Alert.alert('Error', 'There was an error while saving the data');
    }
  }

  onWeightChange = (weight) => {
    this.setState({ weight });
  }

  onHeightChange = (height) => {
    this.setState({ height });
  }

  onCalculate = () => {
    const { weight, height } = this.state;
    if (isNaN(weight) || weight == ""){
      Alert.alert('Error', 'Weight must be a number.');
    }
    else if (isNaN(height) || height == ""){
      Alert.alert('Error', 'Height must be a number.');
    }
    else {
      const BMI = ((weight / (height * height)) * 703).toFixed(1);
      this.setState({ BMI, weight })
      this.onSave();
    }
    
  }

  render() {
    const { height, weight, BMI } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
          <TextInput
            style={styles.input}
            onChangeText={this.onWeightChange}
            value={weight}
            placeholder="Weight in Pounds"
          />
          <TextInput
            style={styles.input}
            onChangeText={this.onHeightChange}
            value={height}
            placeholder="Height in Inches"
          />
          <TouchableOpacity onPress={() => { this.onCalculate(); }} style={styles.button}>
            <Text style={styles.buttonText}>Compute BMI</Text>
          </TouchableOpacity>

          <Text style={styles.preview}>Body Mass Index is {BMI}</Text>

          <Text style={styles.text}>
            Assessing Your BMI
          </Text>
          <Text style={styles.textIndent}>
            Underweight: less than 18.5
          </Text>
          <Text style={styles.textIndent}>
            Healthy: 18.5 to 24.9
          </Text>
          <Text style={styles.textIndent}>
            Overweight: 25.0 to 29.9
          </Text>
          <Text style={styles.textIndent}>
            Obese: 30.0 or higher
          </Text>
        </ScrollView>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -50
  },
  content: {
    flex: 1,
    padding: 10,
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    height: 45,
    padding: 5,
    marginBottom: 10,
    flex: 1,
    fontSize: 24
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24
  },
  preview: {
    color: '#000',
    flex: 1,
    height: 80,
    fontSize: 28,
    marginTop: 60,
    marginBottom:30,
    textAlign: 'center'
  },
  text: {
    color: '#000',
    fontSize: 20,
  },
  textIndent: {
    color: '#000',
    fontSize: 20,
    marginLeft: 20,
  },
});