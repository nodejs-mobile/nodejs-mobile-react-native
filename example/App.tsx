import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import nodejs from "nodejs-mobile-react-native";

import { useEvent } from "expo";
import { Button, ScrollView, Text, View } from "react-native";

let count = 0;

nodejs.start("main.js");
nodejs.channel.addListener("message", (message: string) => {
  console.log("Received message from NodeJS:", message);
});

export default function App() {
  const message = useEvent(nodejs.channel, "message");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Text style={styles.header}>NodeJS Mobile Example</Text>
          <Group name="Constants">
            <Text>Placeholder</Text>
          </Group>
          <Group name="Send Message">
            <Button
              title="Message NodeJS"
              onPress={async () => {
                nodejs.channel.send(`Hello from React Native! (${++count})`);
              }}
            />
          </Group>
          <Group name="Received Message">
            <Text>{message}</Text>
          </Group>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
};
