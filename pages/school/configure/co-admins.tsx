import React from 'react';
import { NextLayoutPage } from 'pages/_app';
import { Sidebar } from 'components/pages/school/configure/Sidebar';

const ManageCoAdmins: NextLayoutPage = () => {
  return <div>Manage Co Admin(s)</div>;
};

ManageCoAdmins.getLayout = (page) => {
  return <Sidebar>{page}</Sidebar>;
};

export default ManageCoAdmins;
