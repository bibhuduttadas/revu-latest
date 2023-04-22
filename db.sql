--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)

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

--
-- Name: AccountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccountType" AS ENUM (
    'savings',
    'current'
);


ALTER TYPE public."AccountType" OWNER TO postgres;

--
-- Name: AddressType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AddressType" AS ENUM (
    'residential',
    'commercial'
);


ALTER TYPE public."AddressType" OWNER TO postgres;

--
-- Name: ApplicableSex; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApplicableSex" AS ENUM (
    'male',
    'female',
    'other',
    'unisex',
    'all'
);


ALTER TYPE public."ApplicableSex" OWNER TO postgres;

--
-- Name: AppointmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AppointmentStatus" AS ENUM (
    'upcoming',
    'ongoing',
    'completed',
    'cancelled',
    'rejected'
);


ALTER TYPE public."AppointmentStatus" OWNER TO postgres;

--
-- Name: BannerActionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BannerActionType" AS ENUM (
    'salon',
    'webview',
    'other'
);


ALTER TYPE public."BannerActionType" OWNER TO postgres;

--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DiscountType" AS ENUM (
    'flat',
    'percent'
);


ALTER TYPE public."DiscountType" OWNER TO postgres;

--
-- Name: EntityStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EntityStatus" AS ENUM (
    'created',
    'verified',
    'disabled',
    'trashed'
);


ALTER TYPE public."EntityStatus" OWNER TO postgres;

--
-- Name: EntityType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EntityType" AS ENUM (
    'user',
    'salon',
    'employee',
    'service',
    'serviceCategory',
    'optedService'
);


ALTER TYPE public."EntityType" OWNER TO postgres;

--
-- Name: FileType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FileType" AS ENUM (
    'image'
);


ALTER TYPE public."FileType" OWNER TO postgres;

--
-- Name: OptedServiceAvailability; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OptedServiceAvailability" AS ENUM (
    'available',
    'temporaryUnavailable',
    'unavailable'
);


ALTER TYPE public."OptedServiceAvailability" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'created',
    'fulfilling',
    'fulfilled',
    'rejected'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'pending',
    'paid',
    'refunded',
    'failed'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: Permission; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Permission" AS ENUM (
    'canCreate',
    'canUpdate',
    'canDelete'
);


ALTER TYPE public."Permission" OWNER TO postgres;

--
-- Name: RatingType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RatingType" AS ENUM (
    'overall',
    'service',
    'cleanliness',
    'staffBehaviour',
    'valueForMoney'
);


ALTER TYPE public."RatingType" OWNER TO postgres;

--
-- Name: RestrictionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RestrictionType" AS ENUM (
    'only',
    'include',
    'exclude'
);


ALTER TYPE public."RestrictionType" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'customer',
    'merchant',
    'employee',
    'admin'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: SalonCategorizationCriteria; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SalonCategorizationCriteria" AS ENUM (
    'top',
    'popular'
);


ALTER TYPE public."SalonCategorizationCriteria" OWNER TO postgres;

--
-- Name: ServiceStyleType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ServiceStyleType" AS ENUM (
    'trending',
    'retro',
    'modern',
    'indian',
    'western'
);


ALTER TYPE public."ServiceStyleType" OWNER TO postgres;

--
-- Name: ServiceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ServiceType" AS ENUM (
    'standard',
    'additional'
);


ALTER TYPE public."ServiceType" OWNER TO postgres;

--
-- Name: Sex; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Sex" AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE public."Sex" OWNER TO postgres;

--
-- Name: TimeSlotAvailability; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TimeSlotAvailability" AS ENUM (
    'available',
    'occupied',
    'temporaryUnavailable',
    'unavailable'
);


ALTER TYPE public."TimeSlotAvailability" OWNER TO postgres;

--
-- Name: TransactionChannel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionChannel" AS ENUM (
    'cash',
    'digitalWallet',
    'upi',
    'card'
);


ALTER TYPE public."TransactionChannel" OWNER TO postgres;

--
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'pending',
    'completed',
    'failed'
);


ALTER TYPE public."TransactionStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Address" (
    id integer NOT NULL,
    name text,
    type public."AddressType" DEFAULT 'commercial'::public."AddressType" NOT NULL,
    line1 text NOT NULL,
    line2 text,
    city text NOT NULL,
    state text,
    "countryCode" text DEFAULT 'IN'::text NOT NULL,
    "postCode" text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    phone text
);


ALTER TABLE public."Address" OWNER TO postgres;

--
-- Name: Address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Address_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Address_id_seq" OWNER TO postgres;

--
-- Name: Address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Address_id_seq" OWNED BY public."Address".id;


--
-- Name: Appointment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Appointment" (
    id integer NOT NULL,
    "appointmentId" text NOT NULL,
    "customerId" integer,
    "salonId" integer,
    "startsAt" timestamp(3) without time zone NOT NULL,
    "endsAt" timestamp(3) without time zone,
    otp text,
    status public."AppointmentStatus" DEFAULT 'upcoming'::public."AppointmentStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Appointment" OWNER TO postgres;

--
-- Name: AppointmentSlot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AppointmentSlot" (
    id integer NOT NULL,
    "appointmentId" integer NOT NULL,
    "optedServiceId" integer,
    "employeeId" integer,
    "startsAt" timestamp(3) without time zone,
    "endsAt" timestamp(3) without time zone,
    note text
);


ALTER TABLE public."AppointmentSlot" OWNER TO postgres;

--
-- Name: AppointmentSlot_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AppointmentSlot_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AppointmentSlot_id_seq" OWNER TO postgres;

--
-- Name: AppointmentSlot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AppointmentSlot_id_seq" OWNED BY public."AppointmentSlot".id;


--
-- Name: Appointment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Appointment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Appointment_id_seq" OWNER TO postgres;

--
-- Name: Appointment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Appointment_id_seq" OWNED BY public."Appointment".id;


--
-- Name: BankAccount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BankAccount" (
    id integer NOT NULL,
    "accountNumber" text NOT NULL,
    "accountHolderName" text,
    type public."AccountType",
    "bankName" text NOT NULL,
    "branchName" text NOT NULL,
    ifsc text NOT NULL
);


ALTER TABLE public."BankAccount" OWNER TO postgres;

--
-- Name: BankAccount_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BankAccount_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."BankAccount_id_seq" OWNER TO postgres;

--
-- Name: BankAccount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BankAccount_id_seq" OWNED BY public."BankAccount".id;


--
-- Name: Banner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Banner" (
    id integer NOT NULL,
    "imageId" integer NOT NULL,
    "applicableSex" public."ApplicableSex" NOT NULL,
    "actionType" public."BannerActionType" NOT NULL,
    "resourceId" integer,
    "resourceURI" text
);


ALTER TABLE public."Banner" OWNER TO postgres;

--
-- Name: Banner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Banner_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Banner_id_seq" OWNER TO postgres;

--
-- Name: Banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Banner_id_seq" OWNED BY public."Banner".id;


