USE smart_data;

DELETE FROM number_of_LEDs;
DELETE FROM esp;
DELETE FROM rooms;

INSERT INTO rooms (room_id, room_name) VALUES (1, 'abcd');
INSERT INTO rooms (room_id, room_name) VALUES (2, 'efgh');
INSERT INTO rooms (room_id, room_name) VALUES (3, 'ijkl');

INSERT INTO esp (ESP_ID, esp_name, module_type_ID, room_id) VALUES ('ESP_0000000001', 'rgb1', 0, 1);
INSERT INTO esp (ESP_ID, esp_name, module_type_ID, room_id) VALUES ('ESP_0000000002', 'rgb2', 0, 1);
INSERT INTO esp (ESP_ID, esp_name, module_type_ID, room_id) VALUES ('ESP_0000000003', 'rel1', 1, 1);
INSERT INTO esp (ESP_ID, esp_name, module_type_ID, room_id) VALUES ('ESP_0000000004', 'rgb3', 0, 2);
INSERT INTO esp (ESP_ID, esp_name, module_type_ID, room_id) VALUES ('ESP_0000000005', 'rel2', 1, 3);

-- also have to create rows for the RGB esps
INSERT INTO number_of_LEDs (esp_id, number_of_LEDs) VALUES ('ESP_0000000001', 30);
INSERT INTO number_of_LEDs (esp_id, number_of_LEDs) VALUES ('ESP_0000000002', 60);
INSERT INTO number_of_LEDs (esp_id, number_of_LEDs) VALUES ('ESP_0000000004', 120);


SELECT esp.esp_id, esp.esp_name, module_types.type_name, room_id, number_of_LEDs.number_of_LEDs, module_types.type_name
FROM esp
LEFT JOIN number_of_LEDs ON number_of_LEDs.esp_id = esp.esp_id
LEFT JOIN module_types ON module_types.module_type_ID = esp.module_type_ID;


/*
source /home/mango/maturitna/databaza/script.sql;
source /home/mango/maturitna/databaza/generate_rows.sql;
*/