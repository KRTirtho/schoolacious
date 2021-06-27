import { Button, Grid, Typography, SvgIcon } from "@material-ui/core";
import React from "react";
import { lonelyKid } from "../configurations/img-imports";
import { FaSchool, FaUserGraduate } from "react-icons/fa";
import { Link } from "react-router-dom";

function NoSchool() {
    return (
        <Grid container direction="column" alignItems="center" justify="center">
            <img
                style={{ maxWidth: "15rem", height: "auto" }}
                src={lonelyKid}
                draggable={false}
                alt="Don't be alone"
            />
            <Typography style={{ margin: "50px 0" }} color="textSecondary" variant="h6">
                You haven't joined a school yet
            </Typography>
            <Grid container justify="center" wrap="wrap" alignItems="center">
                <Button
                    component={Link}
                    variant="outlined"
                    startIcon={
                        <SvgIcon>
                            <FaSchool />
                        </SvgIcon>
                    }
                    to="/school/create"
                >
                    Create a School
                </Button>
                <Button
                    style={{ marginLeft: 10 }}
                    variant="outlined"
                    endIcon={
                        <SvgIcon>
                            <FaUserGraduate />
                        </SvgIcon>
                    }
                >
                    Join a School
                </Button>
            </Grid>
        </Grid>
    );
}

export default NoSchool;
