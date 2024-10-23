--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: backend; Type: SCHEMA; Schema: -; Owner: digitalspine
--

CREATE SCHEMA backend;


ALTER SCHEMA backend OWNER TO digitalspine;

--
-- Name: applianceType; Type: TYPE; Schema: backend; Owner: digitalspine
--

CREATE TYPE backend."applianceType" AS ENUM (
    'Computer',
    'Lighting',
    'Entertainment',
    'Heating and cooling',
    'Refrigeration',
    'Laundry and cleaning',
    'Cooking',
    'Pool and garden',
    'Electric vehicle',
    'Ventilation',
    'Water heater',
    'Other',
    'Roller'
);


ALTER TYPE backend."applianceType" OWNER TO digitalspine;

--
-- Name: deviceType; Type: TYPE; Schema: backend; Owner: digitalspine
--

CREATE TYPE backend."deviceType" AS ENUM (
    'smartPlug',
    'switch'
);


ALTER TYPE backend."deviceType" OWNER TO digitalspine;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: backend; Owner: digitalspine
--

CREATE SEQUENCE backend.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE backend.user_id_seq OWNER TO digitalspine;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: backend; Owner: digitalspine
--

CREATE TABLE backend.account (
    id integer DEFAULT nextval('backend.user_id_seq'::regclass) NOT NULL,
    name character(255) NOT NULL,
    password character(255) NOT NULL,
    "devicePassword" character(255) NOT NULL
);


ALTER TABLE backend.account OWNER TO digitalspine;

--
-- Name: COLUMN account.password; Type: COMMENT; Schema: backend; Owner: digitalspine
--

COMMENT ON COLUMN backend.account.password IS 'this is the password the user chooses to login in the web panel etc, is hashed salt and peppered etc';


--
-- Name: COLUMN account."devicePassword"; Type: COMMENT; Schema: backend; Owner: digitalspine
--

COMMENT ON COLUMN backend.account."devicePassword" IS 'this is the one we send to the device to login, for now we store in clear, later will be encrypted (not hashed)';


--
-- Name: admin; Type: TABLE; Schema: backend; Owner: digitalspine
--

CREATE TABLE backend.admin (
    id integer NOT NULL,
    name integer NOT NULL,
    password character(255) NOT NULL,
    active boolean NOT NULL
);


ALTER TABLE backend.admin OWNER TO digitalspine;

--
-- Name: TABLE admin; Type: COMMENT; Schema: backend; Owner: digitalspine
--

COMMENT ON TABLE backend.admin IS 'this table is used to manage the user able to login to the panel / use the api';


--
-- Name: COLUMN admin.password; Type: COMMENT; Schema: backend; Owner: digitalspine
--

COMMENT ON COLUMN backend.admin.password IS 'for the moment a sha1 hash, later we might use something better';


--
-- Name: admin_id_seq; Type: SEQUENCE; Schema: backend; Owner: digitalspine
--

CREATE SEQUENCE backend.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE backend.admin_id_seq OWNER TO digitalspine;

--
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: backend; Owner: digitalspine
--

ALTER SEQUENCE backend.admin_id_seq OWNED BY backend.admin.id;


--
-- Name: appliance_id_seq; Type: SEQUENCE; Schema: backend; Owner: digitalspine
--

CREATE SEQUENCE backend.appliance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE backend.appliance_id_seq OWNER TO digitalspine;

--
-- Name: appliance; Type: TABLE; Schema: backend; Owner: digitalspine
--

CREATE TABLE backend.appliance (
    id integer DEFAULT nextval('backend.appliance_id_seq'::regclass) NOT NULL,
    "accountId" integer NOT NULL,
    serial character(255) NOT NULL,
    name character(1024) NOT NULL,
    "deviceType" backend."deviceType" NOT NULL,
    "applianceType" backend."applianceType" NOT NULL,
    "lastIp" character(255),
    simulate boolean DEFAULT false,
    alreadymetered boolean DEFAULT true,
    lastupdate integer NOT NULL,
    notes text
);


ALTER TABLE backend.appliance OWNER TO digitalspine;

--
-- Name: smartPlug; Type: TABLE; Schema: backend; Owner: digitalspine
--

CREATE TABLE backend."smartPlug" (
    "applianceId" integer NOT NULL,
    "maxPower" real DEFAULT '0'::real NOT NULL,
    "minPower" real DEFAULT '0'::real NOT NULL
);


