CREATE TYPE NotificationStatus AS ENUM ('unread', 'read', 'viewed');
CREATE TYPE NotificationScope AS ENUM ('school', 'grade', 'section', 'class', 'user');
CREATE TABLE IF NOT EXISTS notifications (
  id uuid default uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  message TEXT NOT NULL,
  status NotificationStatus NOT NULL DEFAULT 'unread',
  scope NotificationScope NOT NULL,
  -- relation of the owner to the owner table
  scoped_school_id uuid REFERENCES school(id),
  scoped_grade_id uuid REFERENCES grade(id),
  scoped_section_id uuid REFERENCES grade(id),
  scoped_class_id uuid REFERENCES class(id),
  -- Direct owner id. Can be any table's id/pk
  owner_id uuid NOT NULL,
  -- if broadcast then the entire scope's user's are recivers
  -- it won't work for NotificationScope.user (effectless)
  is_broadcast BOOLEAN NOT NULL DEFAULT FALSE,
  -- when its a private notification that can only be
  -- shared among certain selected users
  -- If recievers are defined & not empty then is_broadcast will
  -- neglected. In the case of NotificationScope.user the length
  -- can be only 1
  recievers uuid [],
  PRIMARY KEY(id),
  CONSTRAINT cck_notification_scope_user_has_one_reciever CHECK (
    scope = 'user'
    AND array_length(recievers, 1) = 1
  ),
  CONSTRAINT cck_is_broadcast_recievers_should_be_null CHECK (
    is_broadcast IS TRUE
    AND recievers IS NULL
  ),
  CONSTRAINT cck_recievers_is_broadcast_should_be_null CHECK (
    array_length(recievers, 1) > 0
    AND is_broadcast IS FALSE
  ),
  CONSTRAINT cck_scope_school_has_reference_id CHECK (
    scope = 'school'
    AND scoped_school_id IS NOT NULL
    AND scoped_grade_id IS NULL
    AND scoped_section_id IS NULL
    AND scoped_class_id IS NULL
  ),
  CONSTRAINT cck_scope_grade_has_reference_id CHECK (
    scope = 'grade'
    AND scoped_grade_id IS NOT NULL
    AND scoped_section_id IS NULL
    AND scoped_class_id IS NULL
    AND scoped_school_id IS NULL
  ),
  CONSTRAINT cck_scope_section_has_reference_id CHECK (
    scope = 'section'
    AND scoped_section_id IS NOT NULL
    AND scoped_grade_id IS NULL
    AND scoped_class_id IS NULL
    AND scoped_school_id IS NULL
  ),
  CONSTRAINT cck_scope_class_has_reference_id CHECK (
    scope = 'class'
    AND scoped_class_id IS NOT NULL
    AND scoped_section_id IS NULL
    AND scoped_grade_id IS NULL
    AND scoped_school_id IS NULL
  ),
)