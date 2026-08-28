import { useState, useCallback, useMemo } from 'react';
import {
  Tab,
  TabList,
  Tabs,
} from '@chakra-ui/react';

import EnrolledCourseCard from '@/components/organisms/EnrolledCourseCard';
import CourseSearchLayout from '@/components/organisms/CourseSearchLayout';
import enrollmentService from '@/services/enrollmentService';
import config from '@/config';
import { useCourseSearch } from '@/hooks/useCourseSearch';

const EnrollCoursePage = () => {
  const [statusTab, setStatusTab] = useState<'ALL' | 'CONTINUE' | 'COMPLETED'>('ALL');

  const fetchEnrolledCourses = useCallback(async (params: any) => {
    const response = await enrollmentService.getEnrollByFilter(params);
    if (!response) return null;

    let filteredCourses = response.content || [];
    if (statusTab === 'CONTINUE') {
      filteredCourses = filteredCourses.filter(
        (enrollment: any) => enrollment.progress > 0 && enrollment.progress < 100,
      );
    } else if (statusTab === 'COMPLETED') {
      filteredCourses = filteredCourses.filter(
        (enrollment: any) => enrollment.progress === 100,
      );
    }

    return {
      ...response,
      content: filteredCourses,
    };
  }, [statusTab]);

  const extraFilterParams = useMemo(() => ({ statusTab }), [statusTab]);

  const searchState = useCourseSearch({
    fetchData: fetchEnrolledCourses,
    extraFilterParams,
  });



  return (
    <CourseSearchLayout
      pageTitle="Enrolled Courses"
      searchState={searchState}
      searchPlaceholder="Search enrolled courses..."
      emptyMessage="No enrolled courses available"
      headerExtra={
        <Tabs
          variant="enclosed"
          colorScheme="blue"
          onChange={(index) => {
            if (index === 0) setStatusTab('ALL');
            else if (index === 1) setStatusTab('CONTINUE');
            else if (index === 2) setStatusTab('COMPLETED');
          }}
        >
          <TabList>
            <Tab fontWeight="semibold">All</Tab>
            <Tab fontWeight="semibold">Continue</Tab>
            <Tab fontWeight="semibold">Completed</Tab>
          </TabList>
        </Tabs>
      }
      renderCard={(enrollment: any, { navigate }: any) => (
        <EnrolledCourseCard
          key={enrollment.id}
          enrollment={enrollment}
          navigate={navigate}
        />
      )}
    />
  );
};

export default EnrollCoursePage;