--
-- Name: Coupon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Coupon" (
    id integer NOT NULL,
    code text NOT NULL,
    description text,
    "discountType" public."DiscountType" NOT NULL,
    amount numeric(10,2) NOT NULL,
    "minPurchaseAmount" numeric(10,2),
    "maxPurchaseAmount" numeric(10,2),
    "individualUse" boolean DEFAULT false NOT NULL,
    "usageLimit" integer,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    status public."EntityStatus" DEFAULT 'created'::public."EntityStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Coupon" OWNER TO postgres;

--
-- Name: Coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Coupon_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Coupon_id_seq" OWNER TO postgres;

--
-- Name: Coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Coupon_id_seq" OWNED BY public."Coupon".id;


--
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: Customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Customer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Customer_id_seq" OWNER TO postgres;

--
-- Name: Customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Customer_id_seq" OWNED BY public."Customer".id;


--
-- Name: Employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Employee" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "salonId" integer NOT NULL,
    "designationId" integer NOT NULL,
    "experienceYears" integer,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Employee" OWNER TO postgres;

--
-- Name: EmployeeDesignation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmployeeDesignation" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    "applicableSex" public."ApplicableSex" NOT NULL
);


ALTER TABLE public."EmployeeDesignation" OWNER TO postgres;

--
-- Name: EmployeeDesignation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EmployeeDesignation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EmployeeDesignation_id_seq" OWNER TO postgres;

--
-- Name: EmployeeDesignation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EmployeeDesignation_id_seq" OWNED BY public."EmployeeDesignation".id;


--
-- Name: Employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Employee_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Employee_id_seq" OWNER TO postgres;

--
-- Name: Employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Employee_id_seq" OWNED BY public."Employee".id;


--
-- Name: File; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."File" (
    id integer NOT NULL,
    name text NOT NULL,
    type public."FileType" NOT NULL,
    title text,
    "mimeType" text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public."File" OWNER TO postgres;

--
-- Name: File_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."File_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."File_id_seq" OWNER TO postgres;

--
-- Name: File_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."File_id_seq" OWNED BY public."File".id;


--
-- Name: FilesCollection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FilesCollection" (
    id integer NOT NULL,
    title text,
    description text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FilesCollection" OWNER TO postgres;

--
-- Name: FilesCollection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FilesCollection_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."FilesCollection_id_seq" OWNER TO postgres;

--
-- Name: FilesCollection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FilesCollection_id_seq" OWNED BY public."FilesCollection".id;


--
-- Name: Merchant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Merchant" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    aadhar text
);


ALTER TABLE public."Merchant" OWNER TO postgres;

--
-- Name: Merchant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Merchant_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Merchant_id_seq" OWNER TO postgres;

--
-- Name: Merchant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Merchant_id_seq" OWNED BY public."Merchant".id;


--
-- Name: OptedService; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OptedService" (
    id integer NOT NULL,
    "salonId" integer NOT NULL,
    "serviceId" integer NOT NULL,
    price numeric(10,2) NOT NULL,
    "durationSeconds" integer NOT NULL,
    availability public."OptedServiceAvailability" DEFAULT 'available'::public."OptedServiceAvailability" NOT NULL
);


ALTER TABLE public."OptedService" OWNER TO postgres;

--
-- Name: OptedService_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OptedService_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OptedService_id_seq" OWNER TO postgres;

--
-- Name: OptedService_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OptedService_id_seq" OWNED BY public."OptedService".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    type text,
    "appointmentId" integer,
    total numeric(12,2) NOT NULL,
    tax numeric(10,2),
    discount numeric(10,2),
    "billingAddressId" integer,
    note text,
    "paymentStatus" public."PaymentStatus" DEFAULT 'pending'::public."PaymentStatus" NOT NULL,
    status public."OrderStatus" DEFAULT 'created'::public."OrderStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "appointmentSlotId" integer,
    price numeric(10,2) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    note text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OrderItem_id_seq" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Order_id_seq" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Rating" (
    id integer NOT NULL,
    type public."RatingType" NOT NULL,
    "starCount" integer NOT NULL,
    "parentId" integer,
    "reviewId" integer,
    "customerId" integer,
    "orderItemId" integer,
    status public."EntityStatus" DEFAULT 'created'::public."EntityStatus" NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Rating" OWNER TO postgres;

--
-- Name: Rating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Rating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Rating_id_seq" OWNER TO postgres;

--
-- Name: Rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Rating_id_seq" OWNED BY public."Rating".id;


--
-- Name: Restriction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Restriction" (
    id integer NOT NULL,
    type public."RestrictionType" NOT NULL,
    "customerId" integer,
    "salonId" integer,
    "employeeId" integer,
    "serviceId" integer,
    "categoryId" integer,
    "couponId" integer
);


ALTER TABLE public."Restriction" OWNER TO postgres;

--
-- Name: Restriction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Restriction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Restriction_id_seq" OWNER TO postgres;

--
-- Name: Restriction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Restriction_id_seq" OWNED BY public."Restriction".id;


--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id integer NOT NULL,
    title text,
    comment text NOT NULL,
    "galleryId" integer,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: Review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Review_id_seq" OWNER TO postgres;

--
-- Name: Review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Review_id_seq" OWNED BY public."Review".id;


--
-- Name: Salon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Salon" (
    id integer NOT NULL,
    name text NOT NULL,
    about text NOT NULL,
    "openHours" text NOT NULL,
    "applicableSex" public."ApplicableSex" NOT NULL,
    "coverImageId" integer,
    "imageGalleryId" integer,
    website text,
    "addressId" integer,
    pan text,
    gst text,
    "bankAccountId" integer,
    "ownerId" integer NOT NULL,
    status public."EntityStatus" DEFAULT 'created'::public."EntityStatus" NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Salon" OWNER TO postgres;

--
-- Name: SalonCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SalonCategory" (
    id integer NOT NULL,
    "salonId" integer NOT NULL,
    criteria public."SalonCategorizationCriteria" NOT NULL
);


ALTER TABLE public."SalonCategory" OWNER TO postgres;

--
-- Name: SalonCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SalonCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SalonCategory_id_seq" OWNER TO postgres;

--
-- Name: SalonCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SalonCategory_id_seq" OWNED BY public."SalonCategory".id;


--
-- Name: Salon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Salon_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Salon_id_seq" OWNER TO postgres;

--
-- Name: Salon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Salon_id_seq" OWNED BY public."Salon".id;


--
-- Name: Service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Service" (
    id integer NOT NULL,
    name text NOT NULL,
    type public."ServiceType" DEFAULT 'standard'::public."ServiceType" NOT NULL,
    description text,
    "applicableSex" public."ApplicableSex" NOT NULL,
    "defaultPrice" numeric(10,2),
    "defaultDurationSeconds" integer,
    "imageId" integer,
    styles public."ServiceStyleType"[],
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Service" OWNER TO postgres;

