#include "BluetoothSerial.h"
#include <Preferences.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define REL_PIN 15;
#define BUT_PIN 4;

int lastButtonState = LOW;  // Stores the previous state of the button
bool isDebounced = true;    // Flag for debouncing

unsigned long lastDebounceTime = 0; // To track the debounce interval
#define debounceDelay = 50; // Debounce delay in milliseconds

Preferences preferences;
BluetoothSerial SerialBT;
WiFiUDP udp;
WiFiClient espClient;
PubSubClient client(espClient);

String id = "";

unsigned int localUdpPort = 12345;  // Local port to listen on
char incomingPacket[255];           // Buffer for incoming packets
char replyPacket[] = "";            // Message to send

String ssid = "";
String password = "";
char modType[] = "1";  // 0 = RGB alebo 1 = REL

bool rel_state = true;

IPAddress serverIP(0, 0, 0, 0);

#include "setID.h"
#include "setWifi.h"
#include "connectWifi.h"
#include "findBroker.h"
#include "handleMessage.h"
#include "connectToBroker.h"

void setup() {
  Serial.begin(115200);

  delay(1000);

  pinMode(REL_PIN, OUTPUT);
  pinMode(BUT_PIN, INPUT_PULLUP);

  preferences.begin("saved_data", false);
  preferences.putString("ssid", "UPC42371CD");
  preferences.putString("password", "Wxfr2jpyzrWc");
  //preferences.putString("serverIP", "192.168.0.143");
  preferences.end();

  setID();

  strcpy(replyPacket, id.c_str());       // Copy id to replyPacket
  strcat(replyPacket, "-");  // Append modType to replyPacket
  strcat(replyPacket, modType);  // Append modType to replyPacket

  Serial.print("Nastaveny reply packet: ");
  Serial.println(replyPacket);

  setWifi();
  connectWifi();
  findBroker();
  connectToBroker();
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  int currentButtonState = digitalRead(buttonPin); // Read the current state of the button

  // Check if the button state has changed and debounce
  if (currentButtonState != lastButtonState) {
    lastDebounceTime = millis(); // Reset the debounce timer
    isDebounced = false;
  }

  // Debounce: check if enough time has passed
  if (!isDebounced && (millis() - lastDebounceTime > debounceDelay)) {
    isDebounced = true;

    // If the button state is different from the last state, call the function
    if (currentButtonState != lastButtonState) {
      lastButtonState = currentButtonState; // Update the last button state

      // Call the function only on state change
      if (currentButtonState == LOW) { // Button pressed (LOW due to pull-up)
        switchRelay();
      }
    }
  }
}