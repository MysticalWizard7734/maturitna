USE smart_data;

DELETE FROM esp;

INSERT INTO esp (ESP_ID) VALUES ('ESP_1234567890');
INSERT INTO esp (ESP_ID, esp_name) VALUES ('ESP_1234567891', 'esp_1');
INSERT INTO esp (ESP_ID, esp_name, number_of_LEDs) VALUES ('ESP_1234567892', 'esp_2', 20);
INSERT INTO esp (ESP_ID, esp_name, number_of_LEDs, module_type_ID) VALUES ('ESP_1234567893', 'esp_3', 30, 0);
INSERT INTO esp (ESP_ID, esp_name, number_of_LEDs, module_type_ID, room_id) VALUES ('ESP_1234567894', 'esp_4', 40, 1, 1);

/*source /home/mango/maturitna/databaza/generate_rows.sql;*/