
\connect "digitalspine";

INSERT INTO "admin" ("admin_id", "username", "password", "active") VALUES
(1,	'admin1',	'geppetto',	't');

INSERT INTO "devices" ("user_id", "id", "name", "devicePassword", "type", "serial_number", "status", "firmware_version", "registration_date", "last_seen", "ip_address", "mac_address", "prov_key", "config", "isonline", "encryption_key", "auth_token", "notes", "created_at") VALUES
(21817,	14,	'Light',	'a906ede8527ea61e7c5e3c9e',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'00:11:22:33:40:00',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'2024-11-18 12:56:50.820769');

INSERT INTO "users" ("user_id", "username", "password", "created_at") VALUES
(21815,	'geppetto',	'geppetto',	'2024-11-14 15:37:57.32991'),
(21817,	'RoyV2',	'whatever',	'2024-11-14 17:58:52.414608');
