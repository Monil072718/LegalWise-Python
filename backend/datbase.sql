CREATE TABLE admins (
	id VARCHAR NOT NULL, 
	email VARCHAR UNIQUE, 
	hashed_password VARCHAR, 
	role VARCHAR DEFAULT 'admin', 
	name VARCHAR, 
	"createdAt" VARCHAR, 
	PRIMARY KEY (id)
);
-- 2. Lawyers Table
CREATE TABLE lawyers (
	id VARCHAR NOT NULL, 
	name VARCHAR, 
	email VARCHAR UNIQUE, 
	hashed_password VARCHAR, 
	role VARCHAR DEFAULT 'lawyer', 
	status VARCHAR, 
	specialization JSONB, 
	experience INTEGER, 
	rating FLOAT, 
	"casesHandled" INTEGER, 
	availability VARCHAR, 
	verified BOOLEAN DEFAULT FALSE, 
	"createdAt" VARCHAR, 
	documents JSONB, 
	phone VARCHAR, 
	address VARCHAR, 
	bio VARCHAR, 
	PRIMARY KEY (id)
);
-- 3. Clients Table
CREATE TABLE clients (
	id VARCHAR NOT NULL, 
	name VARCHAR, 
	email VARCHAR UNIQUE, 
	role VARCHAR DEFAULT 'client', 
	status VARCHAR, 
	consultations INTEGER, 
	"booksDownloaded" INTEGER, 
	"articlesRead" INTEGER, 
	"totalSpent" FLOAT, 
	"createdAt" VARCHAR, 
	avatar VARCHAR, 
	phone VARCHAR, 
	address VARCHAR, 
	company VARCHAR, 
	notes VARCHAR, 
	PRIMARY KEY (id)
);
-- 4. Cases Table
CREATE TABLE cases (
	id VARCHAR NOT NULL, 
	title VARCHAR, 
	"clientId" VARCHAR, 
	"lawyerId" VARCHAR, 
	status VARCHAR, 
	stage VARCHAR, 
	priority VARCHAR, 
	"createdAt" VARCHAR, 
	"nextHearing" VARCHAR, 
	description VARCHAR, 
	documents JSONB, 
	PRIMARY KEY (id)
);
-- 5. Appointments Table
CREATE TABLE appointments (
	id VARCHAR NOT NULL, 
	"clientName" VARCHAR, 
	"lawyerName" VARCHAR, 
	date VARCHAR, 
	time VARCHAR, 
	type VARCHAR, 
	status VARCHAR, 
	notes VARCHAR, 
	PRIMARY KEY (id)
);
-- 6. Payments Table
CREATE TABLE payments (
	id VARCHAR NOT NULL, 
	"clientName" VARCHAR, 
	"lawyerName" VARCHAR, 
	amount FLOAT, 
	type VARCHAR, 
	status VARCHAR, 
	date VARCHAR, 
	"platformFee" FLOAT, 
	PRIMARY KEY (id)
);
-- 7. Books Table
CREATE TABLE books (
	id VARCHAR NOT NULL, 
	title VARCHAR, 
	author VARCHAR, 
	category VARCHAR, 
	price FLOAT, 
	downloads INTEGER, 
	rating FLOAT, 
	"publishedAt" VARCHAR, 
	PRIMARY KEY (id)
);
-- 8. Articles Table
CREATE TABLE articles (
	id VARCHAR NOT NULL, 
	title VARCHAR, 
	author VARCHAR, 
	category VARCHAR, 
	views INTEGER, 
	likes INTEGER, 
	"publishedAt" VARCHAR, 
	status VARCHAR, 
	PRIMARY KEY (id)
);
-- 9. Password Resets Table
CREATE TABLE password_resets (
	id SERIAL NOT NULL, 
	email VARCHAR, 
	otp VARCHAR, 
	expires_at VARCHAR, 
	PRIMARY KEY (id)
);
