import { Flex, Heading, Button, Link as MuiLink } from "@chakra-ui/react";
import React from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import MaskedPasswordField from "components/MaskedPasswordField/MaskedPasswordField";
import { ActualField } from "components/TextField/TextField";
import { MutationContextKey } from "configs/enums";
import { UserSchema } from "@veschool/types";
import { useAuthStore } from "state/authorization-store";
import { useTokenStore } from "state/token-store";
import { useModel, Form, regex } from "react-binden";
import { useTitumirApiStore } from "state/titumir-store";
import { TitumirResponse } from "services/titumir-api/Connector";
import {
    CONST_REFRESH_TOKEN_KEY,
    LoginProperties,
} from "services/titumir-api/modules/auth";

export const MINIMUM_CHAR_MSG = "Minimum 8 chars";
export const INVALID_EMAIL_MSG = "Invalid email";

function Login() {
    const navigate = useNavigate();
    const setTokens = useTokenStore((s) => s.setTokens);
    const setUser = useAuthStore((s) => s.setUser);
    const api = useTitumirApiStore();
    const { mutate: login, isSuccess } = useMutation<
        TitumirResponse<UserSchema>,
        Error,
        LoginProperties
    >(MutationContextKey.LOGIN, (body) => api.auth.login(body), {
        onSuccess({ json, headers }) {
            setUser(json);
            const refreshToken = headers.get(CONST_REFRESH_TOKEN_KEY);
            if (refreshToken) {
                setTokens?.({ refreshToken });
            }
            setTimeout(() => navigate("/"), 500);
        },
    });

    const email = useModel("");
    const password = useModel("");

    return (
        <>
            <Heading my="2" as="h4" textAlign="center">
                Welcome back🎉
            </Heading>

            <Form
                onSubmit={(_, __, { resetForm, setSubmitting }) => {
                    login({ email: email.value, password: password.value });
                    if (isSuccess) resetForm();
                    setSubmitting(false);
                }}
            >
                <Flex direction="column">
                    <ActualField
                        model={email}
                        mt="3"
                        type="email"
                        label="Email"
                        pattern={[regex.email, INVALID_EMAIL_MSG]}
                        required
                    />
                    <MaskedPasswordField
                        model={password}
                        mt="3"
                        name="password"
                        label="Password"
                        minLength={[8, MINIMUM_CHAR_MSG]}
                        required
                    />
                    <Button mt="3" type="submit">
                        Login
                    </Button>
                </Flex>
            </Form>

            <MuiLink style={{ marginTop: 10 }} component={Link} to="/reset?password=yes">
                Forgot password?
            </MuiLink>
        </>
    );
}

export default Login;
