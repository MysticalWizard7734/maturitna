void setParameters(int LED_delay, int LED_method, int number_of_LEDs) {
  preferences.begin("saved_data", false);
  preferences.putInt("LED_delay", LED_delay);
  preferences.putInt("LED_method", LED_method);
  preferences.putInt("number_of_LEDs", number_of_LEDs);
  if (number_of_LEDs != 0) single_led_delay = LED_delay / number_of_LEDs;
  preferences.putInt("single_led_delay", single_led_delay);
  preferences.end();

  Serial.print("LED_delay: ");
  Serial.println(LED_delay);

  Serial.print("LED_method: ");
  Serial.println(LED_method);

  Serial.print("number_of_LEDs: ");
  Serial.println(number_of_LEDs);
}

void setColor(int r, int g, int b) {
  Serial.println(LED_method);
  switch (LED_method) {
    case 1:
      for (int i = 0; i < number_of_LEDs; i++) {
        leds[i] = CRGB(r, g, b);
      }
      FastLED.show();
      break;
    case 2:
      for (int i = 0; i < number_of_LEDs; i++) {
        leds[i] = CRGB(r, g, b);
        delay(single_led_delay);
        FastLED.show();
      }
      break;
    case 3:
      for (int i = number_of_LEDs; i >= 0; i--) {
        leds[i] = CRGB(r, g, b);
        delay(single_led_delay);
        FastLED.show();
      }
      break;
    case 4:
      for (int i = number_of_LEDs / 2; i > 0; i--) {
        leds[i - 1] = CRGB(r, g, b);
        leds[i] = CRGB(r, g, b);
        leds[number_of_LEDs - i] = CRGB(r, g, b);
        FastLED.show();
        delay(single_led_delay * 2);
        Serial.print("Turned on leds ");
        Serial.print(i);
        Serial.print(" - ");
        Serial.println(number_of_LEDs - i);
      }
      break;
    case 5:
      for (int i = number_of_LEDs; i > 0; i--) {
        leds[i] = CRGB(r, g, b);
        leds[number_of_LEDs - i] = CRGB(r, g, b);
        FastLED.show();
        delay(single_led_delay * 2);
        Serial.print("Turned on leds ");
        Serial.print(i);
        Serial.print(" - ");
        Serial.println(number_of_LEDs - i);
      }
      break;
    case 6:
      long double_single_led_delay = (LED_delay - (number_of_LEDs * 7.8)) / 255 * 1000;
      for (int i = 0; i <= 255; i++) {
        for (int j = 0; j < number_of_LEDs; j++) {
          leds[j] = CRGB((r * i) / 255, (g * i) / 255, (b * i) / 255);
        }
        if (delayMicroseconds > 0) {
          delayMicroseconds(double_single_led_delay);
        }
        FastLED.show();
      }
      break;
  }
  Serial.println("turned on leds");
}

void setNumberOfLEDs() {
  if (leds != nullptr) {
    free(leds);
    Serial.println("leds pointer freed");
  }
  Serial.println("setting new led value: " + number_of_LEDs);
  Serial.println(number_of_LEDs);
  if (number_of_LEDs != 0) {
    leds = (CRGB*)malloc(number_of_LEDs * sizeof(CRGB));
    if (number_of_LEDs != 0 && leds == nullptr) {
      Serial.println("Memory allocation failed!");
      while (1)
        ;  // Stop if allocation fails
    }
    FastLED.addLeds<WS2812, LED_PIN, GRB>(leds, number_of_LEDs);
    Serial.print("leds have been setup");
  } else Serial.println("Can not allocate 0 bytes of memory");
}