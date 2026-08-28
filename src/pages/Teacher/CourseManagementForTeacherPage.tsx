import { useState, useMemo } from 'react';
import {
  Tab,
  TabList,
  Tabs,
} from '@chakra-ui/react';
import CourseSearchLayout from '@/components/organisms/CourseSearchLayout';
import courseService from '@/services/courseService';
import TeacherCourseCard from '@/components/organisms/TeacherCourseManagementForTeacherCourseCard';
import config from '@/config';
import { useCourseSearch } from '@/hooks/useCourseSearch';

const CourseManagementForTeacherPage = () => {
  const [statusTab, setStatusTab] = useState<string | null>(null);

  const statusMapping = [
    null,
    'PUBLISHED',
    'PENDING_APPROVAL',
    'REJECTED',
    'DRAFT',
  ];

  const extraFilterParams = useMemo(() => ({ status: statusTab }), [statusTab]);

  const searchState = useCourseSearch({
    fetchData: courseService.fetchAllCourseOfTeacher,
    extraFilterParams,
  });

  return (
    <CourseSearchLayout
      pageTitle="Course Management"
      searchState={searchState}
      searchPlaceholder="Search your courses..."
      emptyMessage="No courses available"
      headerExtra={
        <Tabs
          variant="enclosed"
          colorScheme="blue"
          onChange={(index) => setStatusTab(statusMapping[index])}
        >
          <TabList>
            <Tab fontWeight="semibold">All</Tab>
            <Tab fontWeight="semibold">PUBLISHED</Tab>
            <Tab fontWeight="semibold">PENDING_APPROVAL</Tab>
            <Tab fontWeight="semibold">REJECTED</Tab>
            <Tab fontWeight="semibold">DRAFT</Tab>
          </TabList>
        </Tabs>
      }
      renderCard={(course, { navigate }) => (
        <TeacherCourseCard
          key={course.id}
          course={course}
          onMakeFeatured={() => {
            navigate(config.routes.course_detail(course?.id), {
              state: {
                returnUrl: config.routes.course_management_for_teacher,
              },
            });
          }}
        />
      )}
    />
  );
};

export default CourseManagementForTeacherPage;
