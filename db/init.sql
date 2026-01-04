CREATE TYPE assignment_status AS ENUM ('To Do', 'Doing', 'Done');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completetion_status ASSIGNMENT_STATUS,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT REFERENCES users(id)
);

