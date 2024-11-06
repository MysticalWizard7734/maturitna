void connectWifi() {

  Serial.println("Pripajanie na WiFi");
  WiFi.begin(ssid, password);


  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 18) {
    SerialBT.begin(id);
    SerialBT.println("connecting to WiFi, press enter to change ssid/password");
    attempts++;

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

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to WiFi!");
  } else {
    Serial.println("Failed to connect to WiFi. Retrying...");
    WiFi.disconnect();   // Disconnect the current attempt
    delay(2000);         // Wait for a short period before retrying
    connectWifi();       // Restart Wi-Fi connection attempt
  }

  SerialBT.end();
  Serial.println("WiFi Pripojene");
  Serial.println(WiFi.localIP());
}