--
-- Name: ServiceCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceCategory" (
    id integer NOT NULL,
    name text NOT NULL,
    "imageId" integer,
    "bgColor" text NOT NULL,
    "applicableSex" public."ApplicableSex" NOT NULL,
    "parentId" integer,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ServiceCategory" OWNER TO postgres;

--
-- Name: ServiceCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServiceCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ServiceCategory_id_seq" OWNER TO postgres;

--
-- Name: ServiceCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServiceCategory_id_seq" OWNED BY public."ServiceCategory".id;


--
-- Name: ServicePackage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServicePackage" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "imageId" integer,
    price numeric(10,2) NOT NULL,
    "durationSeconds" integer NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ServicePackage" OWNER TO postgres;

--
-- Name: ServicePackage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServicePackage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ServicePackage_id_seq" OWNER TO postgres;

--
-- Name: ServicePackage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServicePackage_id_seq" OWNED BY public."ServicePackage".id;


--
-- Name: Service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Service_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Service_id_seq" OWNER TO postgres;

--
-- Name: Service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Service_id_seq" OWNED BY public."Service".id;


--
-- Name: ServiceableCity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceableCity" (
    id integer NOT NULL,
    city text NOT NULL,
    state text
);


ALTER TABLE public."ServiceableCity" OWNER TO postgres;

--
-- Name: ServiceableCity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServiceableCity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ServiceableCity_id_seq" OWNER TO postgres;

--
-- Name: ServiceableCity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServiceableCity_id_seq" OWNED BY public."ServiceableCity".id;


--
-- Name: TimeSlot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TimeSlot" (
    id integer NOT NULL,
    start time without time zone NOT NULL,
    "end" time without time zone NOT NULL,
    availability public."TimeSlotAvailability" NOT NULL,
    "employeeId" integer NOT NULL,
    note text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TimeSlot" OWNER TO postgres;

--
-- Name: TimeSlot_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TimeSlot_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."TimeSlot_id_seq" OWNER TO postgres;

--
-- Name: TimeSlot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TimeSlot_id_seq" OWNED BY public."TimeSlot".id;


--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    id integer NOT NULL,
    "transactionId" text,
    channel public."TransactionChannel" NOT NULL,
    amount numeric(10,2) NOT NULL,
    "orderId" integer,
    "isReverse" boolean DEFAULT false NOT NULL,
    note text,
    status public."TransactionStatus" DEFAULT 'pending'::public."TransactionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO postgres;

--
-- Name: Transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Transaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Transaction_id_seq" OWNER TO postgres;

--
-- Name: Transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Transaction_id_seq" OWNED BY public."Transaction".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text,
    gender public."Sex" NOT NULL,
    mobile text NOT NULL,
    password text,
    email text,
    role public."Role" DEFAULT 'customer'::public."Role" NOT NULL,
    "profileImageId" integer,
    "loginOTP" text,
    "loginOTPExpiresAt" timestamp(3) without time zone,
    status public."EntityStatus" DEFAULT 'created'::public."EntityStatus" NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _CustomerToSalon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_CustomerToSalon" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_CustomerToSalon" OWNER TO postgres;

--
-- Name: _EmployeeToOptedService; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_EmployeeToOptedService" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_EmployeeToOptedService" OWNER TO postgres;

--
-- Name: _FileToFilesCollection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_FileToFilesCollection" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_FileToFilesCollection" OWNER TO postgres;

--
-- Name: _OptedServiceToServicePackage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_OptedServiceToServicePackage" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_OptedServiceToServicePackage" OWNER TO postgres;

--
-- Name: _SalonToServiceCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_SalonToServiceCategory" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_SalonToServiceCategory" OWNER TO postgres;

--
-- Name: _ServiceToServiceCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ServiceToServiceCategory" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_ServiceToServiceCategory" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Address id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address" ALTER COLUMN id SET DEFAULT nextval('public."Address_id_seq"'::regclass);


--
-- Name: Appointment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment" ALTER COLUMN id SET DEFAULT nextval('public."Appointment_id_seq"'::regclass);


--
-- Name: AppointmentSlot id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppointmentSlot" ALTER COLUMN id SET DEFAULT nextval('public."AppointmentSlot_id_seq"'::regclass);


--
-- Name: BankAccount id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankAccount" ALTER COLUMN id SET DEFAULT nextval('public."BankAccount_id_seq"'::regclass);


--
-- Name: Banner id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Banner" ALTER COLUMN id SET DEFAULT nextval('public."Banner_id_seq"'::regclass);


--
-- Name: Coupon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Coupon" ALTER COLUMN id SET DEFAULT nextval('public."Coupon_id_seq"'::regclass);


--
-- Name: Customer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer" ALTER COLUMN id SET DEFAULT nextval('public."Customer_id_seq"'::regclass);


--
-- Name: Employee id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee" ALTER COLUMN id SET DEFAULT nextval('public."Employee_id_seq"'::regclass);


--
-- Name: EmployeeDesignation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeDesignation" ALTER COLUMN id SET DEFAULT nextval('public."EmployeeDesignation_id_seq"'::regclass);


--
-- Name: File id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File" ALTER COLUMN id SET DEFAULT nextval('public."File_id_seq"'::regclass);


--
-- Name: FilesCollection id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FilesCollection" ALTER COLUMN id SET DEFAULT nextval('public."FilesCollection_id_seq"'::regclass);


--
-- Name: Merchant id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Merchant" ALTER COLUMN id SET DEFAULT nextval('public."Merchant_id_seq"'::regclass);


--
-- Name: OptedService id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OptedService" ALTER COLUMN id SET DEFAULT nextval('public."OptedService_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: Rating id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating" ALTER COLUMN id SET DEFAULT nextval('public."Rating_id_seq"'::regclass);


--
-- Name: Restriction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Restriction" ALTER COLUMN id SET DEFAULT nextval('public."Restriction_id_seq"'::regclass);


--
-- Name: Review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review" ALTER COLUMN id SET DEFAULT nextval('public."Review_id_seq"'::regclass);


--
-- Name: Salon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salon" ALTER COLUMN id SET DEFAULT nextval('public."Salon_id_seq"'::regclass);


--
-- Name: SalonCategory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalonCategory" ALTER COLUMN id SET DEFAULT nextval('public."SalonCategory_id_seq"'::regclass);


--
-- Name: Service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service" ALTER COLUMN id SET DEFAULT nextval('public."Service_id_seq"'::regclass);


--
-- Name: ServiceCategory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCategory" ALTER COLUMN id SET DEFAULT nextval('public."ServiceCategory_id_seq"'::regclass);


--
-- Name: ServicePackage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServicePackage" ALTER COLUMN id SET DEFAULT nextval('public."ServicePackage_id_seq"'::regclass);


--
-- Name: ServiceableCity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceableCity" ALTER COLUMN id SET DEFAULT nextval('public."ServiceableCity_id_seq"'::regclass);


