import { Button, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { MutationContextKey } from "configs/enums";
import { UserSchema } from "@veschool/types";
import { ActualField as Field } from "components/TextField/TextField";
import MaskedPasswordField from "components/MaskedPasswordField/MaskedPasswordField";
import { useAuthStore } from "state/authorization-store";
import { useTokenStore } from "state/token-store";
import { Form, regex, useModel } from "react-binden";
import { useTitumirApiStore } from "state/titumir-store";
import {
    CONST_REFRESH_TOKEN_KEY,
    SignupProperties,
} from "services/titumir-client/modules/auth";
import { TitumirResponse } from "services/titumir-client/Connector";

export const REQUIRED_MSG = "Required";

function Signup() {
    const navigate = useNavigate();
    const first_name = useModel("");
    const last_name = useModel("");
    const email = useModel("");
    const password = useModel("");
    const confirmPassword = useModel("");

    const setTokens = useTokenStore((s) => s.setTokens);
    const setUser = useAuthStore((s) => s.setUser);

    const api = useTitumirApiStore();

    const { mutate: signup, isSuccess } = useMutation<
        TitumirResponse<UserSchema>,
        Error,
        SignupProperties
    >(MutationContextKey.SIGNUP, (body) => api.auth.signup(body), {
        onSuccess({ json, headers }) {
            setUser(json);
            const refreshToken = headers.get(CONST_REFRESH_TOKEN_KEY);
            if (refreshToken) {
                setTokens?.({ refreshToken });
            }
            setTimeout(() => navigate("/"), 500);
        },
    });

    return (
        <>
            <Heading align="center" mb="2" variant="h4">
                Create an account
            </Heading>

            <Form
                onSubmit={(_, __, { resetForm, setSubmitting }) => {
                    signup({
                        email: email.value,
                        password: password.value,
                        first_name: first_name.value,
                        last_name: last_name.value,
                    });
                    if (isSuccess) resetForm();
                    setSubmitting(false);
                }}
            >
                <Stack direction="column" spacing="2">
                    <Stack direction={{ base: "column", md: "row" }} spacing="2">
                        <Field model={first_name} label="First Name" required />
                        <Field model={last_name} label="Last Name" required />
                    </Stack>
                    <Field
                        model={email}
                        type="email"
                        label="Email"
                        pattern={[regex.email, "Type a valid email"]}
                        required
                    />
                    <MaskedPasswordField
                        model={password}
                        label="Password"
                        pattern={[
                            regex.moderatePassword,
                            "Password should contain one of a-z, A-Z, 0-9 and symbols (@,#,^ etc)",
                        ]}
                        required
                    />
                    <MaskedPasswordField
                        model={confirmPassword}
                        imprint-model={password}
                        label="Confirm Password"
                        required
                    />
                    <Button type="submit">Signup</Button>
                </Stack>
            </Form>
        </>
    );
}

export default Signup;
