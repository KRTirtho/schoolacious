import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { USER_ROLE } from "@schoolacious/types";
import Introduction from "pages/introduction/introduction";
import Auth from "pages/auth/auth";
import Start from "pages/start/start";
import SchoolCreate from "pages/school-create/school-create";
import School from "pages/school/school";
import UserProfile from "pages/user-profile/user-profile";
import UserInvitations from "pages/user-invitations/user-invitations";
import ProtectedRoute from "./ProtectedRoute";
import NotProtectedRoute from "./NotProtectedRoute";
import NotFound404 from "./404";
import SchoolJoin from "pages/school-join/school-join";
import UserJoinRequests from "pages/user-join-requests/user-join-requests";
import SchoolConfigure from "pages/school-configure/school-configure";
import UserConfigure from "pages/user-configure/user-configure";
import ClassSession from "pages/class-session/class-session";
import Login from "pages/auth/components/Login";
import Signup from "pages/auth/components/Signup";
import AddRemoveMembers from "pages/add-remove-members/add-remove-members";
import ConfigureGradeSection from "pages/configure-grade-section/configure-grade-section";
import SchoolCoAdmins from "pages/school-co_admins/school-co_admins";
import SchoolInvitations from "pages/school-invitations/school-invitations";
import SchoolJoinRequests from "pages/school-join-requests/school-join-requests";
import SchoolSubjects from "pages/school-subjects/school-subjects";

export default function ApplicationRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute fallback={<Introduction />}>
                        <Start />
                    </ProtectedRoute>
                }
            />
            <Route
                element={
                    <ProtectedRoute>
                        <School />
                    </ProtectedRoute>
                }
                path="/school"
            />
            <Route
                element={
                    <ProtectedRoute>
                        <SchoolCreate />
                    </ProtectedRoute>
                }
                path="/school/create"
            />
            <Route
                element={
                    <ProtectedRoute>
                        <SchoolJoin />
                    </ProtectedRoute>
                }
                path="/school/join"
            />
            <Route
                element={
                    <ProtectedRoute roles={[USER_ROLE.admin, USER_ROLE.coAdmin]}>
                        <SchoolConfigure />
                    </ProtectedRoute>
                }
                path="/school/configure"
            >
                <Route path="" element={<Navigate replace to="grade-sections" />} />
                <Route path="co-admins" element={<SchoolCoAdmins />} />
                <Route path="grade-sections/*" element={<ConfigureGradeSection />} />
                <Route path="add-remove-members" element={<AddRemoveMembers />} />
                <Route path="subjects" element={<SchoolSubjects />} />
                <Route path="invitations" element={<SchoolInvitations />} />
                <Route path="join-requests" element={<SchoolJoinRequests />} />
                <Route path="*" element={<NotFound404 />} />
            </Route>
            <Route
                element={
                    <ProtectedRoute>
                        <UserConfigure />
                    </ProtectedRoute>
                }
                path="/user/configure"
            >
                <Route path="" element={<Navigate to="invitations" />} />
                <Route path="invitations" element={<UserInvitations />} />
                <Route path="join-requests" element={<UserJoinRequests />} />
                <Route path="*" element={<NotFound404 />} />
            </Route>
            <Route
                element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                }
                path="/user/profile"
            />
            <Route
                element={
                    <ProtectedRoute>
                        <UserInvitations />
                    </ProtectedRoute>
                }
                path="/user/invitations"
            />
            <Route
                element={
                    <ProtectedRoute>
                        <UserJoinRequests />
                    </ProtectedRoute>
                }
                path="/user/join-requests"
            />

            <Route element={<ClassSession />} path="/class/:grade/:section/:sessionId" />

            <Route
                element={
                    <NotProtectedRoute>
                        <Auth />
                    </NotProtectedRoute>
                }
                path="/auth"
            >
                <Route path="" element={<Login />} />
                <Route path="signup" element={<Signup />} />
            </Route>

            <Route path="*" element={<NotFound404 />} />
        </Routes>
    );
}
