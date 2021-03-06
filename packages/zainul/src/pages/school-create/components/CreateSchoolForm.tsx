import { Button, Stack } from "@chakra-ui/react";
import TextField, { TextareaField } from "components/TextField/TextField";
import React from "react";
import { SchoolSchema } from "@schoolacious/types";
import { INVALID_EMAIL_MSG } from "pages/auth/components/Login";
import useTitumirMutation from "hooks/useTitumirMutation";
import { MutationContextKey } from "configs/enums";
import { SchoolProperties } from "services/titumir-client/modules/school";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { REQUIRED_MSG } from "pages/auth/components/Signup";

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
    const initValues: SchoolProperties = {
        name: "",
        email: "",
        phone: "",
        description: "",
        short_name: "",
    };
    const { mutate: createSchool, isSuccess } = useTitumirMutation<
        SchoolSchema,
        SchoolProperties
    >(MutationContextKey.CREATE_SCHOOL, (api, payload) =>
        api.school.create(payload).then(({ json }) => json),
    );

    return (
        <Formik
            initialValues={initValues}
            onSubmit={(values, { resetForm, setSubmitting }) => {
                createSchool(values);
                if (isSuccess) resetForm();
                else setSubmitting(false);
            }}
            validationSchema={CreateSchoolSchema}
        >
            <Form>
                <Stack direction={{ base: "column", md: "row" }} spacing={2}>
                    <Field
                        name="name"
                        component={TextField}
                        required
                        label="School Name"
                        placeholder="e.g. Shamsul Haque Khan School"
                    />
                    <Field
                        type="email"
                        name="email"
                        component={TextField}
                        required
                        label="Email"
                        placeholder="school@test.com"
                    />
                </Stack>
                <Stack direction={{ base: "column", md: "row" }} spacing={2}>
                    <Field
                        type="tel"
                        name="phone"
                        component={TextField}
                        required
                        label="Phone"
                        placeholder="e.g. 8801122334455"
                    />
                    <Field
                        name="short_name"
                        component={TextField}
                        required
                        label="Short Name"
                        placeholder="e.g. school-231"
                    />
                </Stack>
                <Field
                    name="description"
                    component={TextareaField}
                    required
                    label="Description"
                    margin="normal"
                    rows={5}
                    placeholder="Describe the fundamentals of your school "
                />
                <Button isFullWidth mt="2" type="submit">
                    Create
                </Button>
            </Form>
        </Formik>
    );
}

export default CreateSchoolForm;
