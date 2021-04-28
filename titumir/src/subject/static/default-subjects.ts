import Subject from "../../database/entity/subjects.entity";

const defaultSubjects: Pick<Subject, "name" | "description">[] = [
  { name: "English", description: "" },
  { name: "Mathematics", description: "" },
  { name: "Science", description: "" },
  { name: "Religion", description: "" },
  { name: "Technology", description: "" },
  { name: "Computer Science", description: "" },
];
export default defaultSubjects;
