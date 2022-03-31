import { Flex, Heading, Button, Link as MuiLink } from "@chakra-ui/react";
import React from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import MaskedPasswordField from "components/MaskedPasswordField/MaskedPasswordField";
import { MutationContextKey } from "configs/enums";
import { UserSchema } from "@schoolacious/types";
import { useAuthStore } from "state/authorization-store";
import { useTokenStore } from "state/token-store";
import { useTitumirApiStore } from "state/titumir-store";
import { TitumirResponse } from "services/titumir-client/Connector";
import {
    CONST_REFRESH_TOKEN_KEY,
    LoginProperties,
} from "services/titumir-client/modules/auth";
import * as yup from "yup";
import TextField from "components/TextField/TextField";
import { Formik, Form, Field } from "formik";
import { REQUIRED_MSG } from "./Signup";
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
    const LoginSchema = yup.object().shape({
        email: yup.string().email(INVALID_EMAIL_MSG).required(REQUIRED_MSG),
        password: yup.string().min(8, MINIMUM_CHAR_MSG).required(REQUIRED_MSG),
    });
    return (
        <>
            <Heading my="2" as="h4" textAlign="center">
                Welcome back🎉
            </Heading>

            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                    login(values);
                    if (isSuccess) resetForm();
                    else setSubmitting(false);
                }}
                validationSchema={LoginSchema}
            >
                <Form>
                    <Flex direction="column">
                        <Field
                            mt="3"
                            component={TextField}
                            name="email"
                            type="email"
                            label="Email"
                            required
                        />
                        <Field
                            component={MaskedPasswordField}
                            mt="3"
                            name="password"
                            label="Password"
                            required
                        />
                        <Button mt="3" type="submit">
                            Login
                        </Button>
                    </Flex>
                </Form>
            </Formik>

            <MuiLink style={{ marginTop: 10 }} as={Link} to="/reset?password=yes">
                Forgot password?
            </MuiLink>
        </>
    );
}

export default Login;
