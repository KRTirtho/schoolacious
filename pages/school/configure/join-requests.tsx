import React from 'react';
import { NextLayoutPage } from 'pages/_app';
import { Sidebar } from 'components/pages/school/configure/Sidebar';

const ManageJoinRequests: NextLayoutPage = () => {
  return <div>Manage Join Requests</div>;
};

ManageJoinRequests.getLayout = (page) => {
  return <Sidebar>{page}</Sidebar>;
};

export default ManageJoinRequests;
