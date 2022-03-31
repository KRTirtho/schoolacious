import React from 'react';
import { NextLayoutPage } from 'pages/_app';
import { Sidebar } from 'components/pages/school/configure/Sidebar';

const ManageInvitations: NextLayoutPage = () => {
  return <div>Manage Invitations</div>;
};

ManageInvitations.getLayout = (page) => {
  return <Sidebar>{page}</Sidebar>;
};

export default ManageInvitations;
