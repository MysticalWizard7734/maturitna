void findBroker() {
  preferences.begin("saved_data", false);

  serverIP.fromString(preferences.getString("serverIP", ""));

  if (serverIP == IPAddress(0, 0, 0, 0)) {
    udp.begin(localUdpPort);
    Serial.printf("Now listening at IP %s, UDP port %d\n", WiFi.localIP().toString().c_str(), localUdpPort);

    // Calculate broadcast address
    for (int i = 0; i < 4; i++) {
      broadcastIp[i] = (localIp[i] & subnetMask[i]) | ~subnetMask[i];
    }

    while (serverIP == IPAddress(0, 0, 0, 0)) {


      udp.beginPacket(IPAddress(192, 168, 0, 143), localUdpPort);
      //udp.beginPacket(IPAddress(255, 255, 255, 255), localUdpPort);
      udp.print(replyPacket);
      udp.endPacket();
      Serial.println("Broadcast message sent");

      int packetSize = udp.parsePacket();
      if (packetSize) {
        int len = udp.read(incomingPacket, 255);
        if (len > 0) {
          incomingPacket[len] = 0;
        }
        Serial.printf("Received packet of size %d from %s: %s\n", packetSize, udp.remoteIP().toString().c_str(), incomingPacket);

        // Store server IP address
        serverIP = udp.remoteIP();
        preferences.putString("serverIP", serverIP.toString());

        // Add any further logic here, such as stopping the loop after finding the server
      }
      delay(3250);
    }
  }

  Serial.print("Server found at: ");
  Serial.println(serverIP);

  preferences.end();
}