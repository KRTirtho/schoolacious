import React from "react";
import { Route, Switch } from "react-router-dom";
import Introduction from "../pages/introduction/introduction";
import Auth from "../pages/auth/auth";
import NotFound404 from "./404";
import Start from "../pages/start/start";
import Appbar from "../components/Appbar/Appbar";
import SchoolCreate from "../pages/school-create/school-create";
import School from "../pages/school/school";
import SchoolConfigure from "../pages/school-configure/school-configure";
import Invitations from "../pages/invitations/invitations";
import useLoggedIn from "../hooks/useLoggedIn";

export default function Routes() {
    const logged = useLoggedIn();

    return (
        <Switch>
            {logged ? (
                <>
                    <Route path="/">
                        {/**
                         * Put all the routes here that are gonna use
                         * the <AppBar/>
                         */}
                        <Appbar />
                        <Route exact path="/">
                            <Start />
                        </Route>
                        <Route exact path="/school">
                            <School />
                        </Route>
                        <Route exact path="/school/create">
                            <SchoolCreate />
                        </Route>
                        <Route exact path="/school/configure">
                            <SchoolConfigure />
                        </Route>
                        <Route path="/school/invitations">
                            <Invitations platform="school" />
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
