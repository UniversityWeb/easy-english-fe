import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import React, { forwardRef } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import FormDataWrapper from '~/components/Form/FormDataWrapper';
import SelectCourseField from '~/components/Form/SelectCourseField';
import TextField from '~/components/Form/TextField';
import TextAreaField from '~/components/Form/TextAreaField';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getDataCourse } from '~/store/courseSlice';
import bundleService from '~/services/bundleService';
import useCustomToast from '~/hooks/useCustomToast';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const EditingForm = forwardRef(({ data = {} }, ref) => {
  const schema = yup.object().shape({
    //BundleName: yup.string().required(),
  });
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);

  useEffect(() => {
    if (isEmpty(courseData)) {
      dispatch(getDataCourse());
    }
  }, []);

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      ...data,
    },
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  useImperativeHandle(ref, () => ({
    submitForm: (onValid, onInvalid) => handleSubmit(onValid, onInvalid)(),
  }));

  const watchData = useWatch({
    control,
    name: ['courseIds'],
  });

  console.log('data', data);

  return (
    <div
      style={{
        margin: '30px 100px 30px 100px',
        width: '1000px',
      }}
    >
      <FormDataWrapper methods={methods}>
        <SelectCourseField
          fieldName="courseIds"
          control={control}
          errors={errors}
          courses={courseData}
          className="col-xs-12 col-md-12" // chỉnh độ dài
        />
        <TextField
          fieldName="name"
          control={control}
          errors={errors}
          label="Bundle Name"
          disable={false}
          className="col-xs-12 col-md-12" // chỉnh độ dài
        />

        <TextAreaField
          fieldName="desc"
          control={control}
          errors={errors}
          label="Bundle description"
          disable={false}
          className="col-xs-12 col-md-12" // chỉnh độ dài
        />
        <TextField
          fieldName="price"
          control={control}
          errors={errors}
          label="Bundle price"
          disable={false}
          className="col-xs-12 col-md-12" // chỉnh độ dài
          type="number"
        />

        {/* <div>{watchData[0]}</div>
      <button onClick={methods.handleSubmit(handleSave)} type="submit">
        Submit
      </button> */}
      </FormDataWrapper>
    </div>
  );
});

const NewBundle = () => {
  const formRef = useRef(null);
  const { successToast, errorToast } = useCustomToast();

  const handleSave = useCallback(() => {
    formRef.current?.submitForm(async (data) => {
      const updateBundle = await bundleService.createBundle(data);
      if (updateBundle) {
        successToast(`Bundle updated successfully.`);
      } else {
        errorToast(`An error occurred while updating the bundle .`);
      }
    });
  }, []);

  return (
    <RoleBasedPageLayout>
      <EditingForm ref={formRef} data={[]} />
      <Flex mt={4} justify="center">
        <Button colorScheme="blue" onClick={handleSave} type="submit">
          Save
        </Button>
      </Flex>
    </RoleBasedPageLayout>
  );
};

export default NewBundle;
