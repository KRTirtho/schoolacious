import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { confusedKid404 } from "../configurations/img-imports";

function NotFound404() {
    return (
        <Grid container alignItems="center" direction="column">
            <Typography variant="h2">404</Typography>
            <Typography variant="h4">Not Found</Typography>
            <img
                style={{ maxWidth: "10rem", height: "auto" }}
                src={confusedKid404}
                alt="Confused?"
            />
            <Typography color="textSecondary">
                Oops, sorry. The page isn't available
            </Typography>
            <br />
            <Button component={Link} to="/">
                Back to Home
            </Button>
        </Grid>
    );
}

export default NotFound404;
