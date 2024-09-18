use smart_data;

INSERT INTO esp (esp_name, module_type_ID, room_id) VALUES ();
INSERT INTO number_of_LEDs (number_of_LEDs) VALUES ()
WHERE esp.esp_id = number_of_LEDs.esp_id; 

select * from esp

SELECT esp.esp_id, esp.esp_name, number_of_LEDs.number_of_LEDs, esp.module_type_ID, esp.room_id 
FROM esp
LEFT JOIN number_of_LEDs ON esp.esp_id = number_of_LEDs.esp_id
WHERE esp.esp_id = 'ESP_1234567890';



INSERT INTO number_of_LEDs (esp_id, number_of_LEDs) VALUES (?, ?);

UPDATE number_of_LEDs
SET 
    number_of_LEDs = ?
WHERE esp_id = ?;

DELETE FROM number_of_LEDs
WHERE esp_id = ?;


    /*
    what data may look like
    {
      esp_id: 'ESP_1234567890',
      esp_name: '',
      number_of_LEDs: '',
      module_type_ID: '',
      room_id: '30'
    }
    */