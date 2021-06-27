import { Container, Grid, SvgIcon, Typography } from "@material-ui/core";
import React from "react";
import CreateSchoolForm from "../components/CreateSchoolForm";
import { FaSchool } from "react-icons/fa";

function SchoolCreate() {
    return (
        <Container>
            <Grid container direction="column" alignItems="center">
                <Typography variant="h5" gutterBottom>
                    <SvgIcon color="primary">
                        <FaSchool />
                    </SvgIcon>{" "}
                    Create a School
                </Typography>
                <CreateSchoolForm />
            </Grid>
        </Container>
    );
}

export default SchoolCreate;
