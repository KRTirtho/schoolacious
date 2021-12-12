import {
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Text,
    HStack,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Checkbox,
    PopoverArrow,
    PopoverFooter,
    Button,
    useDisclosure,
    Link as CLink,
    Tooltip,
} from "@chakra-ui/react";
import { GradeToSubjectSchema } from "@veschool/types";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import useTitumirMutation from "hooks/useTitumirMutation";
import { uniqueId } from "lodash";
import React, { FC, useMemo, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { AddGradeSubjectsBody } from "services/titumir-api/modules/grade";
import { useGetSchoolSubjects } from "services/query-hooks/useGetSchoolSubjects";

export interface GradeSubjectEditPopoverProps {
    grade_subjects?: GradeToSubjectSchema[] | null;
    grade: number;
}

interface OnSubjectChangeArg {
    _id: string;
    mark: number;
    select: boolean;
}

const GradeSubjectSelector: FC<GradeSubjectEditPopoverProps> = ({
    grade_subjects = [],
    grade,
}) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const { data: subjects } = useGetSchoolSubjects();

    const gradeSubjectsIds = useMemo(
        () => grade_subjects?.map((s) => s?.subject?._id),
        [grade_subjects],
    );

    // filtering only the subjects that don't exist in the grade already
    const curatedSubjects = useMemo(
        () => subjects?.filter((subject) => !gradeSubjectsIds?.includes(subject._id)),
        [subjects, gradeSubjectsIds],
    );

    const queryClient = useQueryClient();

    const { mutate: addSubjects, isLoading } = useTitumirMutation<
        GradeToSubjectSchema[],
        AddGradeSubjectsBody[]
    >(
        MutationContextKey.ADD_GRADE_SUBJECTS,
        async (api, data) => {
            const { json } = await api.grade.createSubjects(data, grade);
            return json;
        },
        {
            onSuccess() {
                queryClient.refetchQueries(QueryContextKey.GRADES);
            },
        },
    );

    const [selectedSubjects, setSelectedSubjects] = useState<AddGradeSubjectsBody[]>([]);

    const selectedSubjectIds = useMemo(
        () => selectedSubjects.map(({ subject_id }) => subject_id),
        [selectedSubjects],
    );

    function onSelectSubject({ _id: subject_id, mark, select }: OnSubjectChangeArg) {
        const existsSubject = selectedSubjectIds.includes(subject_id);
        if (select && !existsSubject)
            setSelectedSubjects([...selectedSubjects, { subject_id, mark }]);
        else if (!select && existsSubject)
            setSelectedSubjects(
                selectedSubjects.filter((s) => s.subject_id !== subject_id),
            );
    }

    function onSubmit() {
        selectedSubjects.length !== 0 &&
            addSubjects(selectedSubjects, { onSuccess: onClose });
    }

    return (
        <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
            <PopoverTrigger>
                <Tooltip label="Edit grade subjects">
                    <IconButton
                        aria-label="Manage grade subjects"
                        size="sm"
                        icon={<FiEdit3 />}
                        colorScheme="gray"
                        onClick={onOpen}
                    />
                </Tooltip>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody maxH="60vh" overflowY="auto">
                    {curatedSubjects && curatedSubjects.length > 0 ? (
                        curatedSubjects?.map(({ name, _id }, i) => (
                            <GradeSubjectSelectorItem
                                key={_id + i}
                                _id={_id}
                                name={name}
                                onSubjectChange={onSelectSubject}
                            />
                        ))
                    ) : (
                        <Text textAlign="center" fontWeight="semibold">
                            No unused subject available
                            <br />
                            <CLink
                                color="green.500"
                                as={Link}
                                to="/school/configure/subjects"
                            >
                                Create one
                            </CLink>{" "}
                            to add a new one
                        </Text>
                    )}
                </PopoverBody>
                {curatedSubjects && curatedSubjects.length > 0 && (
                    <PopoverFooter as={HStack} justifyContent="flex-end">
                        <Button onClick={onClose} colorScheme="gray">
                            Cancel
                        </Button>
                        <Button onClick={onSubmit} isLoading={isLoading}>
                            Save
                        </Button>
                    </PopoverFooter>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default GradeSubjectSelector;

export interface GradeSubjectSelectorItemProps {
    _id: string;
    name: string;
    onSubjectChange: (arg: OnSubjectChangeArg) => void;
}

export const GradeSubjectSelectorItem: FC<GradeSubjectSelectorItemProps> = ({
    _id,
    name,
    onSubjectChange,
}) => {
    const id = uniqueId("subject-selection");
    const [mark, setMark] = useState<number>();

    return (
        <HStack p="3">
            <Checkbox
                id={id}
                isDisabled={!mark}
                onChange={({ target: { checked } }) =>
                    mark &&
                    onSubjectChange({
                        _id,
                        mark,
                        select: checked,
                    })
                }
            />
            <Text userSelect="none" htmlFor={id} as="label">
                {name}
            </Text>
            <NumberInput size="sm" min={10} max={100}>
                <NumberInputField
                    placeholder="Marks"
                    value={mark}
                    onChange={({ target: { value } }) => setMark(parseInt(value))}
                />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </HStack>
    );
};
