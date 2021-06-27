import { Button, Grid } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import * as yup from "yup";
import { CreateSchool } from "../configurations/titumir";
import { INVALID_EMAIL_MSG } from "./Login";
import { REQUIRED_MSG } from "./Signup";

export const SHORT_NAME_MATCHES_MSG = "only {a-z,-,0-9} is allowed";
function CreateSchoolForm() {
    const CreateSchoolSchema = yup.object().shape({
        name: yup.string().required(REQUIRED_MSG),
        email: yup.string().email(INVALID_EMAIL_MSG).required(REQUIRED_MSG),
        phone: yup.number().required(REQUIRED_MSG),
        description: yup.string(),
        short_name: yup
            .string()
            .matches(/^[a-z\d-]+$/, SHORT_NAME_MATCHES_MSG)
            .required(REQUIRED_MSG),
    });

    const initValues: CreateSchool = {
        name: "",
        email: "",
        phone: "",
        description: "",
        short_name: "",
    };

    return (
        <Formik
            initialValues={initValues}
            onSubmit={() => {
                return;
            }}
            validationSchema={CreateSchoolSchema}
        >
            <Form>
                <Grid wrap="wrap" container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Field
                            fullWidth
                            name="name"
                            component={TextField}
                            required
                            label="name"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Field
                            fullWidth
                            type="email"
                            name="email"
                            component={TextField}
                            required
                            label="Email"
                        />
                    </Grid>
                </Grid>
                <Grid wrap="wrap" container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Field
                            fullWidth
                            type="phone"
                            name="phone"
                            component={TextField}
                            required
                            label="Phone"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Field
                            fullWidth
                            name="short_name"
                            component={TextField}
                            required
                            label="short_name"
                        />
                    </Grid>
                </Grid>
                <Field
                    fullWidth
                    name="description"
                    component={TextField}
                    required
                    label="description"
                    multiline
                    margin="normal"
                    rows="5"
                />
                <Button fullWidth type="submit">
                    Create
                </Button>
            </Form>
        </Formik>
    );
}

export default CreateSchoolForm;
