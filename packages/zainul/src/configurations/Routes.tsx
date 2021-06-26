import React from "react";
import { Route, Switch } from "react-router-dom";
import Introduction from "../pages/Introduction";
import Auth from "../pages/Auth";
import useAuthorization from "../hooks/useAuthorization";
import NotFound404 from "../pages/404";
import Start from "../pages/Start";
import Appbar from "../components/Appbar";

export default function Routes() {
    const ctx = useAuthorization();

    return (
        <Switch>
            {ctx.logged ? (
                <>
                    <Route exact path="/">
                        {/**
                         * Put all the routes here that are gonna use
                         * the <AppBar/>
                         */}
                        <Appbar />
                        <Route path="/">
                            <Start />
                        </Route>
                    </Route>
                </>
            ) : (
                <>
                    <Route exact path="/">
                        <Introduction />
                    </Route>
                    <Route path="/auth">
                        <Auth />
                    </Route>
                </>
            )}

            <Route>
                <NotFound404 />
            </Route>
        </Switch>
    );
}