--
-- Name: TimeSlot id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TimeSlot" ALTER COLUMN id SET DEFAULT nextval('public."TimeSlot_id_seq"'::regclass);


--
-- Name: Transaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction" ALTER COLUMN id SET DEFAULT nextval('public."Transaction_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Address" (id, name, type, line1, line2, city, state, "countryCode", "postCode", latitude, longitude, phone) FROM stdin;
3	Modern Salon Main Address	commercial	93, Bamroli Road	Krishna Nagar	Ahmedabad	Gujarat	IN	234208	21.14310000	72.84310000	\N
4	Styloo Bhubaneswar	commercial	Patia Chowk, Chandrasekharpur	\N	Bhubaneswar	Odisha	IN	751024	20.34282700	85.82230500	\N
5	Ansari Salon Main Address	commercial	93, Kanan Vihar Phase 2	Patia	Bhubaneswar	Odisha	IN	751024	20.35330000	85.82660000	\N
6	Glamzone Salon Main Address	commercial	93, Kanan Vihar Phase 2	Patia	Bhubaneswar	Odisha	IN	751024	20.35330000	85.82660000	\N
7	Lakme Salon Main Address	commercial	93, Kanan Vihar Phase 2	Patia	Bhubaneswar	Odisha	IN	751024	20.35330000	85.82660000	\N
\.


--
-- Data for Name: Appointment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Appointment" (id, "appointmentId", "customerId", "salonId", "startsAt", "endsAt", otp, status, "createdAt", "updatedAt") FROM stdin;
1	AP23423432237	1	2	2022-12-27 21:00:34.769	2022-12-27 21:30:34.739	826879	upcoming	2022-12-27 15:28:24.986	2022-12-27 15:28:24.986
3	AP23423432238	1	2	1970-01-01 21:00:34.769	1970-01-01 21:30:34.739	349468	upcoming	2022-12-28 17:08:49.12	2022-12-28 17:08:49.12
\.


--
-- Data for Name: AppointmentSlot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AppointmentSlot" (id, "appointmentId", "optedServiceId", "employeeId", "startsAt", "endsAt", note) FROM stdin;
1	1	3	1	2022-12-27 21:00:34.769	2022-12-27 21:30:34.739	\N
2	3	3	1	1970-01-01 21:00:34.769	1970-01-01 21:30:34.739	\N
\.


--
-- Data for Name: BankAccount; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BankAccount" (id, "accountNumber", "accountHolderName", type, "bankName", "branchName", ifsc) FROM stdin;
3	10402200170088	Modern Salon	current	Bank of Baroda	Main Surat Branch	BOBA0001049
4	33278369667	Styloo Unisex	current	State Bank Of India	Patia	SBIN0010420
5	30731687770	Ansari Salon	current	State Bank Of India	Main Bazaar Branch	SBIN0001081
6	30731687770	Ansari Salon	current	State Bank Of India	Main Bazaar Branch	SBIN0001081
7	30731687770	Lakme Salon	current	State Bank Of India	Main Bazaar Branch	SBIN0001081
\.


--
-- Data for Name: Banner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Banner" (id, "imageId", "applicableSex", "actionType", "resourceId", "resourceURI") FROM stdin;
1	20	unisex	webview	1	https://www.google.com/
2	20	male	webview	1	https://www.google.com/
\.


--
-- Data for Name: Coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Coupon" (id, code, description, "discountType", amount, "minPurchaseAmount", "maxPurchaseAmount", "individualUse", "usageLimit", "usageCount", "expiresAt", status, "createdAt", "updatedAt") FROM stdin;
5	SPECIAL30	30% off on min spend value of 2000.	percent	50.00	100.00	\N	t	3	0	2022-09-15 19:26:34.769	created	2022-11-29 18:50:32.591	2022-11-29 18:50:32.591
6	SPECIAL50	50% off on min spend value of 50.	percent	50.00	50.00	\N	t	3	0	2023-09-15 19:26:34.769	created	2022-11-29 18:57:34.258	2022-11-29 18:57:34.258
7	SPECIAL20	20% off on min spend value of 100.	percent	20.00	100.00	\N	t	3	0	2023-09-15 19:26:34.769	created	2022-11-29 18:58:38.351	2022-11-29 18:58:38.351
9	OFFER30	30% off on min spend value of 2000.	percent	30.00	2000.00	\N	f	20	0	2023-09-15 19:26:34.769	created	2023-01-26 09:56:17.392	2023-01-26 09:56:17.392
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, "userId") FROM stdin;
1	14
2	15
\.


--
-- Data for Name: Employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Employee" (id, "userId", "salonId", "designationId", "experienceYears", "updatedAt") FROM stdin;
1	3	2	1	5	2022-09-21 17:51:12.221
2	4	2	1	5	2022-09-21 17:52:33.1
3	5	2	2	2	2022-09-21 17:55:04.049
\.


--
-- Data for Name: EmployeeDesignation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmployeeDesignation" (id, title, description, "applicableSex") FROM stdin;
1	Hair Stylist	Person responsible for styling hairs.	unisex
2	Facial Specialist	Person responsible for styling hairs.	unisex
3	Spa Specialist	Person responsible for styling hairs.	unisex
5	Beard Stylist	Person responsible for styling Beards.	unisex
\.


--
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."File" (id, name, type, title, "mimeType", "updatedAt", "userId") FROM stdin;
1	file-1663086396005_880307003.jpg	image	Banner	image/jpeg	2022-09-13 16:26:37.101	\N
2	file-1663090049872_634613175.png	image	Hair Banner	image/png	2022-09-13 17:27:37.049	\N
3	file-1663090264618_785302169.png	image	Hair Banner	image/png	2022-09-13 17:31:06.61	\N
4	file-1663259740700_626466726.jpg	image	spyke_img	image/jpeg	2022-09-15 16:35:41.312	\N
5	file-1663259862129_159321590.jpg	image	salon_img1	image/jpeg	2022-09-15 16:37:43.532	\N
6	file-1663259898240_254999606.jpg	image	salon_img2	image/jpeg	2022-09-15 16:38:20.832	\N
7	file-1663259916589_472058423.jpg	image	salon_img3	image/jpeg	2022-09-15 16:38:38.315	\N
8	file-1663259936171_160665997.jpg	image	salon_img4	image/jpeg	2022-09-15 16:38:57.44	\N
9	file-1663260463197_300923242.png	image	hair_care	image/png	2022-09-15 16:47:43.667	\N
10	file-1663260483150_754854637.png	image	face_care	image/png	2022-09-15 16:48:03.366	\N
11	file-1663260889350_603589188.png	image	face_care_female	image/png	2022-09-15 16:54:49.556	\N
12	file-1663261071890_717634907.jpg	image	Hair Cut	image/jpeg	2022-09-15 16:57:52.656	\N
13	file-1663261107302_94603325.jpg	image	Spyke Cut	image/jpeg	2022-09-15 16:58:27.523	\N
14	file-1663261143224_946144148.jpeg	image	Face Wash	image/jpeg	2022-09-15 16:59:07.738	\N
15	file-1663261157353_287118988.jpeg	image	Face Bleach	image/jpeg	2022-09-15 16:59:20.382	\N
16	file-1663307535657_132271600.png	image	facial	image/png	2022-09-16 05:52:17.812	\N
17	file-1663307881416_944157910.jpg	image	facewash_women	image/jpeg	2022-09-16 05:58:38.645	\N
18	file-1669314178290_642142278.jpg	image	"salon banner"	image/jpeg	2022-11-24 18:23:04.472	\N
19	file-1669314207646_897386269.jpg	image	salon banner	image/jpeg	2022-11-24 18:23:31.676	\N
20	file-1670954840663_144646692.jpg	image	banner image	image/jpeg	2022-12-13 18:07:22.234	\N
21	file-1670954893791_372514322.jpg	image	banner image	image/jpeg	2022-12-13 18:08:15.437	\N
\.


