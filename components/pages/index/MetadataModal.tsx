import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  VStack,
} from '@chakra-ui/react';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { PostgrestResponse } from '@supabase/supabase-js';
import TextField from 'components/shared/TextField/TextField';
import { Field, Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useMutation } from 'react-query';
import { titumir, UserSchema } from 'services/titumir';
import * as yup from 'yup';

interface MetadataModalProps {
  isOpen: boolean;
  onClose(): void;
}

const MetadataModal: FC<MetadataModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const { mutate: createUserMetadata, isLoading } = useMutation<
    PostgrestResponse<UserSchema> | null,
    unknown,
    { firstname: string; lastname: string }
  >(
    'add-additional-user-metadata',
    async (data) => {
      if (!user) return null;
      return titumir.user.create(
        {
          id: user.id,
          ...data,
        },
        { returning: 'minimal' }
      );
    },
    {
      onSuccess(data) {
        if (!data?.error) onClose();
      },
    }
  );

  const UserMetadataSchema = yup.object().shape({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">We need some extra details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ firstname: '', lastname: '' }}
            validationSchema={UserMetadataSchema}
            onSubmit={(values) => {
              createUserMetadata(values);
            }}
          >
            <Form>
              <VStack spacing="2">
                <Field
                  component={TextField}
                  name="firstname"
                  label="First Name"
                  required
                />
                <Field
                  component={TextField}
                  name="lastname"
                  label="Last Name"
                  required
                />
                <Button type="submit" isLoading={isLoading}>
                  Submit
                </Button>
              </VStack>
            </Form>
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MetadataModal;
