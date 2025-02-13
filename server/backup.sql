--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

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
-- Name: dex.trades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dex.trades" (
    "timestamp" date,
    amount_in numeric,
    amount_out numeric,
    token_sold_symbol character varying,
    token_bought_symbol character varying,
    amount_usd numeric
);


ALTER TABLE public."dex.trades" OWNER TO postgres;

--
-- Name: price_analysis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_analysis (
    id integer NOT NULL,
    "timestamp" date NOT NULL,
    uniswap_price numeric NOT NULL,
    binance_mid_price numeric NOT NULL,
    price_difference numeric NOT NULL
);


ALTER TABLE public.price_analysis OWNER TO postgres;

--
-- Name: price_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.price_analysis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.price_analysis_id_seq OWNER TO postgres;

--
-- Name: price_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.price_analysis_id_seq OWNED BY public.price_analysis.id;


--
-- Name: swaps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swaps (
    id integer NOT NULL,
    exchange text NOT NULL,
    amount_in numeric NOT NULL,
    amount_out numeric NOT NULL,
    token_in text,
    token_out text,
    "timestamp" date NOT NULL,
    token_bought_symbol text
);


ALTER TABLE public.swaps OWNER TO postgres;

--
-- Name: swaps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.swaps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.swaps_id_seq OWNER TO postgres;

--
-- Name: swaps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.swaps_id_seq OWNED BY public.swaps.id;


--
-- Name: price_analysis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_analysis ALTER COLUMN id SET DEFAULT nextval('public.price_analysis_id_seq'::regclass);


--
-- Name: swaps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swaps ALTER COLUMN id SET DEFAULT nextval('public.swaps_id_seq'::regclass);


--
-- Data for Name: dex.trades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."dex.trades" ("timestamp", amount_in, amount_out, token_sold_symbol, token_bought_symbol, amount_usd) FROM stdin;
2024-01-23	0.08586504383842798	197.913504	UNKNOWN	UNKNOWN	198.10330305033597
2024-01-23	0.00997	22.073631	UNKNOWN	UNKNOWN	22.069083832013998
2024-01-21	0.030082489179554337	74.313534	UNKNOWN	UNKNOWN	74.404419452082
2024-01-11	0.0120416347854082	29.7375	UNKNOWN	UNKNOWN	29.75855415
2024-01-02	0.02	47.476357	UNKNOWN	UNKNOWN	47.530195188838
\.


--
-- Data for Name: price_analysis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_analysis (id, "timestamp", uniswap_price, binance_mid_price, price_difference) FROM stdin;
1	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
2	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
3	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
4	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
5	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
6	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
7	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
8	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
9	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
10	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
11	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
12	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
13	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
14	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
15	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
16	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
17	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
18	2024-01-01	2275.36174995677	2281.88	-0.285652621664161
19	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
20	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
21	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
22	2024-01-01	2280.4303461662016	2281.87	-0.06309096634769973
23	2024-01-01	2275.189646816158	2281.87	-0.2927578338749261
24	2024-01-01	2275.308571428571	2281.87	-0.2875461166248985
25	2024-01-01	2281.0528663038117	2281.87	-0.035809826860791094
26	2024-01-01	2280.2878290185236	2281.87	-0.06933659592686217
27	2024-01-01	2281.341267904761	2281.87	-0.02317099989214891
28	2024-01-01	2281.14601138467	2281.87	-0.031727864222314994
29	2024-01-01	2280.271809233167	2281.87	-0.07003864229044218
30	2024-01-01	2282.2368853658536	2281.87	0.016078276407229967
31	2024-01-01	2275.36174995677	2281.87	-0.28521563643985665
\.