--
-- Data for Name: FilesCollection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FilesCollection" (id, title, description, "updatedAt") FROM stdin;
1	Salon Gallery	This is an image gallery of a salon.	2022-09-13 17:31:22.465
2	Salon Gallery	This is an image gallery of a salon.	2022-09-15 16:40:08.81
3	Salon Gallery	This is an image gallery of a salon.	2022-12-13 18:57:37.615
4	Salim Salon Gallery	This is an image gallery of a Salim's Salon.	2022-12-18 09:56:31.705
\.


--
-- Data for Name: Merchant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Merchant" (id, "userId", aadhar) FROM stdin;
1	1	762988881782
2	2	443433446767
4	10	123456789012
6	18	123123123123
\.


--
-- Data for Name: OptedService; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OptedService" (id, "salonId", "serviceId", price, "durationSeconds", availability) FROM stdin;
3	2	3	99.00	1800	available
4	2	4	149.00	1800	available
5	2	5	299.00	2700	available
6	2	6	30.00	1800	available
7	2	7	30.00	1800	available
8	4	3	30.00	3600	available
9	1	3	20.00	3600	available
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, type, "appointmentId", total, tax, discount, "billingAddressId", note, "paymentStatus", status, "createdAt", "updatedAt") FROM stdin;
1	\N	1	120.00	10.00	10.00	\N	\N	pending	created	2022-12-27 15:34:53.988	2022-12-27 15:34:53.988
2	\N	3	120.00	10.00	10.00	\N	\N	pending	created	2022-12-28 17:13:08.554	2022-12-28 17:13:08.554
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "appointmentSlotId", price, quantity, note, "updatedAt") FROM stdin;
1	2	\N	120.00	1	\N	2022-12-29 11:41:06.752
\.


--
-- Data for Name: Rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Rating" (id, type, "starCount", "parentId", "reviewId", "customerId", "orderItemId", status, "updatedAt") FROM stdin;
1	overall	4	\N	5	1	1	created	2022-12-29 11:49:23.103
2	cleanliness	5	\N	6	1	1	created	2022-12-29 11:50:31.373
\.


--
-- Data for Name: Restriction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Restriction" (id, type, "customerId", "salonId", "employeeId", "serviceId", "categoryId", "couponId") FROM stdin;
5	only	1	\N	\N	\N	\N	5
6	only	1	\N	\N	\N	\N	6
7	include	\N	2	\N	\N	\N	6
8	only	1	2	\N	\N	\N	7
11	include	1	\N	\N	\N	\N	9
12	include	2	\N	\N	\N	\N	9
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, title, comment, "galleryId", "updatedAt") FROM stdin;
5	Best Service	This was the best service. some comment to be added	2	2022-12-29 11:49:23.103
6	Best Service2	This was the best service. some comment to be added2	2	2022-12-29 11:50:31.373
\.


--
-- Data for Name: Salon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Salon" (id, name, about, "openHours", "applicableSex", "coverImageId", "imageGalleryId", website, "addressId", pan, gst, "bankAccountId", "ownerId", status, "updatedAt") FROM stdin;
1	Modern Salon	We are in business since 1969. We provide exceptional services.\n	9AM-5PM	unisex	1	1	https://modernsalon.com	3	XAEPM2243P	21XAEPM2243PRZ1	3	1	created	2022-09-13 17:40:44.987
2	Styoo Unisex Salon	We are in business since 1969. We provide exceptional services.\n	10AM-10PM	unisex	5	2	\N	4	HANPS5789K	21XAEPM2243PRZ2	4	1	created	2022-09-16 13:33:50.419
3	Ansari Salon	We bring international salon and spa experience to your neighborhood. Our service list ranges across hair and skin care, touching upon spa and bridal treatments to give you a holistic approach to feeling good.	9AM-9PM	male	1	1	https://ansarisalon.com	5	BZXPA7801G	21XAEPM2243PRZ1	5	4	created	2022-11-24 18:55:52.907
4	Glamzone Salon	We bring international salon and spa experience to your neighborhood. Our service list ranges across hair and skin care, touching upon spa and bridal treatments to give you a holistic approach to feeling good.	9AM-9PM	male	1	1	https://ansarisalon.com	6	BZXPA7801G	21XAEPM2243PRZ1	6	4	created	2022-12-13 18:34:07.228
5	Lakme Salon	We bring international salon and spa experience to your neighborhood. Our service list ranges across hair and skin care, touching upon spa and bridal treatments to give you a holistic approach to feeling good.	9AM-9PM	male	1	4	https://lakmesalons.com	7	BZXPA7801G	21XAEPM2243PRZ1	7	4	created	2022-12-18 10:05:44.6
\.


--
-- Data for Name: SalonCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SalonCategory" (id, "salonId", criteria) FROM stdin;
1	1	top
2	3	top
3	4	top
4	5	top
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, name, type, description, "applicableSex", "defaultPrice", "defaultDurationSeconds", "imageId", styles, "updatedAt") FROM stdin;
3	Normal Hair Cut	standard	This is a normal haircut.	male	80.00	1800	12	\N	2022-09-16 05:30:00.072
4	Spyke Hair Cut	standard	This is a stylish haircut.	male	150.00	1800	13	{trending}	2022-09-16 05:45:23.043
5	Pampo Hair Cut	additional	This is a stylish haircut.	male	200.00	2700	13	{trending}	2022-09-16 05:47:32.463
6	Garnier Facewash	standard	This is a facewash	male	200.00	1800	16	\N	2022-09-16 05:54:58.247
7	Ponds Facewash	standard	This is a facewash	male	150.00	1800	16	\N	2022-09-16 05:55:16.506
8	Garnier Facewash	standard	This is a facewash	female	250.00	1800	17	\N	2022-09-16 06:08:28.926
9	Lakme Facewash	standard	This is a facewash	female	300.00	1800	17	\N	2022-09-16 06:09:01.824
10	Cleanwash Bleach	additional	This is a bleach	male	400.00	3600	14	\N	2022-09-16 06:58:42.58
\.


