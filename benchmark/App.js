import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import nodejs from "nodejs-mobile-react-native";
import { faker } from "@faker-js/faker";

const MSG_COUNT = 1000;
const fixtureStart = Date.now();
faker.seed("nodejs-mobile-test-messages");
const MESSAGE_FIXTURES = Array.from({ length: MSG_COUNT }, createRandomUser);
const fixtureTime = Date.now() - fixtureStart;

export default function App() {
  const [output, setOutput] = React.useState("");
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    nodejs.start("main.js");
    if (!timerRef.current) {
      timerRef.current = Date.now();
    }
    const subscription = nodejs.channel.addListener(
      "message",
      (msg) => {
        if (msg === "initialized") {
          const elapsed = Date.now() - timerRef.current;
          timerRef.current = Date.now();
          setOutput(`Node.js initialized in ${elapsed} ms`);
        } else if (msg.id === MSG_COUNT) {
          setOutput(
            (prev) =>
              `${prev}\nReceived ${msg.id} messages in ${
                Date.now() - timerRef.current
              } ms`
          );
        }
      },
      this
    );
    timerRef.current = Date.now();
    for (const msg of MESSAGE_FIXTURES) {
      nodejs.channel.send(msg);
    }
    return () => {
      subscription.remove();
      timerRef.current = 0;
      setOutput("");
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Fixture generation took {fixtureTime} ms</Text>
      <Text>{output}</Text>
      <Button
        title="Message Node"
        onPress={() => nodejs.channel.send("A message!")}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

function createRandomUser(_, i) {
  return {
    id: i + 1,
    uuid: faker.string.uuid(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    sex: faker.person.sexType(),
    subscriptionTier: faker.helpers.arrayElement(["free", "basic", "business"]),
  };
}
