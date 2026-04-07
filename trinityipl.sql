--
-- PostgreSQL database dump
--

\restrict lMpKIdAMy6Wv4c7vYmcjy1bNNgJquQROy57sDntsrsFOZdxZopPb4r4wg5nigz2

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: matches; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.matches (
    id integer NOT NULL,
    team1 character varying(100),
    team2 character varying(100),
    match_time timestamp without time zone,
    result character varying(100),
    status character varying(20) DEFAULT 'upcoming'::character varying
);


ALTER TABLE public.matches OWNER TO admin;

--
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matches_id_seq OWNER TO admin;

--
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- Name: picks; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.picks (
    id integer NOT NULL,
    user_id integer,
    match_id integer,
    selected_team character varying(100),
    points integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.picks OWNER TO admin;

--
-- Name: picks_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.picks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.picks_id_seq OWNER TO admin;

--
-- Name: picks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.picks_id_seq OWNED BY public.picks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(150),
    password_hash text,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- Name: picks id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.picks ALTER COLUMN id SET DEFAULT nextval('public.picks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.matches (id, team1, team2, match_time, result, status) FROM stdin;
1	MI	CSK	2026-04-10 19:30:00	\N	upcoming
2	RCB	KKR	2026-04-12 19:30:00	\N	upcoming
6	CSK	MI	2026-04-01 19:30:00	CSK won by 5 wickets	completed
7	KKR	RCB	2026-04-02 19:30:00	KKR won by 10 runs	completed
5	RR	PBKS	2026-04-03 15:00:00	RR won by 2 runs	completed
10	DC	RR	2026-04-03 15:34:00		completed
11	CSK	RCB	2026-04-04 19:00:00	CSK	completed
12	PBKS	RCB	2026-04-04 15:30:00	PBKS	completed
15	CSK	PBKS	2026-04-04 18:35:00	CSK	completed
16	CSK	GT	2026-04-05 12:37:00	GT	completed
14	PBKS	CSK	2026-04-04 19:20:00	PBKS	completed
3	SRH	DC	2026-04-03 23:45:00	SRH	completed
21	RR	GT	2026-04-04 23:40:00	RR	completed
22	SRH	PBKS	2026-04-04 23:44:00	SRH	completed
4	GT	LSG	2026-04-03 23:45:00	GT	completed
19	GT	LSG	2026-04-04 12:41:00	GT	completed
18	LSG	KKR	2026-04-04 12:38:00	KKR	completed
20	MI 	LSG	2026-04-04 19:10:00	MI 	completed
24	PBKS	GT	2026-04-05 01:22:00	PBKS	completed
17	CSK	LSG	2026-04-05 13:38:00	\N	live
25	DC	PBKS	2026-04-05 13:51:00	\N	live
26	MI	RR	2026-04-05 13:56:00	MI	completed
27	MI	LSG	2026-04-05 15:03:00	MI	completed
23	KKR	RCB	2026-04-05 15:25:00	\N	live
28	MI	CSK	2026-04-05 15:44:00	CSK	completed
13	SRH	GT	2026-04-05 19:13:00	\N	live
29	KKR	MI	2026-04-07 02:20:00	KKR	completed
30	CSK	KKR	2026-04-07 02:39:00	\N	live
31	GT	CSK	2026-04-07 10:25:00	CSK	completed
\.


--
-- Data for Name: picks; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.picks (id, user_id, match_id, selected_team, points, created_at) FROM stdin;
2	3	11	RCB	0	2026-04-04 01:03:33.234138
15	3	26	RR	0	2026-04-05 13:54:55.552757
17	3	27	LSG	0	2026-04-05 15:01:48.359203
1	2	11	CSK	1	2026-04-04 01:00:18.010984
3	2	12	PBKS	1	2026-04-04 01:49:22.417322
4	3	12	PBKS	1	2026-04-04 01:50:07.163951
12	2	23	KKR	0	2026-04-05 13:52:18.055139
13	2	13	SRH	0	2026-04-05 13:52:36.697611
5	2	15	CSK	1	2026-04-04 12:52:09.520412
6	2	16	GT	1	2026-04-04 12:57:52.518471
7	3	14	PBKS	1	2026-04-04 14:05:42.163704
8	4	21	RR	1	2026-04-04 23:38:56.410456
9	3	22	SRH	1	2026-04-04 23:43:35.445583
10	2	24	PBKS	1	2026-04-05 01:21:09.357203
11	3	24	PBKS	1	2026-04-05 01:21:40.394879
14	2	26	MI	1	2026-04-05 13:54:27.27107
16	2	27	MI	1	2026-04-05 15:01:09.748085
18	2	28	CSK	1	2026-04-05 15:41:42.577653
19	2	29	KKR	1	2026-04-07 02:18:31.264404
21	2	31	CSK	1	2026-04-07 10:21:53.609301
20	2	30	CSK	0	2026-04-07 02:37:45.017654
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, name, email, password_hash, role, created_at) FROM stdin;
3	Ankur	test2@gmail.com	$2b$12$6S23fXO4MeEUL8yZ1NlPzeoq4a7VWMWefj3WQLrkAwJ3CmlXuLc.q	user	2026-04-04 00:28:33.481183
4	Prabhat Admin	admin1@gmail.com	$2b$12$iml0M2onUthoCys4453Died0MSEECDVgsg9EnyfZQh2ffFRrhtXoe	admin	2026-04-04 11:42:55.525191
2	Prabhu	test1@gmail.com	$2b$12$WvQC495i80PjykxigyAZ6ei.2hSReqjnlM78HEYeBFOISDhvHbHCm	user	2026-04-03 01:33:07.392411
\.


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.matches_id_seq', 31, true);


--
-- Name: picks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.picks_id_seq', 21, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: picks picks_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.picks
    ADD CONSTRAINT picks_pkey PRIMARY KEY (id);


--
-- Name: picks picks_user_id_match_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.picks
    ADD CONSTRAINT picks_user_id_match_id_key UNIQUE (user_id, match_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: picks picks_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.picks
    ADD CONSTRAINT picks_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- Name: picks picks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.picks
    ADD CONSTRAINT picks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict lMpKIdAMy6Wv4c7vYmcjy1bNNgJquQROy57sDntsrsFOZdxZopPb4r4wg5nigz2

