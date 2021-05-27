import React from "react";
import { Route } from "react-router-dom";
import Introduction from "../pages/Introduction";
import Login from "../pages/Login";

export default function Routes() {
  return (
    <>
      <Route exact path="/">Home</Route>
      <Route path="/introduction">
        <Introduction />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
    </>
  );
}
