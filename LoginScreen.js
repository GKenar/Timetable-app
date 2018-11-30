import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Header, Text, Button, SocialIcon } from "react-native-elements";
import { createStackNavigator } from "react-navigation";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      userPassword: ""
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={
            <Text h2 style={{ color: "white" }}>
              Login
            </Text>
          }
        />
        <View style={styles.loginForm}>
          <Text h3 style={{ marginBottom: 30 }}>Timetable App</Text>
          <Input
            placeholder="Name"
            shake={true}
            leftIcon={<Icon name="user" type={"simple-line-icon"} size={32} />}
          />
          <Input
            placeholder="Password"
            shake={true}
            inputContainerStyle={{ marginBottom: 30 }}
            leftIcon={<Icon name="lock" type={"simple-line-icon"} size={32} />}
          />
          <Button
            title="Sign in"
            titleStyle={{ fontWeight: "700", fontSize: 24 }}
            buttonStyle={{
              backgroundColor: "rgba(92, 99,216, 1)",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5
            }}
            containerStyle={{ marginTop: 20 }}
          />
        </View>
        <View style={styles.oauthForm}>
          <Text h4>or login with...</Text>
          <View flexDirection="row">
            <SocialIcon
              type="facebook"
              onPress={() => console.log("facebook pressed")}
            />
            <SocialIcon type="twitter" />
            <SocialIcon type="steam" />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "stretch",
    justifyContent: "space-between"
  },
  loginForm: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "space-around"
  },
  oauthForm: {
    flex: 0.2,
    alignItems: "center"
  }
});
