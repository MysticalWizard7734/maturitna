#include "BluetoothSerial.h"
#include <Preferences.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <PubSubClient.h>
#include <FastLED.h>
#include <ArduinoJson.h>

#define LED_PIN 4
#define NUM_LEDS 1000

CRGB leds[NUM_LEDS];

Preferences preferences;
BluetoothSerial SerialBT;
WiFiUDP udp;
WiFiClient espClient;
PubSubClient client(espClient);

String id = "";

unsigned int localUdpPort = 12345;  // Local port to listen on
char incomingPacket[255];  // Buffer for incoming packets
String replyPacket = "";  // Message to send

String ssid = "";
String password = "";

IPAddress serverIP(0,0,0,0);

#include "setID.h"
#include "setWifi.h"
#include "connectWifi.h"
#include "findBroker.h"
#include "connectToBroker.h"

void setup() {
  Serial.begin(115200);

  setID();

  replyPacket = id;  // Message to send
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
}