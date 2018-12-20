import React from "react";
import { StyleSheet, Text, View, TextInput, AsyncStorage } from "react-native";
import { Permissions, Notifications } from "expo";

export default class Notifier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      notification: {}
    };

    this.load();
  }

  async load() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      console.log(finalStatus);
      return;
    }

    console.log(finalStatus);
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    console.log(token);
    this.setState({ token });
  }

  componentWillUnmount() {}

  componentDidMount() {
    //Здесь нужно регистрироваться
    //registerForPushNotificationsAsync();

    this._notificationSubscription = Notifications.addListener(
      this.notificationHandler
    );
  }

  notificationHandler = notification => {
    this.setState({ notification });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput value={`${this.state.token}`} style={{ fontSize: 16 }} />
        <Text>{`Origin: ${this.state.notification.origin}`}</Text>
        <Text>{`Data: ${
          this.state.notification.data
            ? this.state.notification.data.name
            : "Empty"
        }`}</Text>
      </View>
    );
  }
}
