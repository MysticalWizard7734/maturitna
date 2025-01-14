String randomString(int length){
  const char characters[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  String randomString;

  for (int i = 0; i < length; ++i) {
    // Generate a random index in the range of the characters array
    int randomIndex = random(0, sizeof(characters) - 1);
    randomString += characters[randomIndex];
  }

  return randomString;
}

void setID(){
  // Preference s nazvom saved_data, read only - false
  preferences.begin("saved_data", false);

  id = preferences.getString("id", "");

  if (id == "") {
    Serial.print("Nacitany prazdny string, Generovanie noveho stringu: ");
    randomSeed(analogRead(23));
    id = "ESP_" + randomString(10);
    preferences.putString("id", id);

    Serial.println(id);
  }
  else{
    Serial.print("Nacitany string: ");
    Serial.println(id);
  }

  preferences.end();
}
