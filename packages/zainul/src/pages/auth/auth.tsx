import React from "react";
import { Flex, ButtonGroup, Button } from "@chakra-ui/react";
import { loginBG } from "assets";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Paper from "components/Paper/Paper";

function Auth() {
    const location = useLocation();
    const navigate = useNavigate();

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
                            onClick={() => navigate("/auth")}
                            variant={
                                window.location.pathname === "/auth" ? "solid" : "outline"
                            }
                            isFullWidth
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => navigate(`/auth/signup`)}
                            variant={
                                location.pathname === "/auth/signup" ? "solid" : "outline"
                            }
                            isFullWidth
                        >
                            Signup
                        </Button>
                    </ButtonGroup>
                    <Outlet />
                </Flex>
            </Paper>
        </Flex>
    );
}

export default Auth;
