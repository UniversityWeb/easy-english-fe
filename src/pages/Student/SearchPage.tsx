import courseService from '@/services/courseService';
import CourseSearchLayout from '@/components/organisms/CourseSearchLayout';
import { useCourseSearch } from '@/hooks/useCourseSearch';

const SearchPage = () => {
  const searchState = useCourseSearch({
    fetchData: courseService.getCourseByFilter,
  });

  return (
    <CourseSearchLayout
      searchState={searchState}
      searchPlaceholder="Search for courses..."
      emptyMessage="No courses found"
    />
  );
};

export default SearchPage;
