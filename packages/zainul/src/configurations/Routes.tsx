import React from "react";
import { Route } from "react-router-dom";
import Introduction from "../pages/Introduction";
import Auth from "../pages/Auth";
import useAuthorization from "../hooks/useAuthorization";

export default function Routes() {
    const ctx = useAuthorization();

    return (
        <>
            <Route exact path="/">
                Home
            </Route>
            <Route path="/introduction">
                <Introduction />
            </Route>
            <Route path="/auth">
                <Auth />
            </Route>
        </>
    );
}
