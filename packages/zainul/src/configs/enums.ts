export enum MutationContextKey {
    SIGNUP = "mutate-signup",
    LOGIN = "mutate-login",
    CREATE_SCHOOL = "mutate-create-school",
    INVITATION = "mutate-invitation",
    CREATE_GRADES = "mutate-create-grades",
}

export enum QueryContextKey {
    QUERY_USER = "query-user",
    INVITATION_SENT = "query-invitation-sent",
    INVITATION_RECEIVED = "query-invitation-received",
    GRADES = "query-grades",
}

export enum LocalStorageKeys {
    accessToken = "access-token",
    refreshToken = "refresh-token",
}