--
-- Data for Name: swaps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swaps (id, exchange, amount_in, amount_out, token_in, token_out, "timestamp", token_bought_symbol) FROM stdin;
14334	Uniswap V2	1006.8721665442811	2300401.144982	UNKNOWN	UNKNOWN	2024-01-04	\N
14335	Uniswap V2	758.5520908068547	1663416.192138	UNKNOWN	UNKNOWN	2024-01-27	\N
14336	Uniswap V2	601.5791	1325321.339968	UNKNOWN	UNKNOWN	2024-01-25	\N
14337	Uniswap V2	936.0853564262388	2334376.357084	UNKNOWN	UNKNOWN	2024-01-17	\N
14338	Uniswap V2	930.9883760837002	2035279.709889	UNKNOWN	UNKNOWN	2024-01-06	\N
14339	Uniswap V2	400	1023435.298769	UNKNOWN	UNKNOWN	2024-01-16	\N
14340	Uniswap V2	875.8973224662734	1914792.234412	UNKNOWN	UNKNOWN	2024-01-07	\N
14341	Uniswap V2	2023.9646709316212	4623519.100103	UNKNOWN	UNKNOWN	2024-01-03	\N
14342	Uniswap V2	888	2154147.175662	UNKNOWN	UNKNOWN	2024-01-10	\N
14343	Uniswap V2	716.4	1611725.107975	UNKNOWN	UNKNOWN	2024-01-26	\N
14344	Uniswap V2	409.3580305054223	1046454.258394	UNKNOWN	UNKNOWN	2024-01-20	\N
14345	Uniswap V2	849.0910093989172	1801461.760233	UNKNOWN	UNKNOWN	2024-01-23	\N
14346	Uniswap V2	1426.273886966705	3103397.501168	UNKNOWN	UNKNOWN	2024-01-24	\N
14347	Uniswap V2	433.33281103843547	998704.14048	UNKNOWN	UNKNOWN	2024-01-28	\N
14348	Uniswap V2	964.8101551904937	2184988.14302	UNKNOWN	UNKNOWN	2024-01-02	\N
14349	Uniswap V2	1216.6719328253498	2737949.02623	UNKNOWN	UNKNOWN	2024-01-09	\N
14350	Uniswap V2	1074.3181419586338	2691583.551145	UNKNOWN	UNKNOWN	2024-01-19	\N
14351	Uniswap V2	672.7532613211856	1513668.423084	UNKNOWN	UNKNOWN	2024-01-30	\N
14352	Uniswap V2	917.9711858401405	2339469.10343	UNKNOWN	UNKNOWN	2024-01-22	\N
14353	Uniswap V2	1999.9969942690839	5075118.519448	UNKNOWN	UNKNOWN	2024-01-13	\N
14354	Uniswap V2	467.61501867192953	1109046.91405	UNKNOWN	UNKNOWN	2024-01-15	\N
14355	Uniswap V2	942.4262015120565	2120378.117548	UNKNOWN	UNKNOWN	2024-01-01	\N
14356	Uniswap V2	848.2419134030895	1928026.356438	UNKNOWN	UNKNOWN	2024-01-05	\N
14357	Uniswap V2	614.841782950925	1493594.639788	UNKNOWN	UNKNOWN	2024-01-18	\N
14358	Uniswap V2	1092.8257647488197	2828703.876769	UNKNOWN	UNKNOWN	2024-01-11	\N
14359	Uniswap V2	831.341768519364	1863916.537941	UNKNOWN	UNKNOWN	2024-01-29	\N
14360	Uniswap V2	624.9896631186805	1591394.626988	UNKNOWN	UNKNOWN	2024-01-12	\N
14361	Uniswap V2	895.312967093348	1977679.228208	UNKNOWN	UNKNOWN	2024-01-21	\N
14362	Uniswap V2	360.9161507154762	926874.53385	UNKNOWN	UNKNOWN	2024-01-14	\N
14363	Uniswap V2	902.2661161795342	1949781.933058	UNKNOWN	UNKNOWN	2024-01-08	\N
14789	Unknown Exchange	1006.8721665442811	2300401.144982	WETH	USDT	2024-01-04	\N
14790	Unknown Exchange	758.5520908068547	1663416.192138	WETH	USDT	2024-01-27	\N
14791	Unknown Exchange	601.5791	1325321.339968	WETH	USDT	2024-01-25	\N
14792	Unknown Exchange	936.0853564262388	2334376.357084	WETH	USDT	2024-01-17	\N
14793	Unknown Exchange	930.9883760837002	2035279.709889	WETH	USDT	2024-01-06	\N
14794	Uniswap V3	942.4262015120565	2120378.117548	WETH	USDT	2024-01-01	\N
14795	Uniswap V3	964.8101551904937	2184988.14302	WETH	USDT	2024-01-02	\N
14796	Uniswap V3	2023.9646709316212	4623519.100103	WETH	USDT	2024-01-03	\N
14797	Uniswap V3	1006.8721665442811	2300401.144982	WETH	USDT	2024-01-04	\N
14798	Uniswap V3	848.2419134030895	1928026.356438	WETH	USDT	2024-01-05	\N
14799	Uniswap V3	930.9883760837002	2035279.709889	WETH	USDT	2024-01-06	\N
14800	Uniswap V3	875.8973224662734	1914792.234412	WETH	USDT	2024-01-07	\N
14801	Uniswap V3	902.2661161795342	1949781.933058	WETH	USDT	2024-01-08	\N
14802	Uniswap V3	1216.6719328253498	2737949.02623	WETH	USDT	2024-01-09	\N
14803	Uniswap V3	708.762112861677	1645549.210626	WETH	USDT	2024-01-10	\N
14804	Uniswap V3	1092.8257647488197	2828703.876769	WETH	USDT	2024-01-11	\N
14805	Uniswap V3	624.9896631186805	1591394.626988	WETH	USDT	2024-01-12	\N
14806	Uniswap V3	588.1598756167007	1491760.184322	WETH	USDT	2024-01-13	\N
14807	Uniswap V3	360.9161507154762	926874.53385	WETH	USDT	2024-01-14	\N
14808	Uniswap V3	467.61501867192953	1109046.91405	WETH	USDT	2024-01-15	\N
14809	Uniswap V3	397.507514905797	959876.797376	WETH	USDT	2024-01-16	\N
14810	Uniswap V3	936.0853564262388	2334376.357084	WETH	USDT	2024-01-17	\N
14811	Uniswap V3	614.841782950925	1493594.639788	WETH	USDT	2024-01-18	\N
14812	Uniswap V3	1074.3181419586338	2691583.551145	WETH	USDT	2024-01-19	\N
14813	Uniswap V3	409.3580305054223	1046454.258394	WETH	USDT	2024-01-20	\N
14814	Uniswap V3	895.312967093348	1977679.228208	WETH	USDT	2024-01-21	\N
14815	Uniswap V3	917.9711858401405	2339469.10343	WETH	USDT	2024-01-22	\N
14816	Uniswap V3	849.0910093989172	1801461.760233	WETH	USDT	2024-01-23	\N
14817	Uniswap V3	1426.273886966705	3103397.501168	WETH	USDT	2024-01-24	\N
14818	Uniswap V3	529.7453108361575	1193108.761602	WETH	USDT	2024-01-25	\N
14394	Binance	942.4262015120565	2120378.117548	WETH	USDT	2024-01-01	\N
14395	Binance	964.8101551904937	2184988.14302	WETH	USDT	2024-01-02	\N
14396	Binance	2023.9646709316212	4623519.100103	WETH	USDT	2024-01-03	\N
14397	Binance	1006.8721665442811	2300401.144982	WETH	USDT	2024-01-04	\N
14398	Binance	848.2419134030895	1928026.356438	WETH	USDT	2024-01-05	\N
14399	Binance	930.9883760837002	2035279.709889	WETH	USDT	2024-01-06	\N
14400	Binance	875.8973224662734	1914792.234412	WETH	USDT	2024-01-07	\N
14401	Binance	902.2661161795342	1949781.933058	WETH	USDT	2024-01-08	\N
14402	Binance	1216.6719328253498	2737949.02623	WETH	USDT	2024-01-09	\N
14403	Binance	888	2154147.175662	WETH	USDT	2024-01-10	\N
14404	Binance	1092.8257647488197	2828703.876769	WETH	USDT	2024-01-11	\N
14405	Binance	624.9896631186805	1591394.626988	WETH	USDT	2024-01-12	\N
14406	Binance	1999.9969942690839	5075118.519448	WETH	USDT	2024-01-13	\N
14407	Binance	360.9161507154762	926874.53385	WETH	USDT	2024-01-14	\N
14408	Binance	467.61501867192953	1109046.91405	WETH	USDT	2024-01-15	\N
14409	Binance	400	1023435.298769	WETH	USDT	2024-01-16	\N
14410	Binance	936.0853564262388	2334376.357084	WETH	USDT	2024-01-17	\N
14411	Binance	614.841782950925	1493594.639788	WETH	USDT	2024-01-18	\N
14412	Binance	1074.3181419586338	2691583.551145	WETH	USDT	2024-01-19	\N
14413	Binance	409.3580305054223	1046454.258394	WETH	USDT	2024-01-20	\N
14414	Binance	895.312967093348	1977679.228208	WETH	USDT	2024-01-21	\N
14415	Binance	917.9711858401405	2339469.10343	WETH	USDT	2024-01-22	\N
14416	Binance	849.0910093989172	1801461.760233	WETH	USDT	2024-01-23	\N
14417	Binance	1426.273886966705	3103397.501168	WETH	USDT	2024-01-24	\N
14418	Binance	601.5791	1325321.339968	WETH	USDT	2024-01-25	\N
14419	Binance	716.4	1611725.107975	WETH	USDT	2024-01-26	\N
14420	Binance	758.5520908068547	1663416.192138	WETH	USDT	2024-01-27	\N
14421	Binance	433.33281103843547	998704.14048	WETH	USDT	2024-01-28	\N
14422	Binance	831.341768519364	1863916.537941	WETH	USDT	2024-01-29	\N
14423	Binance	672.7532613211856	1513668.423084	WETH	USDT	2024-01-30	\N
14424	Binance	942.4262015120565	2120378.117548	WETH	USDT	2024-01-01	\N
14425	Binance	964.8101551904937	2184988.14302	WETH	USDT	2024-01-02	\N
14819	Uniswap V3	675.7962491019882	1565425.139197	WETH	USDT	2024-01-26	\N
14820	Uniswap V3	758.5520908068547	1663416.192138	WETH	USDT	2024-01-27	\N
14821	Uniswap V3	433.33281103843547	998704.14048	WETH	USDT	2024-01-28	\N
14426	Binance	2023.9646709316212	4623519.100103	WETH	USDT	2024-01-03	\N
14427	Binance	1006.8721665442811	2300401.144982	WETH	USDT	2024-01-04	\N
14428	Binance	848.2419134030895	1928026.356438	WETH	USDT	2024-01-05	\N
14429	Binance	930.9883760837002	2035279.709889	WETH	USDT	2024-01-06	\N
14430	Binance	875.8973224662734	1914792.234412	WETH	USDT	2024-01-07	\N
14431	Binance	902.2661161795342	1949781.933058	WETH	USDT	2024-01-08	\N
14432	Binance	1216.6719328253498	2737949.02623	WETH	USDT	2024-01-09	\N
14433	Binance	888	2154147.175662	WETH	USDT	2024-01-10	\N
14434	Binance	1092.8257647488197	2828703.876769	WETH	USDT	2024-01-11	\N
14435	Binance	624.9896631186805	1591394.626988	WETH	USDT	2024-01-12	\N
14436	Binance	1999.9969942690839	5075118.519448	WETH	USDT	2024-01-13	\N
14437	Binance	360.9161507154762	926874.53385	WETH	USDT	2024-01-14	\N
14438	Binance	467.61501867192953	1109046.91405	WETH	USDT	2024-01-15	\N
14439	Binance	400	1023435.298769	WETH	USDT	2024-01-16	\N
14440	Binance	936.0853564262388	2334376.357084	WETH	USDT	2024-01-17	\N
14441	Binance	614.841782950925	1493594.639788	WETH	USDT	2024-01-18	\N
14442	Binance	1074.3181419586338	2691583.551145	WETH	USDT	2024-01-19	\N
14443	Binance	409.3580305054223	1046454.258394	WETH	USDT	2024-01-20	\N
14444	Binance	895.312967093348	1977679.228208	WETH	USDT	2024-01-21	\N
14445	Binance	917.9711858401405	2339469.10343	WETH	USDT	2024-01-22	\N
14446	Binance	849.0910093989172	1801461.760233	WETH	USDT	2024-01-23	\N
14447	Binance	1426.273886966705	3103397.501168	WETH	USDT	2024-01-24	\N
14448	Binance	601.5791	1325321.339968	WETH	USDT	2024-01-25	\N
14449	Binance	716.4	1611725.107975	WETH	USDT	2024-01-26	\N
14450	Binance	758.5520908068547	1663416.192138	WETH	USDT	2024-01-27	\N
14451	Binance	433.33281103843547	998704.14048	WETH	USDT	2024-01-28	\N
14452	Binance	831.341768519364	1863916.537941	WETH	USDT	2024-01-29	\N
14453	Binance	672.7532613211856	1513668.423084	WETH	USDT	2024-01-30	\N
14454	Uniswap V2	1006.8721665442811	2300401.144982	UNKNOWN	UNKNOWN	2024-01-04	\N
14455	Uniswap V2	758.5520908068547	1663416.192138	UNKNOWN	UNKNOWN	2024-01-27	\N
14456	Uniswap V2	601.5791	1325321.339968	UNKNOWN	UNKNOWN	2024-01-25	\N
14457	Uniswap V2	936.0853564262388	2334376.357084	UNKNOWN	UNKNOWN	2024-01-17	\N
14458	Uniswap V2	930.9883760837002	2035279.709889	UNKNOWN	UNKNOWN	2024-01-06	\N
14459	Uniswap V2	400	1023435.298769	UNKNOWN	UNKNOWN	2024-01-16	\N
14460	Uniswap V2	875.8973224662734	1914792.234412	UNKNOWN	UNKNOWN	2024-01-07	\N
14461	Uniswap V2	2023.9646709316212	4623519.100103	UNKNOWN	UNKNOWN	2024-01-03	\N
14462	Uniswap V2	888	2154147.175662	UNKNOWN	UNKNOWN	2024-01-10	\N
14463	Uniswap V2	716.4	1611725.107975	UNKNOWN	UNKNOWN	2024-01-26	\N
14464	Uniswap V2	409.3580305054223	1046454.258394	UNKNOWN	UNKNOWN	2024-01-20	\N
14465	Uniswap V2	849.0910093989172	1801461.760233	UNKNOWN	UNKNOWN	2024-01-23	\N
14466	Uniswap V2	1426.273886966705	3103397.501168	UNKNOWN	UNKNOWN	2024-01-24	\N
14467	Uniswap V2	433.33281103843547	998704.14048	UNKNOWN	UNKNOWN	2024-01-28	\N
14468	Uniswap V2	964.8101551904937	2184988.14302	UNKNOWN	UNKNOWN	2024-01-02	\N
14469	Uniswap V2	1216.6719328253498	2737949.02623	UNKNOWN	UNKNOWN	2024-01-09	\N
14470	Uniswap V2	1074.3181419586338	2691583.551145	UNKNOWN	UNKNOWN	2024-01-19	\N
14471	Uniswap V2	672.7532613211856	1513668.423084	UNKNOWN	UNKNOWN	2024-01-30	\N
14472	Uniswap V2	917.9711858401405	2339469.10343	UNKNOWN	UNKNOWN	2024-01-22	\N
14473	Uniswap V2	1999.9969942690839	5075118.519448	UNKNOWN	UNKNOWN	2024-01-13	\N
14474	Uniswap V2	467.61501867192953	1109046.91405	UNKNOWN	UNKNOWN	2024-01-15	\N
14475	Uniswap V2	942.4262015120565	2120378.117548	UNKNOWN	UNKNOWN	2024-01-01	\N
14476	Uniswap V2	848.2419134030895	1928026.356438	UNKNOWN	UNKNOWN	2024-01-05	\N
14477	Uniswap V2	614.841782950925	1493594.639788	UNKNOWN	UNKNOWN	2024-01-18	\N
14478	Uniswap V2	1092.8257647488197	2828703.876769	UNKNOWN	UNKNOWN	2024-01-11	\N
14479	Uniswap V2	831.341768519364	1863916.537941	UNKNOWN	UNKNOWN	2024-01-29	\N
14480	Uniswap V2	624.9896631186805	1591394.626988	UNKNOWN	UNKNOWN	2024-01-12	\N
14481	Uniswap V2	895.312967093348	1977679.228208	UNKNOWN	UNKNOWN	2024-01-21	\N
14482	Uniswap V2	360.9161507154762	926874.53385	UNKNOWN	UNKNOWN	2024-01-14	\N
14483	Uniswap V2	902.2661161795342	1949781.933058	UNKNOWN	UNKNOWN	2024-01-08	\N
14822	Uniswap V3	831.341768519364	1863916.537941	WETH	USDT	2024-01-29	\N
14823	Uniswap V3	672.7532613211856	1513668.423084	WETH	USDT	2024-01-30	\N
14514	Uniswap V2	1006.8721665442811	2300401.144982	UNKNOWN	UNKNOWN	2024-01-04	\N
14515	Uniswap V2	758.5520908068547	1663416.192138	UNKNOWN	UNKNOWN	2024-01-27	\N
14516	Uniswap V2	601.5791	1325321.339968	UNKNOWN	UNKNOWN	2024-01-25	\N
14517	Uniswap V2	936.0853564262388	2334376.357084	UNKNOWN	UNKNOWN	2024-01-17	\N
14518	Uniswap V2	930.9883760837002	2035279.709889	UNKNOWN	UNKNOWN	2024-01-06	\N
14519	Uniswap V2	400	1023435.298769	UNKNOWN	UNKNOWN	2024-01-16	\N
14520	Uniswap V2	875.8973224662734	1914792.234412	UNKNOWN	UNKNOWN	2024-01-07	\N
14521	Uniswap V2	2023.9646709316212	4623519.100103	UNKNOWN	UNKNOWN	2024-01-03	\N
14522	Uniswap V2	888	2154147.175662	UNKNOWN	UNKNOWN	2024-01-10	\N
14523	Uniswap V2	716.4	1611725.107975	UNKNOWN	UNKNOWN	2024-01-26	\N
14524	Uniswap V2	409.3580305054223	1046454.258394	UNKNOWN	UNKNOWN	2024-01-20	\N
14525	Uniswap V2	849.0910093989172	1801461.760233	UNKNOWN	UNKNOWN	2024-01-23	\N
14526	Uniswap V2	1426.273886966705	3103397.501168	UNKNOWN	UNKNOWN	2024-01-24	\N
14527	Uniswap V2	433.33281103843547	998704.14048	UNKNOWN	UNKNOWN	2024-01-28	\N
14528	Uniswap V2	964.8101551904937	2184988.14302	UNKNOWN	UNKNOWN	2024-01-02	\N
14529	Uniswap V2	1216.6719328253498	2737949.02623	UNKNOWN	UNKNOWN	2024-01-09	\N
14530	Uniswap V2	1074.3181419586338	2691583.551145	UNKNOWN	UNKNOWN	2024-01-19	\N
14531	Uniswap V2	672.7532613211856	1513668.423084	UNKNOWN	UNKNOWN	2024-01-30	\N
14532	Uniswap V2	917.9711858401405	2339469.10343	UNKNOWN	UNKNOWN	2024-01-22	\N
14533	Uniswap V2	1999.9969942690839	5075118.519448	UNKNOWN	UNKNOWN	2024-01-13	\N
14534	Uniswap V2	467.61501867192953	1109046.91405	UNKNOWN	UNKNOWN	2024-01-15	\N
14535	Uniswap V2	942.4262015120565	2120378.117548	UNKNOWN	UNKNOWN	2024-01-01	\N
14536	Uniswap V2	848.2419134030895	1928026.356438	UNKNOWN	UNKNOWN	2024-01-05	\N
14537	Uniswap V2	614.841782950925	1493594.639788	UNKNOWN	UNKNOWN	2024-01-18	\N
14538	Uniswap V2	1092.8257647488197	2828703.876769	UNKNOWN	UNKNOWN	2024-01-11	\N
14539	Uniswap V2	831.341768519364	1863916.537941	UNKNOWN	UNKNOWN	2024-01-29	\N
14540	Uniswap V2	624.9896631186805	1591394.626988	UNKNOWN	UNKNOWN	2024-01-12	\N
14541	Uniswap V2	895.312967093348	1977679.228208	UNKNOWN	UNKNOWN	2024-01-21	\N
14542	Uniswap V2	360.9161507154762	926874.53385	UNKNOWN	UNKNOWN	2024-01-14	\N
14543	Uniswap V2	902.2661161795342	1949781.933058	UNKNOWN	UNKNOWN	2024-01-08	\N
14574	Binance	942.4262015120565	2120378.117548	WETH	USDT	2024-01-01	\N
14575	Binance	964.8101551904937	2184988.14302	WETH	USDT	2024-01-02	\N
14576	Binance	2023.9646709316212	4623519.100103	WETH	USDT	2024-01-03	\N
14577	Binance	1006.8721665442811	2300401.144982	WETH	USDT	2024-01-04	\N
14578	Binance	848.2419134030895	1928026.356438	WETH	USDT	2024-01-05	\N
14579	Binance	930.9883760837002	2035279.709889	WETH	USDT	2024-01-06	\N
14580	Binance	875.8973224662734	1914792.234412	WETH	USDT	2024-01-07	\N
14581	Binance	902.2661161795342	1949781.933058	WETH	USDT	2024-01-08	\N
14582	Binance	1216.6719328253498	2737949.02623	WETH	USDT	2024-01-09	\N
14583	Binance	888	2154147.175662	WETH	USDT	2024-01-10	\N
14584	Binance	1092.8257647488197	2828703.876769	WETH	USDT	2024-01-11	\N
14585	Binance	624.9896631186805	1591394.626988	WETH	USDT	2024-01-12	\N
14586	Binance	1999.9969942690839	5075118.519448	WETH	USDT	2024-01-13	\N
14587	Binance	360.9161507154762	926874.53385	WETH	USDT	2024-01-14	\N
14588	Binance	467.61501867192953	1109046.91405	WETH	USDT	2024-01-15	\N
14589	Binance	400	1023435.298769	WETH	USDT	2024-01-16	\N
14590	Binance	936.0853564262388	2334376.357084	WETH	USDT	2024-01-17	\N
14591	Binance	614.841782950925	1493594.639788	WETH	USDT	2024-01-18	\N
14592	Binance	1074.3181419586338	2691583.551145	WETH	USDT	2024-01-19	\N
14593	Binance	409.3580305054223	1046454.258394	WETH	USDT	2024-01-20	\N
14594	Binance	895.312967093348	1977679.228208	WETH	USDT	2024-01-21	\N
14595	Binance	917.9711858401405	2339469.10343	WETH	USDT	2024-01-22	\N
14596	Binance	849.0910093989172	1801461.760233	WETH	USDT	2024-01-23	\N
14597	Binance	1426.273886966705	3103397.501168	WETH	USDT	2024-01-24	\N
14598	Binance	601.5791	1325321.339968	WETH	USDT	2024-01-25	\N
14599	Binance	716.4	1611725.107975	WETH	USDT	2024-01-26	\N
14600	Binance	758.5520908068547	1663416.192138	WETH	USDT	2024-01-27	\N
14601	Binance	433.33281103843547	998704.14048	WETH	USDT	2024-01-28	\N
14602	Binance	831.341768519364	1863916.537941	WETH	USDT	2024-01-29	\N
14603	Binance	672.7532613211856	1513668.423084	WETH	USDT	2024-01-30	\N
14604	Uniswap V2	1006.8721665442811	2300401.144982	UNKNOWN	UNKNOWN	2024-01-04	\N
14605	Uniswap V2	758.5520908068547	1663416.192138	UNKNOWN	UNKNOWN	2024-01-27	\N
14606	Uniswap V2	601.5791	1325321.339968	UNKNOWN	UNKNOWN	2024-01-25	\N
14607	Uniswap V2	936.0853564262388	2334376.357084	UNKNOWN	UNKNOWN	2024-01-17	\N
14608	Uniswap V2	930.9883760837002	2035279.709889	UNKNOWN	UNKNOWN	2024-01-06	\N
14609	Uniswap V2	400	1023435.298769	UNKNOWN	UNKNOWN	2024-01-16	\N
14610	Uniswap V2	875.8973224662734	1914792.234412	UNKNOWN	UNKNOWN	2024-01-07	\N
14611	Uniswap V2	2023.9646709316212	4623519.100103	UNKNOWN	UNKNOWN	2024-01-03	\N
14612	Uniswap V2	888	2154147.175662	UNKNOWN	UNKNOWN	2024-01-10	\N
14613	Uniswap V2	716.4	1611725.107975	UNKNOWN	UNKNOWN	2024-01-26	\N
14614	Uniswap V2	409.3580305054223	1046454.258394	UNKNOWN	UNKNOWN	2024-01-20	\N
14615	Uniswap V2	849.0910093989172	1801461.760233	UNKNOWN	UNKNOWN	2024-01-23	\N
14616	Uniswap V2	1426.273886966705	3103397.501168	UNKNOWN	UNKNOWN	2024-01-24	\N
14617	Uniswap V2	433.33281103843547	998704.14048	UNKNOWN	UNKNOWN	2024-01-28	\N
14618	Uniswap V2	964.8101551904937	2184988.14302	UNKNOWN	UNKNOWN	2024-01-02	\N
14619	Uniswap V2	1216.6719328253498	2737949.02623	UNKNOWN	UNKNOWN	2024-01-09	\N
14620	Uniswap V2	1074.3181419586338	2691583.551145	UNKNOWN	UNKNOWN	2024-01-19	\N
14621	Uniswap V2	672.7532613211856	1513668.423084	UNKNOWN	UNKNOWN	2024-01-30	\N
14622	Uniswap V2	917.9711858401405	2339469.10343	UNKNOWN	UNKNOWN	2024-01-22	\N
14623	Uniswap V2	1999.9969942690839	5075118.519448	UNKNOWN	UNKNOWN	2024-01-13	\N
14624	Uniswap V2	467.61501867192953	1109046.91405	UNKNOWN	UNKNOWN	2024-01-15	\N
14625	Uniswap V2	942.4262015120565	2120378.117548	UNKNOWN	UNKNOWN	2024-01-01	\N
14626	Uniswap V2	848.2419134030895	1928026.356438	UNKNOWN	UNKNOWN	2024-01-05	\N
14627	Uniswap V2	614.841782950925	1493594.639788	UNKNOWN	UNKNOWN	2024-01-18	\N
14628	Uniswap V2	1092.8257647488197	2828703.876769	UNKNOWN	UNKNOWN	2024-01-11	\N
14629	Uniswap V2	831.341768519364	1863916.537941	UNKNOWN	UNKNOWN	2024-01-29	\N
14630	Uniswap V2	624.9896631186805	1591394.626988	UNKNOWN	UNKNOWN	2024-01-12	\N
14631	Uniswap V2	895.312967093348	1977679.228208	UNKNOWN	UNKNOWN	2024-01-21	\N
14632	Uniswap V2	360.9161507154762	926874.53385	UNKNOWN	UNKNOWN	2024-01-14	\N
14633	Uniswap V2	902.2661161795342	1949781.933058	UNKNOWN	UNKNOWN	2024-01-08	\N
14664	Binance	942.4262015120565	2120378.117548	WETH	USDT	2024-01-01	\N
14665	Binance	964.8101551904937	2184988.14302	WETH	USDT	2024-01-02	\N
14666	Binance	2023.9646709316212	4623519.100103	WETH	USDT	2024-01-03	\N
14667	Binance	1006.8721665442811	2300401.144982	WETH	USDT	2024-01-04	\N
14668	Binance	848.2419134030895	1928026.356438	WETH	USDT	2024-01-05	\N
14669	Binance	930.9883760837002	2035279.709889	WETH	USDT	2024-01-06	\N
14670	Binance	875.8973224662734	1914792.234412	WETH	USDT	2024-01-07	\N
14671	Binance	902.2661161795342	1949781.933058	WETH	USDT	2024-01-08	\N
14672	Binance	1216.6719328253498	2737949.02623	WETH	USDT	2024-01-09	\N
14673	Binance	888	2154147.175662	WETH	USDT	2024-01-10	\N
14674	Binance	1092.8257647488197	2828703.876769	WETH	USDT	2024-01-11	\N
14675	Binance	624.9896631186805	1591394.626988	WETH	USDT	2024-01-12	\N
14676	Binance	1999.9969942690839	5075118.519448	WETH	USDT	2024-01-13	\N
14677	Binance	360.9161507154762	926874.53385	WETH	USDT	2024-01-14	\N
14678	Binance	467.61501867192953	1109046.91405	WETH	USDT	2024-01-15	\N
14679	Binance	400	1023435.298769	WETH	USDT	2024-01-16	\N
14680	Binance	936.0853564262388	2334376.357084	WETH	USDT	2024-01-17	\N
14681	Binance	614.841782950925	1493594.639788	WETH	USDT	2024-01-18	\N
14682	Binance	1074.3181419586338	2691583.551145	WETH	USDT	2024-01-19	\N
14683	Binance	409.3580305054223	1046454.258394	WETH	USDT	2024-01-20	\N
14684	Binance	895.312967093348	1977679.228208	WETH	USDT	2024-01-21	\N
14685	Binance	917.9711858401405	2339469.10343	WETH	USDT	2024-01-22	\N
14686	Binance	849.0910093989172	1801461.760233	WETH	USDT	2024-01-23	\N
14687	Binance	1426.273886966705	3103397.501168	WETH	USDT	2024-01-24	\N
14688	Binance	601.5791	1325321.339968	WETH	USDT	2024-01-25	\N
14689	Binance	716.4	1611725.107975	WETH	USDT	2024-01-26	\N
14690	Binance	758.5520908068547	1663416.192138	WETH	USDT	2024-01-27	\N
14691	Binance	433.33281103843547	998704.14048	WETH	USDT	2024-01-28	\N
14692	Binance	831.341768519364	1863916.537941	WETH	USDT	2024-01-29	\N
14693	Binance	672.7532613211856	1513668.423084	WETH	USDT	2024-01-30	\N
14694	Uniswap V2	1006.8721665442811	2300401.144982	UNKNOWN	UNKNOWN	2024-01-04	\N
14695	Uniswap V2	758.5520908068547	1663416.192138	UNKNOWN	UNKNOWN	2024-01-27	\N
14696	Uniswap V2	601.5791	1325321.339968	UNKNOWN	UNKNOWN	2024-01-25	\N
14697	Uniswap V2	936.0853564262388	2334376.357084	UNKNOWN	UNKNOWN	2024-01-17	\N
14698	Uniswap V2	930.9883760837002	2035279.709889	UNKNOWN	UNKNOWN	2024-01-06	\N
14699	Uniswap V2	400	1023435.298769	UNKNOWN	UNKNOWN	2024-01-16	\N
14700	Uniswap V2	875.8973224662734	1914792.234412	UNKNOWN	UNKNOWN	2024-01-07	\N
14701	Uniswap V2	2023.9646709316212	4623519.100103	UNKNOWN	UNKNOWN	2024-01-03	\N
14702	Uniswap V2	888	2154147.175662	UNKNOWN	UNKNOWN	2024-01-10	\N
14703	Uniswap V2	716.4	1611725.107975	UNKNOWN	UNKNOWN	2024-01-26	\N
14704	Uniswap V2	409.3580305054223	1046454.258394	UNKNOWN	UNKNOWN	2024-01-20	\N
14705	Uniswap V2	849.0910093989172	1801461.760233	UNKNOWN	UNKNOWN	2024-01-23	\N
14706	Uniswap V2	1426.273886966705	3103397.501168	UNKNOWN	UNKNOWN	2024-01-24	\N
14707	Uniswap V2	433.33281103843547	998704.14048	UNKNOWN	UNKNOWN	2024-01-28	\N
14708	Uniswap V2	964.8101551904937	2184988.14302	UNKNOWN	UNKNOWN	2024-01-02	\N
14709	Uniswap V2	1216.6719328253498	2737949.02623	UNKNOWN	UNKNOWN	2024-01-09	\N
14710	Uniswap V2	1074.3181419586338	2691583.551145	UNKNOWN	UNKNOWN	2024-01-19	\N
14711	Uniswap V2	672.7532613211856	1513668.423084	UNKNOWN	UNKNOWN	2024-01-30	\N
14712	Uniswap V2	917.9711858401405	2339469.10343	UNKNOWN	UNKNOWN	2024-01-22	\N
14713	Uniswap V2	1999.9969942690839	5075118.519448	UNKNOWN	UNKNOWN	2024-01-13	\N
14714	Uniswap V2	467.61501867192953	1109046.91405	UNKNOWN	UNKNOWN	2024-01-15	\N
14715	Uniswap V2	942.4262015120565	2120378.117548	UNKNOWN	UNKNOWN	2024-01-01	\N
14716	Uniswap V2	848.2419134030895	1928026.356438	UNKNOWN	UNKNOWN	2024-01-05	\N
14717	Uniswap V2	614.841782950925	1493594.639788	UNKNOWN	UNKNOWN	2024-01-18	\N
14718	Uniswap V2	1092.8257647488197	2828703.876769	UNKNOWN	UNKNOWN	2024-01-11	\N
14719	Uniswap V2	831.341768519364	1863916.537941	UNKNOWN	UNKNOWN	2024-01-29	\N
14720	Uniswap V2	624.9896631186805	1591394.626988	UNKNOWN	UNKNOWN	2024-01-12	\N
14721	Uniswap V2	895.312967093348	1977679.228208	UNKNOWN	UNKNOWN	2024-01-21	\N
14722	Uniswap V2	360.9161507154762	926874.53385	UNKNOWN	UNKNOWN	2024-01-14	\N
14723	Uniswap V2	902.2661161795342	1949781.933058	UNKNOWN	UNKNOWN	2024-01-08	\N
14754	Binance	942.4262015120565	2120378.117548	WETH	USDT	2024-01-01	\N
14755	Binance	964.8101551904937	2184988.14302	WETH	USDT	2024-01-02	\N
14756	Binance	2023.9646709316212	4623519.100103	WETH	USDT	2024-01-03	\N
14757	Binance	1006.8721665442811	2300401.144982	WETH	USDT	2024-01-04	\N
14758	Binance	848.2419134030895	1928026.356438	WETH	USDT	2024-01-05	\N
14759	Binance	930.9883760837002	2035279.709889	WETH	USDT	2024-01-06	\N
14760	Binance	875.8973224662734	1914792.234412	WETH	USDT	2024-01-07	\N
14761	Binance	902.2661161795342	1949781.933058	WETH	USDT	2024-01-08	\N
14762	Binance	1216.6719328253498	2737949.02623	WETH	USDT	2024-01-09	\N
14763	Binance	888	2154147.175662	WETH	USDT	2024-01-10	\N
14764	Binance	1092.8257647488197	2828703.876769	WETH	USDT	2024-01-11	\N
14765	Binance	624.9896631186805	1591394.626988	WETH	USDT	2024-01-12	\N
14766	Binance	1999.9969942690839	5075118.519448	WETH	USDT	2024-01-13	\N
14767	Binance	360.9161507154762	926874.53385	WETH	USDT	2024-01-14	\N
14768	Binance	467.61501867192953	1109046.91405	WETH	USDT	2024-01-15	\N
14769	Binance	400	1023435.298769	WETH	USDT	2024-01-16	\N
14770	Binance	936.0853564262388	2334376.357084	WETH	USDT	2024-01-17	\N
14771	Binance	614.841782950925	1493594.639788	WETH	USDT	2024-01-18	\N
14772	Binance	1074.3181419586338	2691583.551145	WETH	USDT	2024-01-19	\N
14773	Binance	409.3580305054223	1046454.258394	WETH	USDT	2024-01-20	\N
14774	Binance	895.312967093348	1977679.228208	WETH	USDT	2024-01-21	\N
14775	Binance	917.9711858401405	2339469.10343	WETH	USDT	2024-01-22	\N
14776	Binance	849.0910093989172	1801461.760233	WETH	USDT	2024-01-23	\N
14777	Binance	1426.273886966705	3103397.501168	WETH	USDT	2024-01-24	\N
14778	Binance	601.5791	1325321.339968	WETH	USDT	2024-01-25	\N
14779	Binance	716.4	1611725.107975	WETH	USDT	2024-01-26	\N
14780	Binance	758.5520908068547	1663416.192138	WETH	USDT	2024-01-27	\N
14781	Binance	433.33281103843547	998704.14048	WETH	USDT	2024-01-28	\N
14782	Binance	831.341768519364	1863916.537941	WETH	USDT	2024-01-29	\N
14783	Binance	672.7532613211856	1513668.423084	WETH	USDT	2024-01-30	\N
14784	Uniswap V2	1006.8721665442811	2300401.144982	WETH	USDT	2024-01-04	\N
14785	Uniswap V2	758.5520908068547	1663416.192138	WETH	USDT	2024-01-27	\N
14786	Uniswap V2	601.5791	1325321.339968	WETH	USDT	2024-01-25	\N
14787	Uniswap V2	936.0853564262388	2334376.357084	WETH	USDT	2024-01-17	\N
14788	Uniswap V2	930.9883760837002	2035279.709889	WETH	USDT	2024-01-06	\N
\.


--
-- Name: price_analysis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.price_analysis_id_seq', 31, true);


--
-- Name: swaps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.swaps_id_seq', 14823, true);


--
-- Name: price_analysis price_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_analysis
    ADD CONSTRAINT price_analysis_pkey PRIMARY KEY (id);


--
-- Name: swaps swaps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swaps
    ADD CONSTRAINT swaps_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

