import React from 'react';
import { NextLayoutPage } from 'pages/_app';
import { Sidebar } from 'components/pages/school/configure/Sidebar';

const ManageSubjects: NextLayoutPage = () => {
  return <div>Manage Subjects</div>;
};

ManageSubjects.getLayout = (page) => {
  return <Sidebar>{page}</Sidebar>;
};

export default ManageSubjects;
