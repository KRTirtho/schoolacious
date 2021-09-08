import { SubjectSchema } from "@veschool/types";
import { QueryContextKey } from "configs/enums";
import useTitumirQuery from "hooks/useTitumirQuery";
import { useAuthStore } from "state/authorization-store";

export function useGetSchoolSubjects() {
    const short_name = useAuthStore((s) => s.user?.school?.short_name);
    return useTitumirQuery<SubjectSchema[] | null>(
        QueryContextKey.SCHOOL_SUBJECTS,
        async (api) => {
            if (!short_name) return null;
            const { json } = await api.getSchoolSubjects(short_name);
            return json;
        },
    );
}
