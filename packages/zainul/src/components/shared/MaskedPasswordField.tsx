import { InputAdornment, IconButton, TextFieldProps } from "@material-ui/core";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import React, { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

export type MaskedPasswordFieldProps = Omit<TextFieldProps, "type" | "component">;

function MaskedPasswordField(props: MaskedPasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    function showHidePassword() {
        setShowPassword(!showPassword);
    }
    return (
        <Field
            type={showPassword ? "text" : "password"}
            component={TextField}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={showHidePassword}
                            onMouseDown={showHidePassword}
                        >
                            {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    );
}

export default MaskedPasswordField;
