import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import React, { forwardRef } from 'react';

import { Button } from '@chakra-ui/react';
import FormDataWrapper from '~/components/Form/FormDataWrapper';
import SelectCourseField from '~/components/Form/SelectCourseField';
import TextField from '~/components/Form/TextField';
import UploadFileFiled from '~/components/Form/UploadFileFiled';
import TextAreaField from '~/components/Form/TextAreaField';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getDataCourse } from '~/store/courseSlice';
import bundleService from '~/services/bundleService';
import { useParams } from 'react-router-dom';
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
        <UploadFileFiled
          fieldName="imagePreview"
          control={control}
          errors={errors}
          label="Bundle price"
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

const BundleDetail = () => {
  const [data, setData] = useState(null);
  const formRef = useRef(null);
  const { bundleId } = useParams();
  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    fetchBundle();
  }, []);

  const fetchBundle = async () => {
    try {
      const response = await bundleService.getBundleById(bundleId);
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.error('Error fetching enroll bundles:', error);
    }
  };

  const handleSave = useCallback(() => {
    formRef.current?.submitForm(async (data) => {
      const updateBundle = await bundleService.updateBundle(data.id, data);
      if (updateBundle) {
        successToast(`Bundle updated successfully.`);
      } else {
        errorToast(`An error occurred while updating the bundle .`);
      }
    });
  }, []);
  // Chỉ render khi `data` có giá trị
  if (!data) return null;

  return (
    <RoleBasedPageLayout>
      <div>
        <EditingForm ref={formRef} data={data} />
        <Button mt={4} colorScheme="blue" onClick={handleSave} type="submit">
          Save
        </Button>
      </div>
    </RoleBasedPageLayout>
  );
};

export default BundleDetail;
