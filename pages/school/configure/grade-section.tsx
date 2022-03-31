import { Sidebar } from 'components/pages/school/configure/Sidebar';
import { NextLayoutPage } from 'pages/_app';
import React from 'react';

const ConfigureGradeSection: NextLayoutPage = () => {
  return <div>ConfigureGradeSection</div>;
};

ConfigureGradeSection.getLayout = (page) => {
  return <Sidebar>{page}</Sidebar>;
};

export default ConfigureGradeSection;
