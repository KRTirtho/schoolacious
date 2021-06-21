import { Grid, Button, Link as MuiLink, Typography } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";

const REQUIRED_MSG = "Required";
const MINIMUM_CHAR_MSG = "Minimum 8  chars";
function Signup() {
    let SignupSchema = yup.object().shape({
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

    return (
        <>
            <Typography style={{ marginBottom: 20 }} variant="h4">
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
                onSubmit={() => {}}
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
            <MuiLink style={{ marginTop: 10 }} component={Link} to="/reset?password=yes">
                Forgot password?
            </MuiLink>
        </>
    );
}

export default Signup;
