void handleMessage(byte* payload) {
  const size_t bufferSize = JSON_OBJECT_SIZE(3);
  StaticJsonDocument<bufferSize> doc;

  DeserializationError error = deserializeJson(doc, payload);

  if (error) {
    Serial.print("Error parsing JSON: ");
    Serial.println(error.c_str());
    return;
  }


  // Check if the packet contains the keys for LED control
  if (doc.containsKey("LED_delay") && doc.containsKey("LED_method") && doc.containsKey("number_of_LEDs")) {
    if(doc["LED_delay"] != -1) LED_delay = doc["LED_delay"];
    if(doc["LED_method"] != -1) LED_method = doc["LED_method"];
    if(doc["number_of_LEDs"] != -1) { 
      number_of_LEDs = doc["number_of_LEDs"];
      setNumberOfLEDs();
    }
    setParameters(LED_delay, LED_method, number_of_LEDs);
  }
  else if (doc.containsKey("r") && doc.containsKey("g") && doc.containsKey("b")) {
    int r = doc["r"];
    int g = doc["g"];
    int b = doc["b"];
    setColor(r, g, b);
  }
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