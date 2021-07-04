import React from "react";
import { Flex, ButtonGroup, Button } from "@chakra-ui/react";
import { loginBG } from "../../assets";
import Login from "./components/Login";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import Signup from "./components/Signup";
import Paper from "../../components/Paper/Paper";

function Auth() {
    const match = useRouteMatch();
    const history = useHistory();

    return (
        <Flex
            bgPos="top"
            bgSize="cover"
            h="100vh"
            bgImage={`url(${loginBG})`}
            justify="center"
            alignItems="center"
        >
            <Paper>
                <Flex p="3" direction="column" alignItems="stretch">
                    <ButtonGroup isAttached>
                        <Button
                            onClick={() => history.push(match.path)}
                            variant={
                                new RegExp(`${match.path}[/]?$`, "g").exec(
                                    location.pathname,
                                )
                                    ? "solid"
                                    : "outline"
                            }
                            isFullWidth
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => history.push(`${match.path}/signup`)}
                            variant={
                                location.pathname === `${match.path}/signup`
                                    ? "solid"
                                    : "outline"
                            }
                            isFullWidth
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
                </Flex>
            </Paper>
        </Flex>
    );
}

export default Auth;
