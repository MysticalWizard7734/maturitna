void setWifi() {

  preferences.begin("saved_data", false);

  ssid = preferences.getString("ssid", "");
  password = preferences.getString("password", "");

  if (ssid == "" || password == "") {
    SerialBT.begin(id);  //Bluetooth device name

    while (!SerialBT.available()) {
      SerialBT.println("Input SSID");
      delay(5000);
    }
    ssid = SerialBT.readStringUntil('\n');
    ssid.trim();
    Serial.println(ssid);
    preferences.putString("ssid", ssid);
    SerialBT.println("SSID stored successfully");


    while (!SerialBT.available()) {
      SerialBT.println("Input password");
      delay(5000);
    }
    password = SerialBT.readStringUntil('\n');
    password.trim();
    Serial.println(password);
    preferences.putString("password", password);
    SerialBT.println("Password stored successfully");
  } else {
    Serial.println(ssid);
    Serial.println(password);
    Serial.println("wifi pripravene");
  }

  SerialBT.end();
  preferences.end();
}