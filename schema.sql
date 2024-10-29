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

-- Running upgrade 5c4b7fcd5aa9 -> ec740acfff74

ALTER TABLE devices ADD COLUMN id INTEGER NOT NULL;

ALTER TABLE devices ADD COLUMN name VARCHAR;

ALTER TABLE devices ADD COLUMN type VARCHAR;

ALTER TABLE devices ADD COLUMN serial_number VARCHAR;

ALTER TABLE devices ADD COLUMN status INTEGER;

ALTER TABLE devices ADD COLUMN firmware_version VARCHAR;

ALTER TABLE devices ADD COLUMN registration_date DATE;

ALTER TABLE devices ADD COLUMN last_seen TIME WITHOUT TIME ZONE;

ALTER TABLE devices ADD COLUMN ip_address INET;

ALTER TABLE devices ADD COLUMN mac_address CHAR(17);

ALTER TABLE devices ADD COLUMN prov_key INTEGER;

ALTER TABLE devices ADD COLUMN config JSON;

ALTER TABLE devices ADD COLUMN isonline BOOLEAN;

ALTER TABLE devices ADD COLUMN encryption_key VARCHAR;

ALTER TABLE devices ADD COLUMN auth_token VARCHAR;

ALTER TABLE devices ADD COLUMN notes VARCHAR;

ALTER TABLE devices ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE;

DROP INDEX ix_devices_device_id;

ALTER TABLE devices ADD UNIQUE (prov_key);

ALTER TABLE devices DROP COLUMN device_name;

ALTER TABLE devices DROP COLUMN rating;

ALTER TABLE devices DROP COLUMN device_id;

ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE;

DROP INDEX ix_users_user_id;

DROP INDEX ix_users_username;

ALTER TABLE users ADD UNIQUE (username);

UPDATE alembic_version SET version_num='ec740acfff74' WHERE alembic_version.version_num = '5c4b7fcd5aa9';

COMMIT;

