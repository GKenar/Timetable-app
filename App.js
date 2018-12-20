import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import GroupsScreen from "./GroupsScreen";
import GroupDetailsScreen from "./GroupDetailsScreen";
import LoginScreen from "./LoginScreen";
import Notifier from "./Notifier";

const RootNavigator = createStackNavigator(
  {
    GroupsScreen: {
      screen: GroupsScreen
    },
    GroupDetailsScreen: {
      screen: GroupDetailsScreen
    }
  },
  {
    initialRouteName: "GroupsScreen",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#006AFF"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center" //?
      }
    }
  }
);

export default class App extends React.Component {
  render() {
    //return <RootNavigator />;
    //return <LoginScreen />;
    return <Notifier />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
