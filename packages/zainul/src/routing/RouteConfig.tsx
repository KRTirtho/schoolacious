import React from "react";
import { Route, Switch } from "react-router-dom";
import Introduction from "pages/introduction/introduction";
import Auth from "pages/auth/auth";
import Start from "pages/start/start";
import SchoolCreate from "pages/school-create/school-create";
import School from "pages/school/school";
import UserProfile from "pages/user-profile/user-profile";
import UserInvitations from "pages/user-invitations/user-invitations";
import ProtectedRoute from "./ProtectedRoute";
import NotProtectedRoute from "./NotProtectedRoute";
import { USER_ROLE } from "@veschool/types";
import NotFound404 from "./404";
import SchoolJoin from "pages/school-join/school-join";
import UserJoinRequests from "pages/user-join-requests/user-join-requests";
import SchoolConfigure from "pages/school-configure/school-configure";
import UserConfigure from "pages/user-configure/user-configure";
import ClassSession from "pages/class-session/class-session";

export default function Routes() {
    return (
        <Switch>
            <ProtectedRoute exact path="/" fallback={<Introduction />}>
                <Start />
            </ProtectedRoute>
            <ProtectedRoute exact path="/school">
                <School />
            </ProtectedRoute>
            <ProtectedRoute exact path="/school/create">
                <SchoolCreate />
            </ProtectedRoute>
            <ProtectedRoute exact path="/school/join">
                <SchoolJoin />
            </ProtectedRoute>
            <ProtectedRoute
                roles={[USER_ROLE.admin, USER_ROLE.coAdmin]}
                path="/school/configure"
            >
                <SchoolConfigure />
            </ProtectedRoute>
            <ProtectedRoute path="/user/configure">
                <UserConfigure />
            </ProtectedRoute>
            <ProtectedRoute exact path="/user/profile">
                <UserProfile />
            </ProtectedRoute>
            <ProtectedRoute exact path="/user/invitations">
                <UserInvitations />
            </ProtectedRoute>
            <ProtectedRoute exact path="/user/join-requests">
                <UserJoinRequests />
            </ProtectedRoute>

            <ProtectedRoute exact path="/class/:grade/:section/:sessionId">
                <ClassSession />
            </ProtectedRoute>

            <NotProtectedRoute path="/auth">
                <Auth />
            </NotProtectedRoute>

            <Route path="*">
                <NotFound404 />
            </Route>
        </Switch>
    );
}
