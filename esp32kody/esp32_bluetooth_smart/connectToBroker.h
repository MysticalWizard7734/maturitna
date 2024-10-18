void handleMessage(byte* payload) {
  const size_t bufferSize = JSON_OBJECT_SIZE(3);
  StaticJsonDocument<bufferSize> doc;

  DeserializationError error = deserializeJson(doc, payload);

  if (error) {
    Serial.print("Error parsing JSON: ");
    Serial.println(error.c_str());
    return;
  }


  int R = doc["R"];
  int G = doc["G"];
  int B = doc["B"];

  for(int i = 0; i < NUM_LEDS; i++){
    leds[i] = CRGB(R, G, B);
    //delay(50);
  }

    FastLED.show();
}

void callback(char* topic, byte* payload, unsigned int lenght) {
  Serial.print("Message arrived: ");
  Serial.print(topic);

  String message = "";
  for (int i = 0; i < lenght; i++) {
      message += (char)payload[i];
    }
    Serial.println(message);

  if ((strcmp(topic, id.c_str()) == 0)) {
    handleMessage(payload);
  }
}

void reconnect() {
    Serial.println("Pripajanie na MQTT");
    if (client.connect(id.c_str())) {
      Serial.println("Pripojene na MQTT broker");
      client.subscribe(id.c_str());
    } else {
      Serial.print("Failed, rc=");
      Serial.println(client.state());
      delay(500);
      Serial.print(".");
      delay(500);
      Serial.print(".");
      delay(500);
      Serial.println(".");
    }
}

void connectToBroker(){
  Serial.println("Pripajanie na broker");
  Serial.print(serverIP);
  Serial.println(":1883");
  client.setServer(serverIP, 1883);
  client.setCallback(callback);
}