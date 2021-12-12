import { Button, Stack } from "@chakra-ui/react";
import { ActualField as Field, ActualTextarea } from "components/TextField/TextField";
import { Form, useModel, regex } from "react-binden";
import React from "react";
import { SchoolSchema } from "@veschool/types";
import { INVALID_EMAIL_MSG } from "pages/auth/components/Login";
import useTitumirMutation from "hooks/useTitumirMutation";
import { MutationContextKey } from "configs/enums";
import { SchoolProperties } from "services/titumir-api/modules/school";

export const SHORT_NAME_MATCHES_MSG = "only {a-z,-,0-9} is allowed";
function CreateSchoolForm() {
    const name = useModel("");
    const email = useModel("");
    const phone = useModel("");
    const description = useModel("");
    const short_name = useModel("");

    const { mutate: createSchool, isSuccess } = useTitumirMutation<
        SchoolSchema,
        SchoolProperties
    >(MutationContextKey.CREATE_SCHOOL, (api, payload) =>
        api.school.create(payload).then(({ json }) => json),
    );

    return (
        <Form
            onSubmit={(_, __, { resetForm, setSubmitting }) => {
                createSchool({
                    name: name.value,
                    email: email.value,
                    phone: phone.value,
                    description: description.value,
                    short_name: short_name.value,
                });
                if (isSuccess) resetForm();
                setSubmitting(false);
            }}
        >
            <Stack direction={{ base: "column", md: "row" }} spacing={2}>
                <Field
                    model={name}
                    required
                    label="School Name"
                    placeholder="e.g. Shamsul Haque Khan School"
                />
                <Field
                    type="email"
                    model={email}
                    label="Email"
                    placeholder="school@test.com"
                    pattern={[regex.email, INVALID_EMAIL_MSG]}
                    required
                />
            </Stack>
            <Stack direction={{ base: "column", md: "row" }} spacing={2}>
                <Field
                    type="tel"
                    model={phone}
                    label="Phone"
                    placeholder="e.g. 8801122334455"
                    required
                />
                <Field
                    model={short_name}
                    label="Short Name"
                    placeholder="e.g. school-231"
                    pattern={[/^[a-z\d-]+$/, SHORT_NAME_MATCHES_MSG]}
                    required
                />
            </Stack>
            <ActualTextarea
                model={description}
                label="Description"
                margin="normal"
                rows={5}
                placeholder="Describe the fundamentals of your school "
                required
            />
            <Button isFullWidth mt="2" type="submit">
                Create
            </Button>
        </Form>
    );
}

export default CreateSchoolForm;
