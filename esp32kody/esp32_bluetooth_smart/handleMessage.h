void setParameters(int LED_delay, int LED_method, int number_of_LEDs){
  preferences.putInt("LED_delay", LED_delay);
  preferences.putInt("LED_method", LED_method);
  preferences.putInt("number_of_LEDs", number_of_LEDs);
  single_led_delay = LED_delay / number_of_LEDs;

  Serial.print("LED_delay: ");
  Serial.println(LED_delay);

  Serial.print("LED_method: ");
  Serial.println(LED_method);

  Serial.print("number_of_LEDs: ");
  Serial.println(number_of_LEDs);
}

void setColor(int r, int g, int b){
  for(int i = 0; i < number_of_LEDs; i++){
    leds[i] = CRGB(r, g, b);
    delay(single_led_delay);
    Serial.println(i);
  }
  //todo make other LED_methods
  FastLED.show();
  Serial.println("turned on leds");
}