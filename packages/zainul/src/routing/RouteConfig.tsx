import React from "react";
import { Route, Switch } from "react-router-dom";
import Introduction from "../pages/introduction/introduction";
import Auth from "../pages/auth/auth";
import NotFound404 from "./404";
import Start from "../pages/start/start";
import Appbar from "../components/Appbar/Appbar";
import SchoolCreate from "../pages/school-create/school-create";
import School from "../pages/school/school";
import ConfigureSchool from "../pages/configure-school/configure-school";
import SchoolInvitations from "../pages/school-invitations/school-invitations";
import useLoggedIn from "../hooks/useLoggedIn";
import AddRemoveMembers from "../pages/add-remove-members/add-remove-members";
import UserProfile from "pages/user-profile/user-profile";
import UserInvitations from "pages/user-invitations/user-invitations";

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
                        <Route exact path="/school/configure-school">
                            <ConfigureSchool />
                        </Route>
                        <Route exact path="/school/add-remove-members">
                            <AddRemoveMembers />
                        </Route>
                        <Route path="/school/invitations">
                            <SchoolInvitations />
                        </Route>
                        <Route path="/user/profile">
                            <UserProfile />
                        </Route>
                        <Route path="/user/invitations">
                            <UserInvitations />
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
