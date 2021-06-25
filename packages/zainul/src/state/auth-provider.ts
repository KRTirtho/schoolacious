import React, { Dispatch, SetStateAction } from "react";
import { User } from "../configurations/titumir";
import { ContextToken } from "./AuthorizationStore";

export interface AuthorizationContext {
    logged: boolean;
    tokens?: ContextToken;
    user?: User;
    setLogged: Dispatch<SetStateAction<boolean>>;
    setTokens: Dispatch<SetStateAction<ContextToken | undefined>>;
    setUser: Dispatch<SetStateAction<User | undefined>>;
}

const authContext = React.createContext<AuthorizationContext>({
    logged: false,
    setLogged() {
        return;
    },
    setTokens() {
        return;
    },
    setUser() {
        return;
    },
});

export default authContext;
