//todo make this function do what it should, you know what i mean :/
void switchRelay(){
  Serial.println("Switching the output");
  digitalWrite(REL_PIN, rel_state ? HIGH : LOW);
  rel_state = !rel_state;
};