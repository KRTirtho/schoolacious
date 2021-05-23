import React from "react";
import { Route } from "react-router-dom";
import Introduction from "../pages/Introduction";

export default function Routes() {
  return (
    <>
      <Route path="/"></Route>
      <Route path="introduction">
        <Introduction />
      </Route>
    </>
  );
}
