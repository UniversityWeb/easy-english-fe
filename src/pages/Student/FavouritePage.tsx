import favouriteService from '@/services/favouriteService';
import CourseSearchLayout from '@/components/organisms/CourseSearchLayout';
import { useCourseSearch } from '@/hooks/useCourseSearch';

const FavouritePage = () => {
  const searchState = useCourseSearch({
    fetchData: favouriteService.getFavouriteByFilter,
    defaultIsLiked: true,
  });

  return (
    <CourseSearchLayout
      searchState={searchState}
      searchPlaceholder="Search in wishlist..."
      emptyMessage="No favorites available"
      defaultIsLiked={true}
    />
  );
};

export default FavouritePage;
