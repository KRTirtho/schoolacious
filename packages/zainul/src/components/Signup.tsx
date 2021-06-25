import { Grid, Button, Typography } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { useMutation } from "react-query";
import * as yup from "yup";
import { titumirApi } from "../App";
import { ContextKey } from "../configurations/enum-keys";
import {
    CONST_ACCESS_TOKEN_KEY,
    CONST_REFRESH_TOKEN_KEY,
    SignupBody,
    TitumirResponse,
    User,
} from "../configurations/titumir";
import useAuthorization from "../hooks/useAuthorization";

const REQUIRED_MSG = "Required";
const MINIMUM_CHAR_MSG = "Minimum 8  chars";

function Signup() {
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

    const ctx = useAuthorization();

    const { mutate: signup } = useMutation<TitumirResponse<User>, Error, SignupBody>(
        ContextKey.SIGNUP,
        (body) => titumirApi.signup(body),
        {
            onSuccess({ json, headers }) {
                ctx.setUser(json);
                const accessToken = headers.get(CONST_ACCESS_TOKEN_KEY);
                const refreshToken = headers.get(CONST_REFRESH_TOKEN_KEY);
                if (accessToken && refreshToken) {
                    ctx.setTokens({ accessToken, refreshToken });
                }
            },
        },
    );

    return (
        <>
            <Typography align="center" style={{ marginBottom: 20 }} variant="h4">
                Create an account
            </Typography>
            <Formik
                initialValues={{
                    first_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                }}
                onSubmit={(values, { resetForm }) => {
                    signup(values);
                    resetForm();
                }}
                validationSchema={SignupSchema}
            >
                <Form>
                    <Grid container direction="column">
                        <Grid container>
                            <Field
                                style={{ marginRight: 5 }}
                                component={TextField}
                                name="first_name"
                                label="First Name"
                            />
                            <Field
                                style={{ marginLeft: 5 }}
                                component={TextField}
                                name="last_name"
                                label="Last Name"
                            />
                        </Grid>
                        <Field
                            style={{ marginTop: 10 }}
                            component={TextField}
                            name="email"
                            type="email"
                            label="Email"
                        />
                        <Field
                            style={{ marginTop: 10 }}
                            component={TextField}
                            name="password"
                            type="password"
                            label="password"
                        />
                        <Field
                            style={{ marginTop: 10 }}
                            component={TextField}
                            name="confirmPassword"
                            type="password"
                            label="Confirm password"
                        />
                        <Button style={{ marginTop: 10 }} type="submit">
                            Signup
                        </Button>
                    </Grid>
                </Form>
            </Formik>
        </>
    );
}

export default Signup;
