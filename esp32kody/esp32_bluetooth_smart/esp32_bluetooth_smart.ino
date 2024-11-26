#include "BluetoothSerial.h"
#include <Preferences.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <PubSubClient.h>
#include <FastLED.h>
#include <ArduinoJson.h>

#define LED_PIN 4

CRGB *leds = nullptr;

Preferences preferences;
BluetoothSerial SerialBT;
WiFiUDP udp;
WiFiClient espClient;
PubSubClient client(espClient);

String id = "";

int LED_delay;
int LED_method;
int number_of_LEDs;
int single_led_delay;

unsigned int localUdpPort = 12345;  // Local port to listen on
char incomingPacket[255];           // Buffer for incoming packets
char replyPacket[] = "";            // Message to send

String ssid = "";
String password = "";
char modType[] = "0";  // 0 = RGB alebo 1 = REL

IPAddress serverIP(0, 0, 0, 0);

#include "setID.h"
#include "setWifi.h"
#include "connectWifi.h"
#include "findBroker.h"
#include "handleMessage.h"
#include "connectToBroker.h"

void setup() {
  Serial.begin(115200);

  preferences.begin("saved_data", false);
  preferences.putString("ssid", "UPC42371CD");
  preferences.putString("password", "Wxfr2jpyzrWc");
  //preferences.putString("serverIP", "192.168.0.143");

  LED_delay = preferences.getInt("LED_delay", 0);
  LED_method = preferences.getInt("LED_method", 0);
  number_of_LEDs = preferences.getInt("number_of_LEDs", 0);
  single_led_delay = preferences.getInt("single_led_delay", 0);
  preferences.end();

  Serial.println(LED_delay);
  Serial.println(LED_method);
  Serial.println(number_of_LEDs);
  Serial.println(single_led_delay);

  if(number_of_LEDs != 0){
    single_led_delay = LED_delay / number_of_LEDs;
  }
  else single_led_delay = 0;

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

  setNumberOfLEDs();
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();
}