--
-- Data for Name: ServiceCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceCategory" (id, name, "imageId", "bgColor", "applicableSex", "parentId", "updatedAt") FROM stdin;
3	Hair Care	9	#0000FF	male	\N	2022-09-15 16:50:33.286
4	Hair Care	9	#0000FF	female	\N	2022-09-15 16:52:11.152
5	Face Care	10	#0000FF	male	\N	2022-09-15 16:54:27.999
6	Face Care	11	#0000FF	female	\N	2022-09-15 16:55:19.747
9	Face Wash	14	#000000	male	5	2022-09-15 17:01:52.559
10	Face Bleach	14	#000000	male	5	2022-09-15 17:01:59.878
11	Hair Cut	13	#000000	male	3	2022-09-15 17:04:16.348
13	Face Wash	17	#000000	female	6	2022-09-16 06:05:05.199
\.


--
-- Data for Name: ServicePackage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServicePackage" (id, name, description, "imageId", price, "durationSeconds", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ServiceableCity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceableCity" (id, city, state) FROM stdin;
1	Bangalore	Karnataka
2	Ahmedabad	Gujarat
3	Bhubaneswar	Odisha
4	Cuttack	Odisha
\.


--
-- Data for Name: TimeSlot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TimeSlot" (id, start, "end", availability, "employeeId", note, "updatedAt") FROM stdin;
4	13:26:34.769	19:26:34.769	temporaryUnavailable	2	\N	2022-12-18 15:16:08.46
11	09:00:34.769	22:00:34.769	available	2	\N	2022-12-27 06:50:09.696
12	09:00:34.769	22:00:34.769	available	3	\N	2022-12-27 07:16:31.149
13	09:00:34.769	22:00:34.769	available	1	\N	2022-12-27 15:10:27.663
14	09:00:34.769	22:00:34.769	available	1	\N	2022-12-31 04:56:56.523
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaction" (id, "transactionId", channel, amount, "orderId", "isReverse", note, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "firstName", "lastName", gender, mobile, password, email, role, "profileImageId", "loginOTP", "loginOTPExpiresAt", status, "updatedAt") FROM stdin;
1	Salim	Ansari	male	8338966313	e6c9df8fd4af7a744a2e82befebee47c920d1f1cca054a4150753f71c1c98f108c2acc3388c26bb88831219d13e62c2d43e53b44815c69094c3bea6c233c34b7:2776fe97f3ffb28e033bec652c5a98c1	salim@gmail.com	merchant	1	\N	\N	created	2022-09-13 16:39:42.347
2	Vinod	Sharma	male	9862898720	c5dbc4556898c635e06232711ab10910cca924c6131c76809ed9a3edb450414e584a57fcfea581fca24ec5a84ab62c1fdc17f1ac2d83dc3256e4623b6c72b139:67bcf037fb3e25e234ccace8e2b19c16	vinod@gmail.com	merchant	1	\N	\N	created	2022-09-16 13:09:39.915
3	Rohit	Sharma	male	9658787297	64682cef162401e5fe77518fc206c90ad9f900b23d1fccc5295f06a31b2b902eef944a413bc33559d76cf86146096189b2b7c8b84cf66555a3b1895e1358534b:625b25a1397bf433b590804b5a56fd8b	rohit.sharma@gmail.com	employee	1	\N	\N	created	2022-09-21 17:51:12.221
4	Virat	Kohili	male	6370092021	440ce86dcd98c5c81fdf4e75b41b43f3b5364c9e64407ec521b316b3c7929ef7a16cb99e189ca0299e8f696cd65e4a6bbef5e769f67fc5e0f1f3082d69e42899:26bbcff590b2e61f4b61d846aa440477	kohili@gmail.com	employee	1	\N	\N	created	2022-09-21 17:52:33.1
5	Joy	Sharma	male	9862838720	c3d9c23534633c558fcbdb952e476e2a5615b0553f2fef213b75ee367bb81a7cbe49a33e9c4ee3fff642192529bb64c656f88a9651db7f2d4939743c68de552a:41abd1b8c8ee0ebe1285e63f833bd016	joy@sharma.com	employee	1	\N	\N	created	2022-09-21 17:55:04.049
6	Admin	User	male	9999999999	faa5d08821b96dc0374fbcd1948b363d838cca6c2a9a7fbabc824c2e3cebfdbb6ac52a714138f847d48f30fbc47dabd9681a1f6049e13de89d7f99374d2faf1e:f0792be6873db8055e485e6131fb79b4	admin@gmail.com	admin	\N	\N	\N	created	2022-11-03 11:54:03.291
10	Ansari	Salim	male	6370092021	313523350617064e6d9e6cc97522e434eecae59897107f487ef7a96a20e995f522d0acd9c77ae1c9c39a4576d9d0868c3d7eee85eac389b1c02dac7e0b163231:12d7ced46a8858520e0db39a4dcfaa53	salim@gmail.com	merchant	1	\N	\N	created	2022-11-24 18:37:22.144
15	Bedhua	Raza	male	7438899755	c4c36d5a6f09c421bff412fde0b134936fd101f8c5521624bd926334c5793e73c4e5f9361ae00a3c17ea9633aa39ea1f07f2a652e172cf98c884271b4a68f4c7:dcff8d831e5291b51f7461c4e576f7eb	raz@galua.com	customer	1	\N	\N	created	2022-11-29 19:10:44.726
14	Bibhu	Sharma	male	8338966313	2dd1578748fbab9bb829e67ebe5b40bf518b5ef75954ed5a4b40281fc71f243ec397924c5fb79d41d9dc6784d7d87b59d56de4ce2d85dd4392cb2c42f0275520:731f15676f94cf8d824959d1fce7a8ad	bibhua@galua.com	customer	1	\N	\N	created	2023-01-26 10:09:42.257
18	Aarzoo	Firdaus	female	8847828745	a5070536ddf7e443fb78e603ca118de3558a1d639e0cb6d06783b4e3536dd6ed059d642a56f909002775113435a5b9095546d952dc3b7317f48cd0bb581eaaff:bf6848d99179247dca3f173473f109b4	aarzoo@jeevanbarbaad.com	merchant	1	\N	\N	created	2023-03-19 15:45:04.666
\.


--
-- Data for Name: _CustomerToSalon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_CustomerToSalon" ("A", "B") FROM stdin;
1	2
\.


--
-- Data for Name: _EmployeeToOptedService; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_EmployeeToOptedService" ("A", "B") FROM stdin;
1	3
1	4
2	3
2	4
2	5
3	6
3	7
\.


--
-- Data for Name: _FileToFilesCollection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_FileToFilesCollection" ("A", "B") FROM stdin;
1	1
2	1
3	1
5	2
6	2
7	2
8	2
1	3
2	3
3	3
1	4
2	4
3	4
\.


