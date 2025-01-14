void handleMessage(byte* payload) {
  switchRelay();
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