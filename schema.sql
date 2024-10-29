BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 5c4b7fcd5aa9

CREATE TABLE users (
    user_id SERIAL NOT NULL, 
    username VARCHAR, 
    password VARCHAR, 
    PRIMARY KEY (user_id)
);

CREATE INDEX ix_users_user_id ON users (user_id);

CREATE UNIQUE INDEX ix_users_username ON users (username);

CREATE TABLE devices (
    device_id SERIAL NOT NULL, 
    device_name VARCHAR, 
    rating INTEGER, 
    user_id INTEGER, 
    PRIMARY KEY (device_id), 
    FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE INDEX ix_devices_device_id ON devices (device_id);

INSERT INTO alembic_version (version_num) VALUES ('5c4b7fcd5aa9') RETURNING alembic_version.version_num;

COMMIT;

