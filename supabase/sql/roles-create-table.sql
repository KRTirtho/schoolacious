CREATE TABLE roles (
  id UUID DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc' :: text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc' :: text, now()) NOT NULL,
  owner_id UUID NOT NULL REFERENCES school(id),
  "name" VARCHAR(50) NOT NULL,
  scoped_grade_id uuid NULL,
  scoped_section_id uuid NULL,
  scoped_class_id uuid NULL,
  "description" TEXT,
  permissions VARCHAR(20) ARRAY NOT NULL,
  CONSTRAINT "cpk_roles" PRIMARY KEY (id)
);

ALTER TABLE
  roles
ADD
  CONSTRAINT "cck_roles_permissions" CHECK (
    -- checks whether array contains either of following permissions
    "permissions" && '{
      "school:modify",
      "grade:create", "grade:modify", "grade:delete",
      "section:create", "section:modify", "section:delete",
      "class:create", "class:modify", "class:delete"
    }'
  );

ALTER TABLE
  roles
ADD
  CONSTRAINT "cuq_roles" UNIQUE (owner_id, "name");

ALTER TABLE
  roles
ADD
  CONSTRAINT "cuq_roles_scoped_grade" UNIQUE (owner_id, "name", scoped_grade_id);

ALTER TABLE
  roles
ADD
  CONSTRAINT "cuq_roles_scoped_grade_section" UNIQUE (owner_id, "name", scoped_grade_id, scoped_section_id);

ALTER TABLE
  roles
ADD
  CONSTRAINT "cuq_roles_scoped_grade_section_class" UNIQUE (owner_id, "name", scoped_grade_id, scoped_section_id, scoped_class_id);

ALTER TABLE
  roles
ADD
  CONSTRAINT "CFK_roles_scoped_grade" FOREIGN KEY(scoped_grade_id) REFERENCES grade(id);

ALTER TABLE
  roles
ADD
  CONSTRAINT "CFK_roles_scoped_section" FOREIGN KEY(scoped_section_id) REFERENCES section(id);

ALTER TABLE
  roles
ADD
  CONSTRAINT "CFK_roles_scoped_class" FOREIGN KEY(scoped_class_id) REFERENCES class(id);