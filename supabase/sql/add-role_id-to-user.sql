ALTER TABLE auth.users
ADD
  COLUMN role_id uuid NOT NULL,
ADD
  CONSTRAINT "fk_user_role" FOREIGN KEY (role_id) REFERENCES roles(id);