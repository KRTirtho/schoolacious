import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Link as MuiLink,
  Button,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import loginBgImg from "/assets/login-bg.jpg";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";

function Login() {
  let LoginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Required"),
    password: yup.string().min(8, "Minimum 8  chars").required("Required"),
  });

  return (
    <Grid
      container
      style={{
        backgroundImage: `url(${loginBgImg})`,
        backgroundPosition: "top",
        backgroundSize: "cover",
        height: "100vh",
      }}
      justify="center"
      alignItems="center"
    >
      <Paper>
        <Grid
          style={{ padding: 30 }}
          container
          direction="column"
          alignItems="stretch"
        >
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
          <MuiLink style={{marginTop: 10}} component={Link} to="/reset?password=yes">
            Forgot password?
          </MuiLink>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default Login;
