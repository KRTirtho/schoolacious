import { Flex, Heading, Button, Link as MuiLink } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React from "react";
import { useMutation } from "react-query";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import { titumirApi } from "App";
import MaskedPasswordField from "components/MaskedPasswordField/MaskedPasswordField";
import TextField from "components/TextField/TextField";
import { MutationContextKey } from "configs/enums";
import {
    TitumirResponse,
    LoginBody,
    CONST_ACCESS_TOKEN_KEY,
    CONST_REFRESH_TOKEN_KEY,
} from "services/api/titumir";
import { UserSchema } from "@veschool/types";
import { useAuthStore } from "state/authorization-store";
import { useTokenStore } from "state/token-store";
import { MINIMUM_CHAR_MSG, REQUIRED_MSG } from "./Signup";
export const INVALID_EMAIL_MSG = "Invalid email";
function Login() {
    const history = useHistory();
    const LoginSchema = yup.object().shape({
        email: yup.string().email(INVALID_EMAIL_MSG).required(REQUIRED_MSG),
        password: yup.string().min(8, MINIMUM_CHAR_MSG).required(REQUIRED_MSG),
    });
    const setTokens = useTokenStore((s) => s.setTokens);
    const setUser = useAuthStore((s) => s.setUser);
    const { mutate: login, isSuccess } = useMutation<
        TitumirResponse<UserSchema>,
        Error,
        LoginBody
    >(MutationContextKey.LOGIN, (body) => titumirApi.login(body), {
        onSuccess({ json, headers }) {
            setUser(json);
            const accessToken = headers.get(CONST_ACCESS_TOKEN_KEY);
            const refreshToken = headers.get(CONST_REFRESH_TOKEN_KEY);
            if (accessToken && refreshToken) {
                setTokens({ accessToken, refreshToken });
            }
            setTimeout(() => history.push("/"), 500);
        },
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
            <MuiLink style={{ marginTop: 10 }} component={Link} to="/reset?password=yes">
                Forgot password?
            </MuiLink>
        </>
    );
}

export default Login;
