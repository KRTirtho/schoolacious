export enum USER_ROLE {
    admin = "admin",
    coAdmin = "co-admin",
    gradeModerator = "grade-moderator",
    gradeExaminer = "grade-examiner",
    classTeacher = "class-teacher",
    teacher = "teacher",
    student = "student",
}

export enum USER_STATUS {
    online = "online",
    offline = "offline",
}

export enum CLASS_STATUS {
    scheduled = "scheduled",
    ongoing = "ongoing",
    complete = "complete",
}

export enum INVITATION_OR_JOIN_TYPE {
    invitation = "invitation",
    join = "join",
}

export enum INVITATION_OR_JOIN_ROLE {
    teacher = "teacher",
    student = "student",
}

export enum NOTIFICATION_STATUS {
    unread = "unread",
    read = "read",
}

export enum WS_SERVER_EVENTS {
    notification = "notification",
}

export enum WS_CLIENT_EVENT {}
