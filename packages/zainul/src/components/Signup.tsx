import { Button, Heading, Stack } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import { titumirApi } from "../App";
import { MutationContextKey } from "../configurations/enum-keys";
import {
    CONST_ACCESS_TOKEN_KEY,
    CONST_REFRESH_TOKEN_KEY,
    SignupBody,
    TitumirResponse,
    User,
} from "../configurations/titumir";
import TextField from "./shared/TextField";
import MaskedPasswordField from "./shared/MaskedPasswordField";
import { useAuthStore, useTokenStore } from "../state/auth-provider";

export const REQUIRED_MSG = "Required";
export const MINIMUM_CHAR_MSG = "Minimum 8 chars";

interface SignupInitValues {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function Signup() {
    const history = useHistory();
    const SignupSchema = yup.object().shape({
        first_name: yup.string().required(REQUIRED_MSG),
        last_name: yup.string().required(REQUIRED_MSG),
        email: yup.string().email("Invalid email").required(REQUIRED_MSG),
        password: yup.string().min(8, MINIMUM_CHAR_MSG).required(REQUIRED_MSG),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .min(8, MINIMUM_CHAR_MSG)
            .required(REQUIRED_MSG),
    });

    const setTokens = useTokenStore((s) => s.setTokens);
    const setUser = useAuthStore((s) => s.setUser);

    const { mutate: signup, isSuccess } = useMutation<
        TitumirResponse<User>,
        Error,
        SignupBody
    >(MutationContextKey.SIGNUP, (body) => titumirApi.signup(body), {
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
            <Heading align="center" mb="2" variant="h4">
                Create an account
            </Heading>
            <Formik
                initialValues={
                    {
                        first_name: "",
                        last_name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                    } as SignupInitValues
                }
                onSubmit={(values, { resetForm, setSubmitting }) => {
                    signup(values);
                    if (isSuccess) resetForm();
                    else setSubmitting(false);
                }}
                validationSchema={SignupSchema}
            >
                <Form>
                    <Stack direction="column" spacing="2">
                        <Stack direction={{ base: "column", md: "row" }} spacing="2">
                            <Field
                                component={TextField}
                                name="first_name"
                                label="First Name"
                                required
                            />
                            <Field
                                component={TextField}
                                name="last_name"
                                label="Last Name"
                                required
                            />
                        </Stack>
                        <Field
                            component={TextField}
                            name="email"
                            type="email"
                            label="Email"
                            required
                        />
                        <Field
                            component={MaskedPasswordField}
                            name="password"
                            label="password"
                            required
                        />
                        <Field
                            component={MaskedPasswordField}
                            name="confirmPassword"
                            label="Confirm Password"
                            required
                        />
                        <Button type="submit">Signup</Button>
                    </Stack>
                </Form>
            </Formik>
        </>
    );
}

export default Signup;