--
-- Data for Name: _OptedServiceToServicePackage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_OptedServiceToServicePackage" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _SalonToServiceCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_SalonToServiceCategory" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _ServiceToServiceCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ServiceToServiceCategory" ("A", "B") FROM stdin;
3	11
4	11
5	11
6	9
7	9
8	13
9	13
10	10
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.


--
-- Name: Address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Address_id_seq"', 7, true);


--
-- Name: AppointmentSlot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AppointmentSlot_id_seq"', 2, true);


--
-- Name: Appointment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Appointment_id_seq"', 3, true);


--
-- Name: BankAccount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BankAccount_id_seq"', 7, true);


--
-- Name: Banner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Banner_id_seq"', 2, true);


--
-- Name: Coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Coupon_id_seq"', 9, true);


--
-- Name: Customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Customer_id_seq"', 2, true);


--
-- Name: EmployeeDesignation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EmployeeDesignation_id_seq"', 5, true);


--
-- Name: Employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Employee_id_seq"', 6, true);


--
-- Name: File_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."File_id_seq"', 21, true);


--
-- Name: FilesCollection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FilesCollection_id_seq"', 4, true);


--
-- Name: Merchant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Merchant_id_seq"', 6, true);


--
-- Name: OptedService_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OptedService_id_seq"', 9, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 1, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 7, true);


--
-- Name: Rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Rating_id_seq"', 2, true);


--
-- Name: Restriction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Restriction_id_seq"', 12, true);


--
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Review_id_seq"', 6, true);


--
-- Name: SalonCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SalonCategory_id_seq"', 4, true);


--
-- Name: Salon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Salon_id_seq"', 5, true);


--
-- Name: ServiceCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServiceCategory_id_seq"', 13, true);


--
-- Name: ServicePackage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServicePackage_id_seq"', 1, false);


--
-- Name: Service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Service_id_seq"', 10, true);


--
-- Name: ServiceableCity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServiceableCity_id_seq"', 4, true);


--
-- Name: TimeSlot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TimeSlot_id_seq"', 14, true);


--
-- Name: Transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Transaction_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 18, true);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: AppointmentSlot AppointmentSlot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppointmentSlot"
    ADD CONSTRAINT "AppointmentSlot_pkey" PRIMARY KEY (id);


--
-- Name: Appointment Appointment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY (id);


--
-- Name: BankAccount BankAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankAccount"
    ADD CONSTRAINT "BankAccount_pkey" PRIMARY KEY (id);


--
-- Name: Banner Banner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Banner"
    ADD CONSTRAINT "Banner_pkey" PRIMARY KEY (id);


--
-- Name: Coupon Coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Coupon"
    ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: EmployeeDesignation EmployeeDesignation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeDesignation"
    ADD CONSTRAINT "EmployeeDesignation_pkey" PRIMARY KEY (id);


--
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY (id);


--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- Name: FilesCollection FilesCollection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FilesCollection"
    ADD CONSTRAINT "FilesCollection_pkey" PRIMARY KEY (id);


--
-- Name: Merchant Merchant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Merchant"
    ADD CONSTRAINT "Merchant_pkey" PRIMARY KEY (id);


--
-- Name: OptedService OptedService_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OptedService"
    ADD CONSTRAINT "OptedService_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Rating Rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_pkey" PRIMARY KEY (id);


--
-- Name: Restriction Restriction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Restriction"
    ADD CONSTRAINT "Restriction_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: SalonCategory SalonCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalonCategory"
    ADD CONSTRAINT "SalonCategory_pkey" PRIMARY KEY (id);


--
-- Name: Salon Salon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salon"
    ADD CONSTRAINT "Salon_pkey" PRIMARY KEY (id);


--
-- Name: ServiceCategory ServiceCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCategory"
    ADD CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY (id);


--
-- Name: ServicePackage ServicePackage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServicePackage"
    ADD CONSTRAINT "ServicePackage_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: ServiceableCity ServiceableCity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceableCity"
    ADD CONSTRAINT "ServiceableCity_pkey" PRIMARY KEY (id);


--
-- Name: TimeSlot TimeSlot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TimeSlot"
    ADD CONSTRAINT "TimeSlot_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Appointment_appointmentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Appointment_appointmentId_key" ON public."Appointment" USING btree ("appointmentId");


--
-- Name: Customer_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Customer_userId_key" ON public."Customer" USING btree ("userId");


--
-- Name: EmployeeDesignation_title_applicableSex_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EmployeeDesignation_title_applicableSex_key" ON public."EmployeeDesignation" USING btree (title, "applicableSex");


--
-- Name: Employee_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Employee_userId_key" ON public."Employee" USING btree ("userId");


--
-- Name: Merchant_aadhar_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Merchant_aadhar_key" ON public."Merchant" USING btree (aadhar);


--
-- Name: Merchant_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Merchant_userId_key" ON public."Merchant" USING btree ("userId");


--
-- Name: OptedService_salonId_serviceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OptedService_salonId_serviceId_key" ON public."OptedService" USING btree ("salonId", "serviceId");


--
-- Name: OrderItem_appointmentSlotId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OrderItem_appointmentSlotId_key" ON public."OrderItem" USING btree ("appointmentSlotId");


--
-- Name: Order_appointmentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_appointmentId_key" ON public."Order" USING btree ("appointmentId");


--
-- Name: Rating_reviewId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Rating_reviewId_key" ON public."Rating" USING btree ("reviewId");


--
-- Name: Rating_type_orderItemId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Rating_type_orderItemId_key" ON public."Rating" USING btree (type, "orderItemId");


--
-- Name: SalonCategory_salonId_criteria_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SalonCategory_salonId_criteria_key" ON public."SalonCategory" USING btree ("salonId", criteria);


--
-- Name: Salon_addressId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Salon_addressId_key" ON public."Salon" USING btree ("addressId");


--
-- Name: Salon_bankAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Salon_bankAccountId_key" ON public."Salon" USING btree ("bankAccountId");


--
-- Name: ServiceableCity_city_state_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ServiceableCity_city_state_key" ON public."ServiceableCity" USING btree (city, state);


--
-- Name: User_mobile_role_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_mobile_role_key" ON public."User" USING btree (mobile, role);


--
-- Name: _CustomerToSalon_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_CustomerToSalon_AB_unique" ON public."_CustomerToSalon" USING btree ("A", "B");


--
-- Name: _CustomerToSalon_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_CustomerToSalon_B_index" ON public."_CustomerToSalon" USING btree ("B");


--
-- Name: _EmployeeToOptedService_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_EmployeeToOptedService_AB_unique" ON public."_EmployeeToOptedService" USING btree ("A", "B");


--
-- Name: _EmployeeToOptedService_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_EmployeeToOptedService_B_index" ON public."_EmployeeToOptedService" USING btree ("B");


--
-- Name: _FileToFilesCollection_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_FileToFilesCollection_AB_unique" ON public."_FileToFilesCollection" USING btree ("A", "B");


--
-- Name: _FileToFilesCollection_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_FileToFilesCollection_B_index" ON public."_FileToFilesCollection" USING btree ("B");


