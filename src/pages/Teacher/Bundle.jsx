import React, { useEffect, useState } from 'react';
import { Container, Heading, Flex, Button } from '@chakra-ui/react';
import { getDataCourse } from '~/store/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import bundleService from '~/services/bundleService';
import { CourseBundle } from '~/components/Teacher/Bundle/CourseBundle';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const BundleList = () => {
  const [hoveredBundle, setHoveredBundle] = useState(null);
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);
  const [bundles, setBundles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmpty(courseData)) {
      dispatch(getDataCourse());
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const bundleRequest = { pageNumber: 0, size: 8, name: '' };

      const response = await bundleService.getMyBundle(bundleRequest);
      debugger;
      if (response) {
        setBundles(response.content);
      }
    } catch (error) {
      console.error('Error fetching enroll bundles:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h2" size="xl" mb={6}>
        Course Bundles
      </Heading>
      <Button onClick={() => navigate(config.routes.bundle_add)}>
        Add bundle
      </Button>
      <Flex wrap="wrap" gap={6} justify="center">
        {bundles.map((bundle) => (
          <CourseBundle
            key={bundle.id}
            data={bundle}
            isHovered={hoveredBundle === bundle.name}
            setHovered={setHoveredBundle}
            fetchCourses={fetchCourses}
          />
        ))}
      </Flex>
    </Container>
  );
};

export default BundleList;
