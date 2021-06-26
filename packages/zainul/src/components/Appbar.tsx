import React from "react";
import { AppBar as MuiAppBar, Typography, IconButton, Grid } from "@material-ui/core";
import { IoIosNotifications } from "react-icons/io";
import { RiUser3Line } from "react-icons/ri";
import { useHistory } from "react-router-dom";

function Appbar() {
    const history = useHistory();

    return (
        <MuiAppBar style={{ padding: 5 }} position="sticky" color="default" elevation={0}>
            <Grid container direction="row" justify="space-between" alignItems="center">
                <Typography
                    onClick={() => history.push("/")}
                    style={{ cursor: "pointer" }}
                    variant="h5"
                >
                    VESchool
                </Typography>
                {/* Action Button */}
                <Grid>
                    <IconButton>
                        <IoIosNotifications />
                    </IconButton>
                    <IconButton>
                        <RiUser3Line />
                    </IconButton>
                </Grid>
            </Grid>
        </MuiAppBar>
    );
}

export default Appbar;
