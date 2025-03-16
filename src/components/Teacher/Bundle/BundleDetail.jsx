import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useImperativeHandle } from 'react';
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

export const courses = [
  {
    id: 1,
    title: 'Basics of Masterstudy',
    price: '$0',
    image:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
  },
  {
    id: 2,
    title: 'How to be a DJ? Make Electronic Music',
    price: '$49.99',
    image:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
  },
  {
    id: 3,
    title: 'Real Things Art Painting by Jason Ni',
    price: '$0',
    image:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
  },
  {
    id: 4,
    title: 'Minimalism, How to make things simpler',
    price: '$0',
    image:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
  },
  {
    id: 5,
    title: 'Vector Design Basics Masterclass',
    price: '$90.99',
    image:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
  },
  {
    id: 6,
    title: 'Web Coding and Apache Basics theory',
    price: '$0',
    image:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
  },
];

const EditingForm = forwardRef(({ data = {} }, ref) => {
  const schema = yup.object().shape({
    BundleName: yup.string().required(),
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
      BundleName: 'Hungsam',
      BundleDescription: 'Hungsam',
      BundlePrice: 12,
      // Bundle: [
      //   {
      //     id: 1,
      //     title: 'Basics of Masterstudy',
      //     price: '$0',
      //     image:
      //       'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
      //   },
      //   {
      //     id: 2,
      //     title: 'How to be a DJ? Make Electronic Music',
      //     price: '$49.99',
      //     image:
      //       'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
      //   },
      // ],
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

  const handleSave = (data) => {
    console.log(data);
  };

  const watchData = useWatch({
    control,
    name: ['ResourceCode'],
  });

  return (
    <div
      style={{
        margin: '30px 100px 30px 100px',
        width: '1000px',
      }}
    >
      <FormDataWrapper methods={methods}>
        <SelectCourseField
          fieldName="Bundle"
          control={control}
          errors={errors}
          courses={courseData}
          className="col-xs-12 col-md-12" // chỉnh độ dài
        />
        <TextField
          fieldName="BundleName"
          control={control}
          errors={errors}
          label="Bundle Name"
          disable={false}
          className="col-xs-12 col-md-12" // chỉnh độ dài
        />
        <UploadFileFiled
          fieldName="BundlePrice"
          control={control}
          errors={errors}
          label="Bundle price"
          className="col-xs-12 col-md-12" // chỉnh độ dài
        />
        <TextAreaField
          fieldName="BundleDescription"
          control={control}
          errors={errors}
          label="Bundle description"
          disable={false}
          className="col-xs-12 col-md-12" // chỉnh độ dài
        />
        <TextField
          fieldName="BundlePrice"
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
      <Button
        mt={4}
        colorScheme="blue"
        onClick={methods.handleSubmit(handleSave)}
        type="submit"
      >
        Save
      </Button>
    </div>
  );
});
export default EditingForm;
