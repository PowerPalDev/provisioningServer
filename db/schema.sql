-- Adminer 4.8.4-dev PostgreSQL 17.0 dump

\connect "digitalspine";

CREATE SEQUENCE admin_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."admin" (
    "admin_id" integer DEFAULT nextval('admin_id_seq') NOT NULL,
    "username" character varying NOT NULL,
    "password" character varying NOT NULL,
    "active" boolean NOT NULL
) WITH (oids = false);

COMMENT ON TABLE "public"."admin" IS 'this table is used to manage the user able to login to the panel / use the api';

COMMENT ON COLUMN "public"."admin"."password" IS 'for the moment a sha1 hash, later we might use something better';


CREATE SEQUENCE devices_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

CREATE TABLE "public"."devices" (
    "user_id" integer,
    "id" integer DEFAULT nextval('devices_id_seq') NOT NULL,
    "name" character varying,
    "devicePassword" character varying,
    "type" character varying,
    "serial_number" character varying,
    "status" integer,
    "firmware_version" character varying,
    "registration_date" date,
    "last_seen" time without time zone,
    "ip_address" inet,
    "mac_address" character(17),
    "prov_key" integer,
    "config" json,
    "isonline" boolean,
    "encryption_key" character varying,
    "auth_token" character varying,
    "notes" character varying,
    "created_at" timestamp,
    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE users_user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "user_id" integer DEFAULT nextval('users_user_id_seq') NOT NULL,
    "username" character varying,
    "password" character varying,
    "created_at" timestamp,
    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "users_username_key" UNIQUE ("username")
) WITH (oids = false);


-- 2024-11-18 13:23:33.568973+00
