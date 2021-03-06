DROP DATABASE IF EXISTS rental_app;
CREATE DATABASE rental_app;

\c rental_app;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE, 
  password TEXT NOT NULL,
  oauth_token TEXT, 
  email TEXT,
  venmo TEXT
);

CREATE TABLE properties (
  ID SERIAL PRIMARY KEY,
  street TEXT,
  city TEXT,
  state TEXT,
  zipcode TEXT,
  active BOOLEAN,
  rent FLOAT,  
  user_id INTEGER references users(id) 
);

CREATE TABLE tenants (
  ID SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  venmo TEXT,
  active BOOLEAN,
  property_id INTEGER references properties(id)
);

CREATE TABLE bills (
  ID SERIAL PRIMARY KEY,
  type TEXT,
  date DATE,
  amount FLOAT,
  shared BOOLEAN,
  property_id INTEGER references properties(id)
);

CREATE TABLE tenant_bills (
  ID SERIAL PRIMARY KEY,
  split_amount FLOAT,
  status TEXT,
  date DATE,
  tenant_id INTEGER references tenants(id)
);