import React from "react";
import { Grid, Paper, ButtonGroup, Button } from "@material-ui/core";
import { loginBG } from "../configurations/img-imports";
import Login from "../components/Login";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import Signup from "../components/Signup";

function Auth() {
    const match = useRouteMatch();
    const history = useHistory();

    return (
        <Grid
            container
            style={{
                backgroundImage: `url(${loginBG})`,
                backgroundPosition: "top",
                backgroundSize: "cover",
                height: "100vh",
            }}
            justify="center"
            alignItems="center"
        >
            <Paper>
                <Grid
                    style={{ padding: 30 }}
                    container
                    direction="column"
                    alignItems="stretch"
                >
                    <ButtonGroup fullWidth>
                        <Button
                            onClick={() => history.push(match.path)}
                            variant={
                                new RegExp(`${match.path}[/]?$`, "g").exec(
                                    location.pathname,
                                )
                                    ? "contained"
                                    : "outlined"
                            }
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => history.push(`${match.path}/signup`)}
                            variant={
                                location.pathname === `${match.path}/signup`
                                    ? "contained"
                                    : "outlined"
                            }
                        >
                            Signup
                        </Button>
                    </ButtonGroup>
                    <Route exact path={`${match.path}/`}>
                        <Login />
                    </Route>
                    <Route exact path={`${match.path}/signup`}>
                        <Signup />
                    </Route>
                </Grid>
            </Paper>
        </Grid>
    );
}

export default Auth;
