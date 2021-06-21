import { Grid, Typography, Button, Link as MuiLink } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";

function Login() {
    let LoginSchema = yup.object().shape({
        email: yup.string().email("Invalid email").required("Required"),
        password: yup.string().min(8, "Minimum 8  chars").required("Required"),
    });
    return (
        <>
            <Typography style={{ marginBottom: 20 }} variant="h4">
                Welcome back🎉
            </Typography>
            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={() => {}}
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
                        />
                        <Field
                            style={{ marginTop: 10 }}
                            component={TextField}
                            name="password"
                            type="password"
                            label="password"
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
