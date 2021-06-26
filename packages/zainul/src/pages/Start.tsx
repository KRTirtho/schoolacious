import { Grid } from "@material-ui/core";
import React from "react";
import NoSchool from "../components/NoSchool";
import useAuthorization from "../hooks/useAuthorization";

function Start() {
    const { user } = useAuthorization();

    return <Grid container>{!user?.school && <NoSchool />}</Grid>;
}

export default Start;