ALTER TABLE backend."smartPlug" OWNER TO digitalspine;

--
-- Name: COLUMN "smartPlug"."maxPower"; Type: COMMENT; Schema: backend; Owner: digitalspine
--

COMMENT ON COLUMN backend."smartPlug"."maxPower" IS 'used for sim';


--
-- Name: COLUMN "smartPlug"."minPower"; Type: COMMENT; Schema: backend; Owner: digitalspine
--

COMMENT ON COLUMN backend."smartPlug"."minPower" IS 'used for sim';


--
-- Name: smartplugview; Type: VIEW; Schema: backend; Owner: digitalspine
--

CREATE VIEW backend.smartplugview AS
 SELECT a.id,
    a."accountId",
    a.serial,
    a.name,
    a."deviceType",
    a."applianceType",
    a."lastIp",
    a.simulate,
    a.alreadymetered,
    a.lastupdate,
    a.notes,
    s."maxPower",
    s."minPower"
   FROM (backend.appliance a
     JOIN backend."smartPlug" s ON ((s."applianceId" = a.id)));


ALTER VIEW backend.smartplugview OWNER TO digitalspine;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: digitalspine
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO digitalspine;

--
-- Name: admin id; Type: DEFAULT; Schema: backend; Owner: digitalspine
--

ALTER TABLE ONLY backend.admin ALTER COLUMN id SET DEFAULT nextval('backend.admin_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: backend; Owner: digitalspine
--

COPY backend.account (id, name, password, "devicePassword") FROM stdin;
\.


--
-- Data for Name: admin; Type: TABLE DATA; Schema: backend; Owner: digitalspine
--

COPY backend.admin (id, name, password, active) FROM stdin;
\.


--
-- Data for Name: appliance; Type: TABLE DATA; Schema: backend; Owner: digitalspine
--

COPY backend.appliance (id, "accountId", serial, name, "deviceType", "applianceType", "lastIp", simulate, alreadymetered, lastupdate, notes) FROM stdin;
1	1	123                                                                                                                                                                                                                                                            	smart plug 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    	smartPlug	Cooking	\N	f	t	0	\N
\.


--
-- Data for Name: smartPlug; Type: TABLE DATA; Schema: backend; Owner: digitalspine
--

COPY backend."smartPlug" ("applianceId", "maxPower", "minPower") FROM stdin;
1	0	0
\.


--
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: backend; Owner: digitalspine
--

SELECT pg_catalog.setval('backend.admin_id_seq', 1, false);


--
-- Name: appliance_id_seq; Type: SEQUENCE SET; Schema: backend; Owner: digitalspine
--

SELECT pg_catalog.setval('backend.appliance_id_seq', 1, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: backend; Owner: digitalspine
--

SELECT pg_catalog.setval('backend.user_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: digitalspine
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: backend; Owner: digitalspine
--

ALTER TABLE ONLY backend.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: appliance appliance_pkey; Type: CONSTRAINT; Schema: backend; Owner: digitalspine
--

ALTER TABLE ONLY backend.appliance
    ADD CONSTRAINT appliance_pkey PRIMARY KEY (id);


--
-- Name: appliance appliance_serial; Type: CONSTRAINT; Schema: backend; Owner: digitalspine
--

ALTER TABLE ONLY backend.appliance
    ADD CONSTRAINT appliance_serial UNIQUE (serial);


--
-- Name: smartPlug smartPlug_applianceId; Type: CONSTRAINT; Schema: backend; Owner: digitalspine
--

ALTER TABLE ONLY backend."smartPlug"
    ADD CONSTRAINT "smartPlug_applianceId" PRIMARY KEY ("applianceId");


--
-- Name: account user_name; Type: CONSTRAINT; Schema: backend; Owner: digitalspine
--

ALTER TABLE ONLY backend.account
    ADD CONSTRAINT user_name UNIQUE (name);


--
-- Name: account user_pkey; Type: CONSTRAINT; Schema: backend; Owner: digitalspine
--

ALTER TABLE ONLY backend.account
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: SEQUENCE user_id_seq; Type: ACL; Schema: public; Owner: digitalspine
--

GRANT ALL ON SEQUENCE public.user_id_seq TO digitalspine;


--
-- PostgreSQL database dump complete
--

