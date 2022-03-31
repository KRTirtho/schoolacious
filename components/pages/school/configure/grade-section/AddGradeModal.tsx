import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FaPlusSquare } from 'react-icons/fa';
import React, { FC } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { MutationContextKey, QueryContextKey } from 'configs/enums';
import { useMutation, useQueryClient } from 'react-query';
import { GradeSchema, titumir } from 'services/titumir';
import TextField from 'components/shared/TextField/TextField';
import { useUserMeta } from 'services/titumir-hooks/useUserMeta';

/* TODO: instead of creating multiple grades at once, make the titumir
         able to create one grade with grade-moderator & grade-examiner & 
         grade-subjects. That makes these three field non-nullable

         From now on, grade must've grade moderator, examiner & subjects from the very beginning
 */

export interface GradeCreationFormSchema {
  standard: number;
}

export interface AddGradeModalProps {
  grades?: number[];
}

const AddGradeModal: FC<AddGradeModalProps> = ({ grades }) => {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const queryClient = useQueryClient();
  const { data: userMeta } = useUserMeta();

  const {
    mutate: createGrade,
    isLoading,
    error,
  } = useMutation<GradeSchema | null, Error, number>(
    MutationContextKey.CREATE_GRADES,
    async (standard) => {
      const { data } = await titumir.grade.create({
        standard,
        owner_id: userMeta?.school?.id,
      });
      return data;
    },
    {
      onSuccess() {
        queryClient.refetchQueries(QueryContextKey.GRADES);
      },
    }
  );

  function handleClose() {
    onClose();
  }

  function handleSubmission(
    values: GradeCreationFormSchema,
    { resetForm, setSubmitting }: FormikHelpers<GradeCreationFormSchema>
  ) {
    createGrade(values.standard, {
      onSuccess() {
        setSubmitting(false);
        resetForm();
      },
      onError() {
        setSubmitting(false);
      },
    });
  }

  const GradeBodySchema = yup.object().shape({
    standard: yup.number().max(50).min(1).required(),
  });

  return (
    <>
      <Button variant="ghost" onClick={onToggle} leftIcon={<FaPlusSquare />}>
        Add Grades
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="4xl"
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Grade</ModalHeader>
          <Formik
            initialValues={{
              standard: Math.max(...(grades ? grades : [0])) + 1,
            }}
            onSubmit={handleSubmission}
            validationSchema={GradeBodySchema}
          >
            <Form>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing="4" direction={['column', null, 'row']}>
                  <Field
                    component={TextField}
                    name="standard"
                    type="number"
                    placeholder="Grade No."
                    max={50}
                    min={1}
                  />
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={handleClose}
                  colorScheme="gray"
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button isLoading={isLoading} type="submit">
                  Create
                </Button>
              </ModalFooter>
              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddGradeModal;
