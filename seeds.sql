\c rental_app;

TRUNCATE users CASCADE;
TRUNCATE properties CASCADE;
TRUNCATE tenants CASCADE;
TRUNCATE rent CASCADE;
TRUNCATE bills CASCADE;
TRUNCATE tenant_bills CASCADE;

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE properties_id_seq RESTART WITH 1;
ALTER SEQUENCE tenants_id_seq RESTART WITH 1;
ALTER SEQUENCE rent_id_seq RESTART WITH 1;
ALTER SEQUENCE bills_id_seq RESTART WITH 1;
ALTER SEQUENCE tenant_bills_id_seq RESTART WITH 1;

INSERT INTO users (username, password, oauth_token, email, venmo)
  VALUES ('lee',  'blah', 'blerg', 'test@example.com', '@venmouser');

INSERT INTO properties (name, street, city, state, zipcode, user_id)
  VALUES ('Zion', '123 Zion', 'here', 'CO', '80011', 1),
         ('Ash', '456 St', 'here', 'CO', '80211', 1),
         ('Thorn', '879 St', 'here', 'CO', '82211', 1);

INSERT INTO bills (type, date, amount, property_id)
  VALUES ('Water', '2018-06-24', 50, 1),
          ('Xfinity', '2018-06-24', 61.85, 1),
          ('Xcel Energy', '2018-06-24', 71.35, 1);

INSERT INTO tenants (first_name, last_name, email, phone, venmo) 
  VALUES ('Lee', 'Chow', 'test@gmail.com', '720-123-4567', 'LEEvenmo'),
        ('John', 'Peacock', 'John@gmail.com', '720-123-4567', 'JOHNvenmo'),
        ('Tom', 'King', 'Tom@gmail.com', '720-123-4567', 'TOMvenmo'),
        ('Ilona', 'Hoang', 'Ilona@gmail.com', '720-123-4567', 'ILONAvenmo');

INSERT INTO rent (amount, status, property_id, tenant_id)
  VALUES (650, 'unpaid', 1, 1),
          (650, 'unpaid', 1, 2),
          (650, 'unpaid', 1, 3),
          (650, 'unpaid', 1, 4);

INSERT INTO tenant_bills (split_amount, status, tenant_id) 
  VALUES (null, 'unpaid', 1),
          (null, 'unpaid', 2),
          (null, 'unpaid', 3),
          (null, 'unpaid', 4);


