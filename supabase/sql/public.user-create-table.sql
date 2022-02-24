CREATE TABLE "user" (
	id uuid NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	firstname varchar NOT NULL,
	lastname varchar NOT NULL,
	role_id uuid NULL,
	CONSTRAINT user_pkey PRIMARY KEY (id)
);


ALTER TABLE public."user" ADD CONSTRAINT user_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);
ALTER TABLE public."user" ADD CONSTRAINT user_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id);