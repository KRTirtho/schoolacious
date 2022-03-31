import { HStack, Accordion, VStack } from '@chakra-ui/react';
import AddGradeModal from 'components/pages/school/configure/grade-section/AddGradeModal';
import AddSectionModal from 'components/pages/school/configure/grade-section/AddSectionModal';
import GradeAccordion from 'components/pages/school/configure/grade-section/GradeAccordion';
import { Sidebar } from 'components/pages/school/configure/Sidebar';
import { QueryContextKey } from 'configs/enums';
import { NextLayoutPage } from 'pages/_app';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { GradeSchema, titumir } from 'services/titumir';
import { useUserMeta } from 'services/titumir-hooks/useUserMeta';

const ConfigureGradeSection: NextLayoutPage = () => {
  const { data: userMeta } = useUserMeta();
  const { data: grades } = useQuery<GradeSchema[] | null>(
    QueryContextKey.GRADES,
    async () => {
      const res = await titumir.grade.list({
        eq: { owner_id: userMeta?.school?.id },
      });
      return res.data;
    }
  );

  const standards = useMemo(
    () => grades?.map(({ standard }) => standard),
    [grades]
  );

  return (
    <>
      <HStack justify="space-evenly">
        <AddGradeModal grades={standards} />
        <AddSectionModal grades={standards} />
      </HStack>
      <Accordion allowMultiple allowToggle>
        <VStack spacing="1" align="center">
          {grades?.map((grade) => (
            <GradeAccordion grade={grade} key={grade.id} />
          ))}
        </VStack>
      </Accordion>
    </>
  );
};

export interface SchoolSectionMembersParams {
  grade: string;
  section: string;
}

ConfigureGradeSection.getLayout = (page) => {
  return <Sidebar>{page}</Sidebar>;
};

export default ConfigureGradeSection;
