--
-- PostgreSQL database dump
--

\restrict Dw32wrMbS8rwsTb4RXPYETy9f6INmOB0xdKaoofcXnw9HRG45f4RXZOiNAF9wix

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: matches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.matches (
    id integer NOT NULL,
    team1 character varying(100),
    team2 character varying(100),
    match_time timestamp with time zone,
    result character varying(100),
    status character varying(20) DEFAULT 'upcoming'::character varying
);


--
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- Name: picks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.picks (
    id integer NOT NULL,
    user_id integer,
    match_id integer,
    selected_team character varying(100),
    points integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: picks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.picks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: picks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.picks_id_seq OWNED BY public.picks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(150),
    password_hash text,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- Name: picks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.picks ALTER COLUMN id SET DEFAULT nextval('public.picks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.matches (id, team1, team2, match_time, result, status) FROM stdin;
6	CSK	MI	2026-04-02 01:00:00+05:30	CSK won by 5 wickets	completed
7	KKR	RCB	2026-04-03 01:00:00+05:30	KKR won by 10 runs	completed
50	SRH	LSG	2026-04-09 06:55:00+05:30	SRH	completed
52	RCB	MI	2026-04-09 13:09:00+05:30	RCB	completed
5	RR	PBKS	2026-04-03 20:30:00+05:30	RR won by 2 runs	completed
51	KKR	LSG	2026-04-09 06:56:00+05:30	KKR	completed
53	PBKS	KKR	2026-04-09 17:38:00+05:30	PBKS	completed
60	PBKS	CSK	2026-04-15 10:39:00+05:30	CSK	completed
10	DC	RR	2026-04-03 21:04:00+05:30		completed
11	CSK	RCB	2026-04-05 00:30:00+05:30	CSK	completed
57	RR	KKR	2026-04-15 18:52:00+05:30	\N	live
12	PBKS	RCB	2026-04-04 21:00:00+05:30	PBKS	completed
41	GT	PBKS	2026-04-08 22:05:00+05:30	GT	completed
32	CSK	RCB	2026-04-07 17:51:00+05:30	No Result	completed
36	DC	CSK	2026-04-08 18:55:00+05:30	No Result	completed
37	RR	PBKS	2026-04-08 19:35:00+05:30	No Result	completed
38	PBKS	DC	2026-04-08 20:41:00+05:30	No Result	completed
15	CSK	PBKS	2026-04-05 00:05:00+05:30	CSK	completed
16	CSK	GT	2026-04-05 18:07:00+05:30	GT	completed
14	PBKS	CSK	2026-04-05 00:50:00+05:30	PBKS	completed
3	SRH	DC	2026-04-04 05:15:00+05:30	SRH	completed
21	RR	GT	2026-04-05 05:10:00+05:30	RR	completed
22	SRH	PBKS	2026-04-05 05:14:00+05:30	SRH	completed
62	LSG	MI	2026-04-15 10:57:00+05:30	No Result	completed
73	GT	MI	2026-04-16 17:05:00+05:30	GT	completed
4	GT	LSG	2026-04-04 05:15:00+05:30	GT	completed
19	GT	LSG	2026-04-04 18:11:00+05:30	GT	completed
18	LSG	KKR	2026-04-04 18:08:00+05:30	KKR	completed
20	MI 	LSG	2026-04-05 00:40:00+05:30	MI 	completed
58	CSK	SRH	2026-04-15 00:42:00+05:30	\N	live
24	PBKS	GT	2026-04-05 06:52:00+05:30	PBKS	completed
42	CSK	KKR	2026-04-08 22:11:00+05:30	CSK	completed
43	LSG	MI	2026-04-08 22:12:00+05:30	No Result	completed
26	MI	RR	2026-04-05 19:26:00+05:30	MI	completed
39	GT	CSK	2026-04-08 22:37:00+05:30	CSK	completed
27	MI	LSG	2026-04-05 20:33:00+05:30	MI	completed
59	KKR	RCB	2026-04-15 00:45:00+05:30	No Result	completed
28	MI	CSK	2026-04-05 21:14:00+05:30	CSK	completed
29	KKR	MI	2026-04-07 07:50:00+05:30	KKR	completed
61	RR	GT	2026-04-15 10:45:00+05:30	GT	completed
72	LSG	CSK	2026-04-16 16:15:00+05:30	CSK	completed
31	GT	CSK	2026-04-07 15:55:00+05:30	CSK	completed
17	CSK	LSG	2026-04-05 19:08:00+05:30	CSK	completed
25	DC	PBKS	2026-04-05 19:21:00+05:30	PBKS	completed
30	CSK	KKR	2026-04-07 08:09:00+05:30	CSK	completed
23	KKR	RCB	2026-04-05 20:55:00+05:30	KKR	completed
44	LSG	KKR	2026-04-09 05:40:00+05:30	LSG	completed
40	PBKS	GT	2026-04-08 23:05:00+05:30	GT	completed
45	PBKS	DC	2026-04-09 05:40:00+05:30	DC	completed
33	MI	GT	2026-04-07 18:14:00+05:30	MI	completed
46	CSK	RCB	2026-04-09 05:41:00+05:30	CSK	completed
47	MI	CSK	2026-04-09 05:41:00+05:30	CSK	completed
34	MI	RR	2026-04-08 03:13:00+05:30	No Result	completed
13	SRH	GT	2026-04-06 00:43:00+05:30	SRH	completed
35	KKR	LSG	2026-04-08 17:53:00+05:30	LSG	completed
64	SRH	DC	2026-04-15 11:24:00+05:30	DC	completed
63	MI	CSK	2026-04-15 11:00:00+05:30	\N	live
48	RR	GT	2026-04-09 05:47:00+05:30	No Result	completed
74	KKR	CSK	2026-04-16 09:27:00+05:30	\N	live
75	GT	MI	2026-04-16 13:30:00+05:30	\N	live
66	CSK	GT	2026-04-15 22:19:00+05:30	CSK	completed
54	LSG	GT	2026-04-09 19:44:00+05:30	LSG	completed
68	LSG	RCB	2026-04-16 20:27:00+05:30	\N	live
67	RR	RCB	2026-04-15 23:05:00+05:30	\N	live
55	RR	CSK	2026-04-10 03:13:00+05:30	CSK	completed
69	PBKS	GT	2026-04-16 20:32:00+05:30	\N	live
56	CSK	DC	2026-04-13 17:10:00+05:30	CSK	completed
49	KKR	RCB	2026-04-09 06:00:00+05:30	KKR	completed
70	SRH	DC	2026-04-17 06:38:00+05:30	\N	live
71	KKR	SRH	2026-04-17 06:41:00+05:30	\N	live
65	MI	PBKS	2026-04-16 09:00:00+05:30	\N	live
1	MI	CSK	2026-04-11 01:00:00+05:30	MI	completed
2	RCB	KKR	2026-04-13 01:00:00+05:30	KKR	completed
76	SRH	MI	2026-04-17 22:20:00+05:30	\N	live
77	PBKS	SRH	2026-04-18 00:44:00+05:30	\N	live
78	PBKS	SRH	2026-04-18 00:44:00+05:30	\N	live
83	RCB	MI	2026-04-18 01:38:00+05:30	\N	live
84	LSG	KKR	2026-04-18 02:27:00+05:30	LSG	completed
79	CSK	GT	2026-04-18 10:37:00+05:30	\N	live
80	KKR	GT	2026-04-18 10:47:00+05:30	\N	live
81	MI	PBKS	2026-04-18 10:52:00+05:30	\N	live
82	SRH	DC	2026-04-18 10:57:00+05:30	\N	live
86	GT	CSK	2026-04-21 11:55:00+05:30	CSK	completed
85	LSG	KKR	2026-04-21 11:27:00+05:30	LSG	completed
\.


--
-- Data for Name: picks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.picks (id, user_id, match_id, selected_team, points, created_at) FROM stdin;
2	3	11	RCB	0	2026-04-04 06:33:33.234138+05:30
15	3	26	RR	0	2026-04-05 19:24:55.552757+05:30
34	2	40	PBKS	0	2026-04-08 22:25:45.266064+05:30
39	3	48	RR	0	2026-04-09 05:46:25.182324+05:30
49	2	67	RR	0	2026-04-15 23:04:07.611018+05:30
17	3	27	LSG	0	2026-04-05 20:31:48.359203+05:30
29	2	37	RR	0	2026-04-08 19:22:48.631674+05:30
26	2	34	MI	0	2026-04-08 03:11:45.392629+05:30
40	3	52	MI	0	2026-04-09 07:25:57.863583+05:30
52	2	69	GT	0	2026-04-16 06:01:28.938909+05:30
44	7	55	RR	0	2026-04-10 03:12:51.740151+05:30
33	7	40	PBKS	0	2026-04-08 22:05:47.369011+05:30
50	3	67	RCB	0	2026-04-15 23:04:25.244626+05:30
51	2	68	RCB	0	2026-04-16 05:56:24.156333+05:30
30	7	38	PBKS	0	2026-04-08 19:54:27.678276+05:30
46	3	56	DC	0	2026-04-13 17:09:36.08834+05:30
47	2	57	RR	0	2026-04-15 18:52:48.179017+05:30
55	2	76	SRH	0	2026-04-17 18:19:49.900396+05:30
23	3	32	RCB	0	2026-04-07 17:50:35.371642+05:30
22	2	32	CSK	0	2026-04-07 17:50:05.571396+05:30
58	2	79	CSK	0	2026-04-18 01:05:55.734021+05:30
59	2	80	KKR	0	2026-04-18 01:24:48.84037+05:30
60	2	81	MI	0	2026-04-18 01:24:49.304618+05:30
63	2	85	LSG	1	2026-04-21 11:26:08.776951+05:30
56	2	77	PBKS	0	2026-04-18 00:43:27.168824+05:30
57	2	78	PBKS	0	2026-04-18 00:43:28.60742+05:30
64	3	86	CSK	1	2026-04-21 11:54:04.937876+05:30
48	2	66	CSK	1	2026-04-15 22:18:08.363632+05:30
27	7	35	LSG	1	2026-04-08 17:52:31.521493+05:30
61	2	83	RCB	0	2026-04-18 01:37:23.429111+05:30
28	3	35	LSG	1	2026-04-08 17:53:03.499295+05:30
1	2	11	CSK	1	2026-04-04 06:30:18.010984+05:30
3	2	12	PBKS	1	2026-04-04 07:19:22.417322+05:30
4	3	12	PBKS	1	2026-04-04 07:20:07.163951+05:30
5	2	15	CSK	1	2026-04-04 18:22:09.520412+05:30
6	2	16	GT	1	2026-04-04 18:27:52.518471+05:30
7	3	14	PBKS	1	2026-04-04 19:35:42.163704+05:30
8	4	21	RR	1	2026-04-05 05:08:56.410456+05:30
9	3	22	SRH	1	2026-04-05 05:13:35.445583+05:30
10	2	24	PBKS	1	2026-04-05 06:51:09.357203+05:30
11	3	24	PBKS	1	2026-04-05 06:51:40.394879+05:30
14	2	26	MI	1	2026-04-05 19:24:27.27107+05:30
16	2	27	MI	1	2026-04-05 20:31:09.748085+05:30
54	3	73	GT	1	2026-04-16 17:03:49.178872+05:30
12	2	23	KKR	1	2026-04-05 19:22:18.055139+05:30
53	2	72	CSK	1	2026-04-16 06:44:28.133446+05:30
37	7	47	CSK	1	2026-04-09 05:40:30.885382+05:30
42	3	54	LSG	1	2026-04-09 19:42:53.427712+05:30
45	2	56	CSK	1	2026-04-13 17:08:48.442478+05:30
41	2	53	PBKS	1	2026-04-09 17:37:37.543351+05:30
43	2	55	CSK	1	2026-04-10 03:12:24.316438+05:30
31	2	39	CSK	1	2026-04-08 21:43:15.791299+05:30
32	7	39	CSK	1	2026-04-08 22:05:20.678909+05:30
35	7	44	LSG	1	2026-04-09 05:37:09.632675+05:30
36	7	45	DC	1	2026-04-09 05:38:50.734726+05:30
38	7	46	CSK	1	2026-04-09 05:40:34.434859+05:30
18	2	28	CSK	1	2026-04-05 21:11:42.577653+05:30
19	2	29	KKR	1	2026-04-07 07:48:31.264404+05:30
21	2	31	CSK	1	2026-04-07 15:51:53.609301+05:30
20	2	30	CSK	1	2026-04-07 08:07:45.017654+05:30
13	2	13	SRH	1	2026-04-05 19:22:36.697611+05:30
24	3	33	MI	1	2026-04-07 18:12:55.268832+05:30
25	2	33	MI	1	2026-04-07 18:13:42.180478+05:30
62	3	84	LSG	1	2026-04-18 02:26:28.185155+05:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password_hash, role, created_at) FROM stdin;
3	Ankur	test2@gmail.com	$2b$12$6S23fXO4MeEUL8yZ1NlPzeoq4a7VWMWefj3WQLrkAwJ3CmlXuLc.q	user	2026-04-04 05:58:33.481183+05:30
4	Prabhat Admin	admin1@gmail.com	$2b$12$iml0M2onUthoCys4453Died0MSEECDVgsg9EnyfZQh2ffFRrhtXoe	admin	2026-04-04 17:12:55.525191+05:30
2	Prabhu	test1@gmail.com	$2b$12$MFp.o9ccsx2v3KsXzYe62ewA1nisHDvpsQrrCZ9TPcbYwgf8pZyxO	user	2026-04-03 07:03:07.392411+05:30
7	Corey	corey@gmail.com	$2b$12$/i1uXDDm5E2xw9i3bqcOEOPUMPA.51vdM6KP09.5NahWWO30hBMr.	user	2026-04-08 17:52:07.129513+05:30
\.


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.matches_id_seq', 86, true);


--
-- Name: picks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.picks_id_seq', 64, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: picks picks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.picks
    ADD CONSTRAINT picks_pkey PRIMARY KEY (id);


--
-- Name: picks picks_user_id_match_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.picks
    ADD CONSTRAINT picks_user_id_match_id_key UNIQUE (user_id, match_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: picks picks_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.picks
    ADD CONSTRAINT picks_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- Name: picks picks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.picks
    ADD CONSTRAINT picks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Dw32wrMbS8rwsTb4RXPYETy9f6INmOB0xdKaoofcXnw9HRG45f4RXZOiNAF9wix

