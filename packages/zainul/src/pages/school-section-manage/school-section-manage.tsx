import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { BackButton } from "components/BackButton/BackButton";
import React from "react";
import SchoolSectionClasses from "./components/SchoolSectionClasses";
import SchoolSectionMembers from "./components/SchoolSectionMembers";

function SchoolSectionManage() {
    return (
        <>
            <BackButton />
            <Tabs variant="enclosed" isFitted>
                <TabList>
                    <Tab>Members</Tab>
                    <Tab>Classes</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SchoolSectionMembers />
                    </TabPanel>
                    <TabPanel>
                        <SchoolSectionClasses />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
}

export default SchoolSectionManage;
