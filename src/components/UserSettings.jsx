import React, { useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCustomToast from '~/hooks/useCustomToast';
import userService from '~/services/userService';

// Validation schema
const schema = yup.object().shape({
  autoReplyEnabled: yup.boolean(),
  autoReplyMessage: yup.string().when('autoReplyEnabled', {
    is: true,
    then: () => yup.string().required('Auto-reply message is required'),
    otherwise: () => yup.string().notRequired(),
  }),
});

const UserSettings = ({ user }) => {
  const { successToast, errorToast } = useCustomToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
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
    defaultValue: false,
  });

  useEffect(() => {
    if (user) {
      const settings = user?.settings;
      reset({
        autoReplyEnabled: settings?.autoReplyEnabled ?? false,
        autoReplyMessage: settings?.autoReplyMessage ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (settings) => {
    console.log('Submitted:', settings);

    try {
      if (!settings.autoReplyEnabled) {
        settings.autoReplyMessage = '';
      }
      const updatedUser = await userService.updateOwnSettings(settings);

      successToast('Settings saved.');
    } catch (error) {
      console.error('Failed to update settings:', error);
      errorToast('Error saving settings.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Controller
          control={control}
          name="autoReplyEnabled"
          render={({ field }) => (
            <Checkbox isChecked={field.value} onChange={field.onChange}>
              Enable auto-reply message
            </Checkbox>
          )}
        />

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
