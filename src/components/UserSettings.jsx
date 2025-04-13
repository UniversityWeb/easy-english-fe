import React from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCustomToast from '~/hooks/useCustomToast';

// Validation schema
const schema = yup.object().shape({
  autoReplyEnabled: yup.boolean(),
  autoReplyMessage: yup.string().when('autoReplyEnabled', {
    is: true,
    then: yup.string().required('Auto-reply message is required'),
    otherwise: yup.string(),
  }),
});

const UserSettings = () => {
  const { successToast } = useCustomToast();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      autoReplyEnabled: false,
      autoReplyMessage: '',
    },
  });

  const autoReplyEnabled = useWatch({
    control,
    name: 'autoReplyEnabled',
  });

  const onSubmit = (data) => {
    console.log('Submitted:', data);
    successToast('Settings saved.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl>
          <Checkbox {...register('autoReplyEnabled')}>
            Enable auto-reply message
          </Checkbox>
        </FormControl>

        {autoReplyEnabled && (
          <FormControl isInvalid={!!errors.autoReplyMessage}>
            <FormLabel>Message to reply</FormLabel>
            <Textarea
              placeholder="I'm currently away. I'll get back to you soon."
              {...register('autoReplyMessage')}
            />
            {errors.autoReplyMessage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.autoReplyMessage.message}
              </p>
            )}
          </FormControl>
        )}

        <Button
          bg="cyan.600"
          color="white"
          size="md"
          width="fit-content"
          type="submit"
          isLoading={isSubmitting}
        >
          Save Settings
        </Button>
      </Stack>
    </form>
  );
};

export default UserSettings;
