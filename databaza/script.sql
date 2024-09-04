DROP DATABASE IF EXISTS smart_data;
CREATE DATABASE smart_data;

USE smart_data;

DROP TABLE IF EXISTS module_types, rooms, esp;

CREATE TABLE module_types (
    module_type_ID bit PRIMARY KEY,
    type_name char(3)
);

INSERT INTO module_types VALUES (0, 'RGB');

INSERT INTO module_types VALUES (1, 'REL');

CREATE TABLE rooms (
    room_id int PRIMARY KEY AUTO_INCREMENT,
    room_name varchar(50)
);

INSERT INTO rooms () VALUES ();
INSERT INTO rooms () VALUES ();
INSERT INTO rooms () VALUES ();

CREATE TABLE esp (
    ESP_ID char(14) PRIMARY KEY,
    esp_name varchar(20),
    number_of_LEDs int,
    module_type_ID bit,
        FOREIGN KEY (module_type_ID) REFERENCES module_types(module_type_ID),
    room_id int,
        FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);