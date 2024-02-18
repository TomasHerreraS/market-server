CREATE TABLE ROL (
    rol_id SERIAL PRIMARY KEY,
    name VARCHAR(25)
)

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
	name VARCHAR(25),
	lastname VARCHAR(25),
	phone VARCHAR(14),
	state VARCHAR(25),
	city VARCHAR(50),
	address VARCHAR(100),
	email VARCHAR(100),
	token VARCHAR(150),
	password VARCHAR(150),
    rol_id INT,
    FOREIGN KEY (rol_id) REFERENCES rol(rol_id)
);

CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    release_date DATE,
    quantity INT,
    description VARCHAR(300),
    discount DECIMAL(3,1),
    price DECIMAL(6,2),
    favorite BOOLEAN,
    image BYTEA,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

-- Insertar el rol 'Admin' con rol_id 1
INSERT INTO rol (rol_id, name) VALUES (1, 'Administrator');

-- Insertar el rol 'Client' con rol_id 2
INSERT INTO rol (rol_id, name) VALUES (2, 'Client');

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO superuser;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO superuser;