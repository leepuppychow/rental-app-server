\c rental_app;

TRUNCATE users CASCADE;
TRUNCATE properties CASCADE;
TRUNCATE tenants CASCADE;
TRUNCATE bills CASCADE;
TRUNCATE tenant_bills CASCADE;

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE properties_id_seq RESTART WITH 1;
ALTER SEQUENCE tenants_id_seq RESTART WITH 1;
ALTER SEQUENCE bills_id_seq RESTART WITH 1;
ALTER SEQUENCE tenant_bills_id_seq RESTART WITH 1;

INSERT INTO users (username, password, oauth_token, email, venmo)
  VALUES ('lee', '$argon2i$v=19$m=4096,t=3,p=1$qwXZetUPnFFI6o8KMiOixQ$AQwryPRyHWVBwfPz9uJec3N0xJRT6cpJzhfvYWPxAIY', 'blerg', 'test@example.com', '@venmouser');

INSERT INTO properties (street, city, state, zipcode, user_id, active)
  VALUES ('3000 Zion', 'here', 'CO', '80011', 1, true),
         ('456 St', 'here', 'CO', '80211', 1, true),
         ('879 St', 'here', 'CO', '82211', 1, true);

INSERT INTO bills (type, date, amount, shared, property_id)
  VALUES ('Water', '2018-07-01', 50, true, 1),
          ('Xfinity', '2018-07-20', 61.85, true, 1),
          ('Xcel Energy', '2018-07-20', 71.35, true, 1),
          ('Trash', '2018-07-20', 71.35, false, 1);

INSERT INTO tenants (first_name, last_name, email, phone, venmo, active) 
  VALUES ('Lee', 'C', 'lee+1@devetry.com', '720-123-4567', 'LEEvenmo', true),
        ('John', 'P', 'lee+2@devetry.com', '720-123-4567', 'JOHNvenmo', true),
        ('Tom', 'K', 'lee+3@devetry.com', '720-123-4567', 'TOMvenmo', true),
        ('Ilona', 'H', 'lee+4@devetry.com', '720-123-4567', 'ILONAvenmo', true);

INSERT INTO rooms (name, rent, sq_ft, property_id, tenant_id)
  VALUES ('My MASTER room', 0, 800, 1, 1),
        ('Downstairs Tenant', 725, 350, 1, 2),
        ('Upstairs Front', 650, 350, 1, 3),
        ('Upstairs Back', 650, 350, 1, 4);

INSERT INTO tenant_bills (split_amount, status, tenant_id, date) 
  VALUES (null, 'unpaid', 1, '2018-07-01'),
          (null, 'unpaid', 2, '2018-07-01'),
          (null, 'unpaid', 3, '2018-07-01'),
          (null, 'unpaid', 4, '2018-07-01');


