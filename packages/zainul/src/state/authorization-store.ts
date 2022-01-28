import create, { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import {
    StudentsToSectionsToGradesSchema,
    TeachersToSectionsToGradesSchema,
    UserSchema,
} from "@schoolacious/types";

export interface UserSchemaWithGradesSections extends UserSchema {
    ssg?: StudentsToSectionsToGradesSchema;
    tsg?: TeachersToSectionsToGradesSchema;
}

export interface AuthorizationStore {
    user?: UserSchemaWithGradesSections;
    setUser(user: UserSchemaWithGradesSections): void;
}

const authStore: StateCreator<AuthorizationStore> = (set) => {
    return {
        setUser(user) {
            set({ user });
        },
    };
};

export const useAuthStore = create<AuthorizationStore>(devtools(authStore));
