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
  VALUES ('admin',  'password', '123token', 'test@example.com', '@venmouser');

INSERT INTO properties (name, street, city, state, zipcode, user_id)
  VALUES ('Zion', '123 Zion', 'here', 'CO', '80011', 1),
         ('Ash', '456 St', 'here', 'CO', '80211', 1),
         ('Thorn', '879 St', 'here', 'CO', '82211', 1);
