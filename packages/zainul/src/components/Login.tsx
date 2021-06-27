import { Grid, Typography, Button, Link as MuiLink } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { useMutation } from "react-query";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import { titumirApi } from "../App";
import { ContextKey } from "../configurations/enum-keys";
import {
    CONST_ACCESS_TOKEN_KEY,
    CONST_REFRESH_TOKEN_KEY,
    LoginBody,
    TitumirResponse,
    User,
} from "../configurations/titumir";
import useAuthorization from "../hooks/useAuthorization";
import MaskedPasswordField from "./shared/MaskedPasswordField";
import { MINIMUM_CHAR_MSG, REQUIRED_MSG } from "./Signup";

export const INVALID_EMAIL_MSG = "Invalid email";
function Login() {
    const history = useHistory();
    const LoginSchema = yup.object().shape({
        email: yup.string().email(INVALID_EMAIL_MSG).required(REQUIRED_MSG),
        password: yup.string().min(8, MINIMUM_CHAR_MSG).required(REQUIRED_MSG),
    });
    const ctx = useAuthorization();
    const { mutate: login, isSuccess } = useMutation<
        TitumirResponse<User>,
        Error,
        LoginBody
    >(ContextKey.LOGIN, (body) => titumirApi.login(body), {
        onSuccess({ json, headers }) {
            ctx.setUser(json);
            const accessToken = headers.get(CONST_ACCESS_TOKEN_KEY);
            const refreshToken = headers.get(CONST_REFRESH_TOKEN_KEY);
            if (accessToken && refreshToken) {
                ctx.setTokens({ accessToken, refreshToken });
            }
            setTimeout(() => history.push("/"), 500);
        },
    });
    return (
        <>
            <Typography style={{ marginBottom: 20 }} variant="h4">
                Welcome back🎉
            </Typography>
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
                    <Grid container direction="column">
                        <Field
                            style={{ marginTop: 10 }}
                            component={TextField}
                            name="email"
                            type="email"
                            label="Email"
                            required
                        />
                        <MaskedPasswordField
                            style={{ marginTop: 10 }}
                            name="password"
                            label="password"
                            required
                        />
                        <Button style={{ marginTop: 10 }} type="submit">
                            Login
                        </Button>
                    </Grid>
                </Form>
            </Formik>
            <MuiLink style={{ marginTop: 10 }} component={Link} to="/reset?password=yes">
                Forgot password?
            </MuiLink>
        </>
    );
}

export default Login;
