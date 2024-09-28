DROP DATABASE IF EXISTS smart_data;
CREATE DATABASE smart_data;

USE smart_data;

DROP TABLE IF EXISTS module_types, rooms, esp, number_of_LEDs;

CREATE TABLE module_types (
    module_type_ID int PRIMARY KEY,
    type_name char(3)
);

INSERT INTO module_types VALUES (0, 'RGB');

INSERT INTO module_types VALUES (1, 'REL');

CREATE TABLE rooms (
    room_id int PRIMARY KEY AUTO_INCREMENT,
    room_name varchar(50)
);

CREATE TABLE esp (
    esp_id char(14) PRIMARY KEY,
    esp_name varchar(20),
    module_type_ID int IS NOT NULL,
        FOREIGN KEY (module_type_ID) REFERENCES module_types(module_type_ID),
    room_id int,
        FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL
);

CREATE TABLE number_of_LEDs(
    esp_id char(14) PRIMARY KEY,
        FOREIGN KEY (esp_id) REFERENCES esp(esp_id),
    number_of_LEDs int
);

--TODO
--WHEN NEW ESP WITH RGB TYPE IS CONNECTED GENERATE A ROW IN number_of_LEDs row