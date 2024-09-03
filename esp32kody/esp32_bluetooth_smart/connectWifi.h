void connectWifi() {

  Serial.println("Pripajanie na WiFi");
  WiFi.begin(ssid, password);



  while (WiFi.status() != WL_CONNECTED) {
    SerialBT.begin(id);
    SerialBT.println("connecting to WiFi, press enter to change ssid/password");


    if (SerialBT.available()) {
      // Read input from Bluetooth terminal
      String message = SerialBT.readStringUntil('\n');

      
      preferences.begin("saved_data", false);
      preferences.putString("ssid", "");
      preferences.putString("password", "");
      preferences.putString("serverIP", "");

      ESP.restart();

    }

    Serial.print(".");

    delay(333);
  }
  SerialBT.end();
  Serial.println("WiFi Pripojene");
  Serial.println(WiFi.localIP());
}