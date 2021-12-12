import { TitumirAuthModule } from "./modules/auth";
import { ClassPrefixIds, TitumirClassModule } from "./modules/class";
import { TitumirGradeModule } from "./modules/grade";
import { TitumirInvitationJoinModule } from "./modules/invitation-join";
import { TitumirNotificationModule } from "./modules/notification";
import { TitumirSchoolModule } from "./modules/school";
import { TitumirSectionModule } from "./modules/section";
import { TitumirUserModule } from "./modules/user";

export interface Options extends Partial<ClassPrefixIds> {
    school?: string;
}

export default class Titumir {
    schoolId = "";
    gradeId = 0;
    sectionId = "";
    constructor(prefixIds?: Options) {
        if (prefixIds?.school) this.schoolId = prefixIds?.school;
        if (prefixIds?.grade) this.gradeId = prefixIds?.grade;
        if (prefixIds?.section) this.sectionId = prefixIds?.section;
    }

    public auth: TitumirAuthModule = new TitumirAuthModule();
    public user: TitumirUserModule = new TitumirUserModule();
    public notification: TitumirNotificationModule = new TitumirNotificationModule();
    public invitationJoin: TitumirInvitationJoinModule =
        new TitumirInvitationJoinModule();

    public school: TitumirSchoolModule = new TitumirSchoolModule(this.schoolId);
    public grade: TitumirGradeModule = new TitumirGradeModule(
        this.schoolId,
        this.gradeId,
    );
    public section: TitumirSectionModule = new TitumirSectionModule(
        {
            school: this.schoolId,
            grade: this.gradeId,
        },
        this.sectionId,
    );
    public class: TitumirClassModule = new TitumirClassModule({
        school: this.schoolId,
        grade: this.gradeId,
        section: this.sectionId,
    });

    public setSchoolId(schoolId: string) {
        this.schoolId = schoolId;
        this.school.setSchoolId(schoolId);
        this.grade.setSchool(schoolId);
        this.section.setPrefixIds({ school: schoolId });
        this.class.setPrefixIds({ school: schoolId });
    }

    public setGradeId(gradeId: number) {
        this.gradeId = gradeId;
        this.grade.setGradeId(gradeId);
        this.section.setPrefixIds({ grade: gradeId });
        this.class.setPrefixIds({ grade: gradeId });
    }

    public setSectionId(sectionId: string) {
        this.sectionId = sectionId;
        this.section.setSectionId(sectionId);
        this.class.setPrefixIds({ section: sectionId });
    }
}
