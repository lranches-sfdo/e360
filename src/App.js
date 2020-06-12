/*
 * Copyright (c) 2017-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  Alert,
  StatusBar,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { createStackNavigator } from "react-navigation";
import { net } from "react-native-force";

console.disableYellowBox = true;

const image = require("../bg-image.png");

class AppScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentScore: 0,
      currentSteps: 0,
      steps: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    net.query("SELECT Id,Score__c,Steps__c FROM Health__c", (response) => {
      this.setState({
        currentScore: response.records[0].Score__c,
        currentSteps: response.records[0].Steps__c,
      });
    });
  };

  onChangeInput = (input) => {
    this.setState({ steps: input });
  };

  onPress = async () => {
    if (!this.state.steps) {
      Alert.alert(
        "Error",
        "Please Enter number of steps.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );

      return;
    }

    this.setState({ loading: true });

    const newSteps =
      parseInt(this.state.currentSteps) + parseInt(this.state.steps);

    const fields = {
      Steps__c: newSteps,
    };
    net.upsert("Health__c", "Id", "a0963000005HgzIAAS", fields, (_, error) => {
      if (error) {
        Alert.alert(
          "Error",
          error,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        return;
      }

      this.fetchData();

      this.setState({
        loading: false,
        steps: null,
      });

      Keyboard.dismiss();
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.loading}
          overlayColor={"rgba(0, 0, 0, 0.8)"}
        />
        <ImageBackground source={image} style={styles.image}>
          <View style={styles.headerContainer}>
            <Text style={styles.greeting}>Fitness 360</Text>
          </View>
          <View style={styles.selectionContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number of steps..."
              textAlign="center"
              onChangeText={(text) => this.onChangeInput(text)}
              value={this.state.steps}
            />
            <View style={{ paddingTop: 6 }}>
              <TouchableOpacity style={styles.button} onPress={this.onPress}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Enter</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#253845",
              position: "absolute",
              height: 70,
              width: "100%",
              height: "100%",
              top: "59.2%",
            }}
          >
            <View style={{ paddingTop: 16, alignItems: "center" }}>
              <Text
                style={{ fontSize: 28, fontWeight: "bold", color: "white" }}
              >
                Total Steps:
              </Text>
              <Text style={{ fontSize: 26, color: "white" }}>
                {this.state.currentSteps}
              </Text>
              <Text
                style={{
                  paddingTop: 24,
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Score:
              </Text>
              <Text style={{ fontSize: 26, color: "white" }}>
                {this.state.currentScore} / 5
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  headerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  selectionContainer: {
    flex: 2,
    width: "100%",
    paddingLeft: 80,
    paddingRight: 80,
    paddingTop: 167,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  greeting: {
    fontSize: 40,
    color: "#FFF",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#23a1e0",
    padding: 8,
    borderWidth: 0,
    borderRadius: 10,
  },
});

export const App = createStackNavigator({
  Main: {
    screen: AppScreen,
  },
});
