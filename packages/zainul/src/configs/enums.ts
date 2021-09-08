export enum MutationContextKey {
    SIGNUP = "mutate-signup",
    LOGIN = "mutate-login",
    CREATE_SCHOOL = "mutate-create-school",
    INVITATION = "mutate-invitation",
    CREATE_GRADES = "mutate-create-grades",
    COMPLETE_INVITATION_JOIN = "mutate-complete-invitation-join",
    CANCEL_INVITATION_JOIN = "mutate-cancel-invitation-join",
    CREATE_SECTION = "mutate-create-section",
    JOIN_SCHOOL = "mutate-join-school",
    ASSIGN_CO_ADMINS = "mutate-assign-co-admins",
    CREATE_SCHOOL_SUBJECTS = "mutate-create-school-subjects",
    ADD_GRADE_SUBJECTS = "mutate-add-grade-subjects",
}

export enum QueryContextKey {
    QUERY_USER = "query-user",
    INVITATION_SENT = "query-invitation-sent",
    INVITATION_RECEIVED = "query-invitation-received",
    JOIN_REQUEST_SENT = "query-join-request-sent",
    JOIN_REQUEST_RECEIVED = "query-join-request-received",
    GRADES = "query-grades",
    SCHOOL = "query-school",
    SCHOOLS = "query-schools",
    SCHOOL_MEMBERS = "query-school-members",
    SCHOOL_SUBJECTS = "query-school-subjects",
}

export enum LocalStorageKeys {
    accessToken = "access-token",
    refreshToken = "refresh-token",
}