--
-- Name: _OptedServiceToServicePackage_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_OptedServiceToServicePackage_AB_unique" ON public."_OptedServiceToServicePackage" USING btree ("A", "B");


--
-- Name: _OptedServiceToServicePackage_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_OptedServiceToServicePackage_B_index" ON public."_OptedServiceToServicePackage" USING btree ("B");


--
-- Name: _SalonToServiceCategory_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_SalonToServiceCategory_AB_unique" ON public."_SalonToServiceCategory" USING btree ("A", "B");


--
-- Name: _SalonToServiceCategory_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_SalonToServiceCategory_B_index" ON public."_SalonToServiceCategory" USING btree ("B");


--
-- Name: _ServiceToServiceCategory_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_ServiceToServiceCategory_AB_unique" ON public."_ServiceToServiceCategory" USING btree ("A", "B");


--
-- Name: _ServiceToServiceCategory_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ServiceToServiceCategory_B_index" ON public."_ServiceToServiceCategory" USING btree ("B");


--
-- Name: AppointmentSlot AppointmentSlot_appointmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppointmentSlot"
    ADD CONSTRAINT "AppointmentSlot_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES public."Appointment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AppointmentSlot AppointmentSlot_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppointmentSlot"
    ADD CONSTRAINT "AppointmentSlot_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AppointmentSlot AppointmentSlot_optedServiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppointmentSlot"
    ADD CONSTRAINT "AppointmentSlot_optedServiceId_fkey" FOREIGN KEY ("optedServiceId") REFERENCES public."OptedService"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Appointment Appointment_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Appointment Appointment_salonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES public."Salon"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Banner Banner_imageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Banner"
    ADD CONSTRAINT "Banner_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Customer Customer_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Employee Employee_designationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES public."EmployeeDesignation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Employee Employee_salonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES public."Salon"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Employee Employee_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: File File_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Merchant Merchant_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Merchant"
    ADD CONSTRAINT "Merchant_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OptedService OptedService_salonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OptedService"
    ADD CONSTRAINT "OptedService_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES public."Salon"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OptedService OptedService_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OptedService"
    ADD CONSTRAINT "OptedService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_appointmentSlotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_appointmentSlotId_fkey" FOREIGN KEY ("appointmentSlotId") REFERENCES public."AppointmentSlot"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_appointmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES public."Appointment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_billingAddressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Rating Rating_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Rating Rating_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public."OrderItem"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Rating Rating_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Rating"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Rating Rating_reviewId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES public."Review"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Restriction Restriction_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Restriction"
    ADD CONSTRAINT "Restriction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Restriction Restriction_couponId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Restriction"
    ADD CONSTRAINT "Restriction_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES public."Coupon"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Restriction Restriction_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Restriction"
    ADD CONSTRAINT "Restriction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Restriction Restriction_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Restriction"
    ADD CONSTRAINT "Restriction_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Restriction Restriction_salonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Restriction"
    ADD CONSTRAINT "Restriction_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES public."Salon"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Restriction Restriction_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Restriction"
    ADD CONSTRAINT "Restriction_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_galleryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES public."FilesCollection"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SalonCategory SalonCategory_salonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalonCategory"
    ADD CONSTRAINT "SalonCategory_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES public."Salon"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Salon Salon_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salon"
    ADD CONSTRAINT "Salon_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Salon Salon_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salon"
    ADD CONSTRAINT "Salon_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public."BankAccount"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Salon Salon_coverImageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salon"
    ADD CONSTRAINT "Salon_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Salon Salon_imageGalleryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salon"
    ADD CONSTRAINT "Salon_imageGalleryId_fkey" FOREIGN KEY ("imageGalleryId") REFERENCES public."FilesCollection"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Salon Salon_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salon"
    ADD CONSTRAINT "Salon_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Merchant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServiceCategory ServiceCategory_imageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCategory"
    ADD CONSTRAINT "ServiceCategory_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceCategory ServiceCategory_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCategory"
    ADD CONSTRAINT "ServiceCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServicePackage ServicePackage_imageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServicePackage"
    ADD CONSTRAINT "ServicePackage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Service Service_imageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TimeSlot TimeSlot_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TimeSlot"
    ADD CONSTRAINT "TimeSlot_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transaction Transaction_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_profileImageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _CustomerToSalon _CustomerToSalon_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CustomerToSalon"
    ADD CONSTRAINT "_CustomerToSalon_A_fkey" FOREIGN KEY ("A") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CustomerToSalon _CustomerToSalon_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CustomerToSalon"
    ADD CONSTRAINT "_CustomerToSalon_B_fkey" FOREIGN KEY ("B") REFERENCES public."Salon"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _EmployeeToOptedService _EmployeeToOptedService_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_EmployeeToOptedService"
    ADD CONSTRAINT "_EmployeeToOptedService_A_fkey" FOREIGN KEY ("A") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _EmployeeToOptedService _EmployeeToOptedService_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_EmployeeToOptedService"
    ADD CONSTRAINT "_EmployeeToOptedService_B_fkey" FOREIGN KEY ("B") REFERENCES public."OptedService"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _FileToFilesCollection _FileToFilesCollection_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_FileToFilesCollection"
    ADD CONSTRAINT "_FileToFilesCollection_A_fkey" FOREIGN KEY ("A") REFERENCES public."File"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _FileToFilesCollection _FileToFilesCollection_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_FileToFilesCollection"
    ADD CONSTRAINT "_FileToFilesCollection_B_fkey" FOREIGN KEY ("B") REFERENCES public."FilesCollection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _OptedServiceToServicePackage _OptedServiceToServicePackage_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_OptedServiceToServicePackage"
    ADD CONSTRAINT "_OptedServiceToServicePackage_A_fkey" FOREIGN KEY ("A") REFERENCES public."OptedService"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _OptedServiceToServicePackage _OptedServiceToServicePackage_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_OptedServiceToServicePackage"
    ADD CONSTRAINT "_OptedServiceToServicePackage_B_fkey" FOREIGN KEY ("B") REFERENCES public."ServicePackage"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _SalonToServiceCategory _SalonToServiceCategory_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_SalonToServiceCategory"
    ADD CONSTRAINT "_SalonToServiceCategory_A_fkey" FOREIGN KEY ("A") REFERENCES public."Salon"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _SalonToServiceCategory _SalonToServiceCategory_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_SalonToServiceCategory"
    ADD CONSTRAINT "_SalonToServiceCategory_B_fkey" FOREIGN KEY ("B") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ServiceToServiceCategory _ServiceToServiceCategory_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ServiceToServiceCategory"
    ADD CONSTRAINT "_ServiceToServiceCategory_A_fkey" FOREIGN KEY ("A") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ServiceToServiceCategory _ServiceToServiceCategory_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ServiceToServiceCategory"
    ADD CONSTRAINT "_ServiceToServiceCategory_B_fkey" FOREIGN KEY ("B") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

