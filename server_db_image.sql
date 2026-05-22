--
-- PostgreSQL database dump
--

\restrict qz13tkFvQ4WE21Xidz6Bsl0XTAPj8iML5uKPVRkpc30saKIVNcMdTx1EK70zB8T

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: matches; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.matches (
    id integer NOT NULL,
    team1 character varying(100),
    team2 character varying(100),
    match_time timestamp with time zone,
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
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
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
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    password_reset boolean DEFAULT false
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
1	RCB	SRH	2026-03-28 14:00:00+00	RCB	completed
2	MI	KKR	2026-03-29 14:00:00+00	MI	completed
3	RR	CSK	2026-03-30 14:00:00+00	RR	completed
4	PBKS	GT	2026-03-31 14:00:00+00	PBKS	completed
5	LSG	DC	2026-04-01 14:00:00+00	DC	completed
6	KKR	SRH	2026-04-02 14:00:00+00	SRH	completed
7	CSK	PBKS	2026-04-03 14:00:00+00	PBKS	completed
8	DC	MI	2026-04-04 10:00:00+00	DC	completed
9	GT	RR	2026-04-04 14:00:00+00	RR	completed
10	SRH	LSG	2026-04-05 10:00:00+00	LSG	completed
11	RCB	CSK	2026-04-05 14:00:00+00	RCB	completed
12	KKR	PBKS	2026-04-06 14:00:00+00	\N	completed
13	RR	MI	2026-04-07 14:00:00+00	RR	completed
14	DC	GT	2026-04-08 14:00:00+00	GT	completed
15	KKR	LSG	2026-04-09 14:00:00+00	LSG	completed
16	RR	RCB	2026-04-10 14:00:00+00	RR	completed
17	PBKS	SRH	2026-04-11 10:00:00+00	PBKS	completed
18	CSK	DC	2026-04-11 14:00:00+00	CSK	completed
19	LSG	GT	2026-04-12 10:00:00+00	GT	completed
20	MI	RCB	2026-04-12 14:00:00+00	RCB	completed
21	SRH	RR	2026-04-13 14:00:00+00	SRH	completed
22	CSK	KKR	2026-04-14 14:00:00+00	CSK	completed
23	RCB	LSG	2026-04-15 14:00:00+00	RCB	completed
24	MI	PBKS	2026-04-16 14:00:00+00	PBKS	completed
25	GT	KKR	2026-04-17 14:00:00+00	GT	completed
26	RCB	DC	2026-04-18 10:00:00+00	DC	completed
27	SRH	CSK	2026-04-18 14:00:00+00	SRH	completed
28	KKR	RR	2026-04-19 10:00:00+00	KKR	completed
29	PBKS	LSG	2026-04-19 14:00:00+00	PBKS	completed
30	GT	MI	2026-04-20 14:00:00+00	MI	completed
31	SRH	DC	2026-04-21 14:00:00+00	SRH	completed
32	LSG	RR	2026-04-22 14:00:00+00	RR	completed
33	MI	CSK	2026-04-23 14:00:00+00	CSK	completed
47	MI	LSG	2026-05-04 14:00:00+00	MI	completed
48	DC	CSK	2026-05-05 14:00:00+00	DC	completed
49	SRH	PBKS	2026-05-06 14:00:00+00	SRH	completed
98	csk	rr	2026-05-07 06:37:00+00	No Result	completed
50	LSG	RCB	2026-05-07 14:00:00+00	LSG	completed
96	rcb	csk	2026-05-07 15:46:00+00	No Result	completed
35	DC	PBKS	2026-04-25 10:00:00+00	PBKS	completed
36	RR	SRH	2026-04-25 14:00:00+00	SRH	completed
37	GT	CSK	2026-04-26 10:00:00+00	GT	completed
38	LSG	KKR	2026-04-26 14:00:00+00	KKR	completed
39	DC	RCB	2026-04-27 14:00:00+00	RCB	completed
40	PBKS	RR	2026-04-28 14:00:00+00	RR	completed
41	MI	SRH	2026-04-29 14:00:00+00	SRH	completed
42	GT	RCB	2026-04-30 14:00:00+00	GT	completed
43	RR	DC	2026-05-01 14:00:00+00	DC	completed
44	CSK	MI	2026-05-02 14:00:00+00	CSK	completed
45	SRH	KKR	2026-05-03 10:00:00+00	KKR	completed
46	GT	PBKS	2026-05-03 14:00:00+00	GT	completed
95	CSK	RCB	2026-05-07 06:12:00+00	CSK	completed
97	kkr	csk	2026-05-07 06:18:00+00	csk	completed
34	RCB	GT	2026-04-24 14:00:00+00	RCB	completed
51	DC	KKR	2026-05-08 14:00:00+00	KKR	completed
52	RR	GT	2026-05-09 14:00:00+00	GT	completed
53	CSK	LSG	2026-05-10 10:00:00+00	CSK	completed
54	RCB	MI	2026-05-10 14:00:00+00	RCB	completed
55	PBKS	DC	2026-05-11 14:00:00+00	DC	completed
56	GT	SRH	2026-05-12 14:00:00+00	GT	completed
57	RCB	KKR	2026-05-13 14:00:00+00	RCB	completed
58	PBKS	MI	2026-05-14 14:00:00+00	MI	completed
59	LSG	CSK	2026-05-15 14:00:00+00	LSG	completed
60	KKR	GT	2026-05-16 14:00:00+00	KKR	completed
61	PBKS	RCB	2026-05-17 10:00:00+00	RCB	completed
62	DC	RR	2026-05-17 14:00:00+00	DC	completed
63	CSK	SRH	2026-05-18 14:00:00+00	SRH	completed
64	RR	LSG	2026-05-19 14:00:00+00	RR	completed
68	LSG	PBKS	2026-05-23 14:00:00+00	\N	upcoming
69	MI	RR	2026-05-24 10:00:00+00	\N	upcoming
70	KKR	DC	2026-05-24 14:00:00+00	\N	upcoming
65	KKR	MI	2026-05-20 14:00:00+00	KKR	completed
66	CSK	GT	2026-05-21 14:00:00+00	\N	live
67	SRH	RCB	2026-05-22 14:00:00+00	\N	today
\.


--
-- Data for Name: picks; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.picks (id, user_id, match_id, selected_team, points, created_at) FROM stdin;
1	11	1	SRH	0	2026-04-24 08:29:38.074419+00
2	12	1	SRH	0	2026-04-24 08:29:38.074419+00
3	13	1	SRH	0	2026-04-24 08:29:38.074419+00
5	12	2	KKR	0	2026-04-24 08:29:38.074419+00
6	13	2	KKR	0	2026-04-24 08:29:38.074419+00
9	13	3	CSK	0	2026-04-24 08:29:38.074419+00
10	11	4	GT	0	2026-04-24 08:29:38.074419+00
13	11	5	LSG	0	2026-04-24 08:29:38.074419+00
14	12	5	LSG	0	2026-04-24 08:29:38.074419+00
15	13	5	LSG	0	2026-04-24 08:29:38.074419+00
16	11	6	KKR	0	2026-04-24 08:29:38.074419+00
17	12	6	KKR	0	2026-04-24 08:29:38.074419+00
18	13	6	KKR	0	2026-04-24 08:29:38.074419+00
21	13	7	CSK	0	2026-04-24 08:29:38.074419+00
22	11	8	MI	0	2026-04-24 08:29:38.074419+00
24	13	8	MI	0	2026-04-24 08:29:38.074419+00
25	11	9	GT	0	2026-04-24 08:29:38.074419+00
28	11	10	SRH	0	2026-04-24 08:29:38.074419+00
31	11	11	CSK	0	2026-04-24 08:29:38.074419+00
34	11	12	KKR	0	2026-04-24 08:29:38.074419+00
35	12	12	PBKS	0	2026-04-24 08:29:38.074419+00
36	13	12	KKR	0	2026-04-24 08:29:38.074419+00
37	11	13	MI	0	2026-04-24 08:29:38.074419+00
39	13	13	MI	0	2026-04-24 08:29:38.074419+00
40	11	14	DC	0	2026-04-24 08:29:38.074419+00
41	12	14	DC	0	2026-04-24 08:29:38.074419+00
43	11	15	KKR	0	2026-04-24 08:29:38.074419+00
46	11	16	RCB	0	2026-04-24 08:29:38.074419+00
47	12	16	RCB	0	2026-04-24 08:29:38.074419+00
48	13	16	RCB	0	2026-04-24 08:29:38.074419+00
52	11	18	DC	0	2026-04-24 08:29:38.074419+00
53	12	18	DC	0	2026-04-24 08:29:38.074419+00
58	11	20	MI	0	2026-04-24 08:29:38.074419+00
59	12	20	MI	0	2026-04-24 08:29:38.074419+00
60	13	20	MI	0	2026-04-24 08:29:38.074419+00
61	11	21	RR	0	2026-04-24 08:29:38.074419+00
66	13	22	KKR	0	2026-04-24 08:29:38.074419+00
116	2	66	CSK	0	2026-05-20 16:20:19.622866+00
68	12	23	LSG	0	2026-04-24 08:29:38.074419+00
114	2	65	MI	0	2026-05-20 05:15:39.326917+00
112	2	61	PBKS	0	2026-05-13 15:08:03.650168+00
72	13	24	MI	0	2026-04-24 08:29:38.074419+00
73	11	25	KKR	0	2026-04-24 08:29:38.074419+00
117	2	67	SRH	0	2026-05-20 16:20:23.912266+00
75	13	25	KKR	0	2026-04-24 08:29:38.074419+00
76	11	26	RCB	0	2026-04-24 08:29:38.074419+00
77	12	26	RCB	0	2026-04-24 08:29:38.074419+00
109	2	56	SRH	0	2026-05-12 07:18:29.232917+00
106	2	51	KKR	1	2026-05-08 05:45:38.372612+00
80	12	27	CSK	0	2026-04-24 08:29:38.074419+00
101	2	39	DC	0	2026-04-27 06:39:51.795278+00
83	12	28	RR	0	2026-04-24 08:29:38.074419+00
84	13	28	RR	0	2026-04-24 08:29:38.074419+00
86	12	29	LSG	0	2026-04-24 08:29:38.074419+00
87	13	29	LSG	0	2026-04-24 08:29:38.074419+00
89	12	30	GT	0	2026-04-24 08:29:38.074419+00
91	11	31	DC	0	2026-04-24 08:29:38.074419+00
102	2	47	MI	1	2026-05-04 07:11:14.896894+00
93	13	31	DC	0	2026-04-24 08:29:38.074419+00
105	2	97	csk	1	2026-05-07 06:17:18.587361+00
95	12	32	LSG	0	2026-04-24 08:29:38.074419+00
110	2	58	PBKS	0	2026-05-13 15:00:12.153753+00
111	2	59	CSK	0	2026-05-13 15:00:13.907821+00
113	16	58	PBKS	0	2026-05-14 09:27:48.998128+00
104	2	95	CSK	1	2026-05-07 06:11:16.623121+00
4	11	2	MI	1	2026-04-24 08:29:38.074419+00
7	11	3	RR	1	2026-04-24 08:29:38.074419+00
8	12	3	RR	1	2026-04-24 08:29:38.074419+00
11	12	4	PBKS	1	2026-04-24 08:29:38.074419+00
12	13	4	PBKS	1	2026-04-24 08:29:38.074419+00
19	11	7	PBKS	1	2026-04-24 08:29:38.074419+00
20	12	7	PBKS	1	2026-04-24 08:29:38.074419+00
23	12	8	DC	1	2026-04-24 08:29:38.074419+00
26	12	9	RR	1	2026-04-24 08:29:38.074419+00
27	13	9	RR	1	2026-04-24 08:29:38.074419+00
29	12	10	LSG	1	2026-04-24 08:29:38.074419+00
30	13	10	LSG	1	2026-04-24 08:29:38.074419+00
32	12	11	RCB	1	2026-04-24 08:29:38.074419+00
33	13	11	RCB	1	2026-04-24 08:29:38.074419+00
38	12	13	RR	1	2026-04-24 08:29:38.074419+00
42	13	14	GT	1	2026-04-24 08:29:38.074419+00
44	12	15	LSG	1	2026-04-24 08:29:38.074419+00
45	13	15	LSG	1	2026-04-24 08:29:38.074419+00
49	11	17	PBKS	1	2026-04-24 08:29:38.074419+00
50	12	17	PBKS	1	2026-04-24 08:29:38.074419+00
51	13	17	PBKS	1	2026-04-24 08:29:38.074419+00
54	13	18	CSK	1	2026-04-24 08:29:38.074419+00
55	11	19	GT	1	2026-04-24 08:29:38.074419+00
56	12	19	GT	1	2026-04-24 08:29:38.074419+00
57	13	19	GT	1	2026-04-24 08:29:38.074419+00
62	12	21	SRH	1	2026-04-24 08:29:38.074419+00
63	13	21	SRH	1	2026-04-24 08:29:38.074419+00
107	2	55	PBKS	0	2026-05-11 10:47:01.255994+00
103	15	47	LSG	0	2026-05-04 13:05:22.116841+00
97	11	33	MI	0	2026-04-24 08:38:11.185687+00
99	13	33	MI	0	2026-04-24 08:38:11.185687+00
108	2	57	RCB	1	2026-05-11 10:47:26.871862+00
64	11	22	CSK	1	2026-04-24 08:29:38.074419+00
65	12	22	CSK	1	2026-04-24 08:29:38.074419+00
67	11	23	RCB	1	2026-04-24 08:29:38.074419+00
69	13	23	RCB	1	2026-04-24 08:29:38.074419+00
79	11	27	SRH	1	2026-04-24 08:29:38.074419+00
81	13	27	SRH	1	2026-04-24 08:29:38.074419+00
82	11	28	KKR	1	2026-04-24 08:29:38.074419+00
85	11	29	PBKS	1	2026-04-24 08:29:38.074419+00
100	2	34	RCB	1	2026-04-24 09:02:34.952279+00
88	11	30	MI	1	2026-04-24 08:29:38.074419+00
90	13	30	MI	1	2026-04-24 08:29:38.074419+00
92	12	31	SRH	1	2026-04-24 08:29:38.074419+00
94	11	32	RR	1	2026-04-24 08:29:38.074419+00
96	13	32	RR	1	2026-04-24 08:29:38.074419+00
98	12	33	CSK	1	2026-04-24 08:38:11.185687+00
70	11	24	PBKS	1	2026-04-24 08:29:38.074419+00
71	12	24	PBKS	1	2026-04-24 08:29:38.074419+00
74	12	25	GT	1	2026-04-24 08:29:38.074419+00
78	13	26	DC	1	2026-04-24 08:29:38.074419+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, name, email, password_hash, role, created_at, password_reset) FROM stdin;
11	Ajitesh Pathak 	aj@gmail.com	$2b$12$jUSb/SQRhAlja3q8RxGDm.ZIXR/u0AM9J.ehkw0SVqpJQNuu/z1g2	user	2026-04-23 12:56:33.137777+00	t
12	Nesar	nesar@gmail.com	$2b$12$KG5PHtJ1wucpFg/j9JHhJ.2k64cbvthM9fLhR49.R6y6z9Zzu6GXq	user	2026-04-24 07:35:37.442771+00	f
13	Shubham Grover	shubham@gmail.com	$2b$12$bQlIJhA3B37K1qGXskFfouXowh3pBEHkgyPVZzabxOH/kpEaj/xYy	user	2026-04-24 07:36:03.425309+00	f
15	Prabhat 	prabhat@gmail.com	$2b$12$d9vIzNvOnRR9sK.DMvjvSuzylMYM8CRBvzFLfLyi17u3wF5dctdca	user	2026-05-04 12:45:55.175598+00	t
16	Souhard 	souhard@gmail.com	$2b$12$/hGAWmT0PUvgkk2hSLHrtesX1OyhoG48S1DipoZ9hWqG9uh7EbTXW	user	2026-05-13 15:14:55.846564+00	t
4	Prabhat Admin	admin1@gmail.com	$2b$12$Ea/cSljxuzLM3PR.rV8meuq/xncKU..Q4ovD/eKTCi/SQ9rDd3V0e	admin	2026-04-04 11:42:55.525191+00	t
2	Prabhu	test1@gmail.com	$2b$12$rP6yicla9FyuOuCgKBNWJest4ALL32t1SD.4zEDjbtORvr8BQ1ubi	user	2026-04-03 01:33:07.392411+00	t
\.


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.matches_id_seq', 101, true);


--
-- Name: picks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.picks_id_seq', 119, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 17, true);


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
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO admin;


--
-- PostgreSQL database dump complete
--

\unrestrict qz13tkFvQ4WE21Xidz6Bsl0XTAPj8iML5uKPVRkpc30saKIVNcMdTx1EK70zB8T

