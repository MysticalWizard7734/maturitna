DROP DATABASE IF EXISTS smart_data;
CREATE DATABASE smart_data;

USE smart_data;

DROP TABLE IF EXISTS number_of_LEDs, esp, rooms, module_types, led_methods;

CREATE TABLE module_types (
    module_type_ID int PRIMARY KEY,
    type_name char(3)
);

INSERT INTO module_types VALUES (0, 'RGB');

INSERT INTO module_types VALUES (1, 'REL');

CREATE TABLE led_methods (
    method_id int PRIMARY KEY AUTO_INCREMENT,
    method_name varchar(50)
);

INSERT INTO led_methods (method_name) VALUES ("none");
INSERT INTO led_methods (method_name) VALUES ("left to right");
INSERT INTO led_methods (method_name) VALUES ("right to left");
INSERT INTO led_methods (method_name) VALUES ("edge to center");
INSERT INTO led_methods (method_name) VALUES ("center to edge");
INSERT INTO led_methods (method_name) VALUES ("bright up");

CREATE TABLE rooms (
    room_id int PRIMARY KEY,
    room_name varchar(50),
    LED_delay int DEFAULT 0,
    LED_method int DEFAULT 1,
        FOREIGN KEY (LED_method) REFERENCES led_methods(method_id)
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