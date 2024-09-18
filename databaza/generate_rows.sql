USE smart_data;

DELETE FROM esp;
DELETE FROM number_of_LEDs;

INSERT INTO esp (ESP_ID) VALUES ('ESP_1234567890');
INSERT INTO esp (ESP_ID, esp_name) VALUES ('ESP_1234567891', 'esp_1');
INSERT INTO esp (ESP_ID, esp_name, module_type_ID) VALUES ('ESP_1234567893', 'esp_3', 0);
INSERT INTO esp (ESP_ID, esp_name, module_type_ID) VALUES ('ESP_1234567894', 'esp_4', 1);
/*
INSERT INTO number_of_LEDs (esp_id, number_of_LEDs) VALUES ('ESP_1234567890', 30);
INSERT INTO number_of_LEDs (esp_id, number_of_LEDs) VALUES ('ESP_1234567891', 60);
*/
SELECT esp.esp_id, esp.esp_name, module_types.type_name, room_id, number_of_LEDs.number_of_LEDs, module_types.type_name
FROM esp
LEFT JOIN number_of_LEDs ON number_of_LEDs.esp_id = esp.esp_id
LEFT JOIN module_types ON module_types.module_type_ID = esp.module_type_ID;


/*source /home/mango/maturitna/databaza/generate_rows.sql;*/