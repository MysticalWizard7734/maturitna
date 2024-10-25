DROP DATABASE IF EXISTS smart_data;
CREATE DATABASE smart_data;

USE smart_data;

DROP TABLE IF EXISTS number_of_LEDs, esp, rooms, module_types;

CREATE TABLE module_types (
    module_type_ID int PRIMARY KEY,
    type_name char(3)
);

INSERT INTO module_types VALUES (0, 'RGB');

INSERT INTO module_types VALUES (1, 'REL');

CREATE TABLE rooms (
    room_id int PRIMARY KEY,
    room_name varchar(50)
);

CREATE TABLE esp (
    esp_id char(14) PRIMARY KEY,
    esp_name varchar(20),
    isActive TINYINT(1) DEFAULT 1,
    module_type_ID int NOT NULL,
        FOREIGN KEY (module_type_ID) REFERENCES module_types(module_type_ID),
    room_id int,
        FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL
);

CREATE TABLE number_of_LEDs(
    esp_id char(14) PRIMARY KEY,
        FOREIGN KEY (esp_id) REFERENCES esp(esp_id) ON DELETE CASCADE,
    number_of_LEDs int
);