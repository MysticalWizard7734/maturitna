USE smart_data;

DELETE FROM number_of_LEDs;
DELETE FROM esp;

INSERT INTO esp (ESP_ID, module_type_ID) VALUES ('ESP_1234567890', 0);
INSERT INTO esp (ESP_ID, module_type_ID) VALUES ('ESP_1234567891', 1);
INSERT INTO esp (ESP_ID, module_type_ID) VALUES ('ESP_1234567893', 0);
INSERT INTO esp (ESP_ID, module_type_ID) VALUES ('ESP_1234567894', 1);

-- also have to create rows for the RGB esps
INSERT INTO number_of_LEDs (esp_id) VALUES ('ESP_1234567890');
INSERT INTO number_of_LEDs (esp_id) VALUES ('ESP_1234567893');

SELECT esp.esp_id, esp.esp_name, module_types.type_name, room_id, number_of_LEDs.number_of_LEDs, module_types.type_name
FROM esp
LEFT JOIN number_of_LEDs ON number_of_LEDs.esp_id = esp.esp_id
LEFT JOIN module_types ON module_types.module_type_ID = esp.module_type_ID;


/*
source /home/mango/maturitna/databaza/generate_rows.sql;
*/