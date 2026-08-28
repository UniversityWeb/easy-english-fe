import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import topicService from '@/services/topicService';
import levelService from '@/services/levelService';
import priceService from '@/services/priceService';
import favouriteService from '@/services/favouriteService';
import courseService from '@/services/courseService';
import useCustomToast from '@/hooks/useCustomToast';

export interface UseCourseSearchOptions {
  fetchData: (params: any) => Promise<any>;
  enrichData?: boolean;
  defaultIsLiked?: boolean;
  extraFilterParams?: Record<string, any>;
  defaultItemsPerPage?: number;
  onPreviewClick?: (course: any) => void;
  onWishlistToggle?: (courseId: any, isCurrentlyLiked?: boolean) => Promise<void> | void;
}

const EMPTY_PARAMS = {};

export const useCourseSearch = ({
  fetchData,
  enrichData = true,
  defaultIsLiked = false,
  extraFilterParams = EMPTY_PARAMS,
  defaultItemsPerPage = 8,
  onPreviewClick,
  onWishlistToggle,
}: UseCourseSearchOptions) => {
  const navigate = useNavigate();
  const { successToast, errorToast } = useCustomToast();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [likedCourses, setLikedCourses] = useState<any[]>([]);

  const [filterOptions, setFilterOptions] = useState<any>({
    categoryIds: [],
    topicId: null,
    levelId: null,
    rating: null,
  });

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const requestPayload = {
        pageNumber: currentPage - 1,
        size: itemsPerPage,
        title: searchTerm || null,
        categoryIds:
          filterOptions.categoryIds && filterOptions.categoryIds.length > 0
            ? filterOptions.categoryIds
            : null,
        rating: filterOptions.rating || null,
        topicId: filterOptions.topicId || null,
        levelId: filterOptions.levelId || null,
        ...extraFilterParams,
      };

      const [response, topicsData, levelsData] = await Promise.all([
        fetchData(requestPayload),
        enrichData ? topicService.fetchAllTopic().catch(() => []) : Promise.resolve([]),
        enrichData ? levelService.fetchAllLevel().catch(() => []) : Promise.resolve([]),
      ]);

      if (response) {
        const rawContent = response.content || [];
        const pages = response.totalPages || 1;

        let processedCourses = rawContent;

        if (enrichData && rawContent.length > 0) {
          const topicsMap = new Map((topicsData || []).map((t: any) => [t.id, t.name]));
          const levelsMap = new Map((levelsData || []).map((l: any) => [l.id, l.name]));

          processedCourses = await Promise.all(
            rawContent.map(async (item: any) => {
              const targetCourse = item.course ? item.course : item;
              let coursePrice = targetCourse.price;

              if (!coursePrice || coursePrice.price == null) {
                try {
                  const fetchedPrice = await priceService.fetchPriceByCourse({
                    courseId: targetCourse.id,
                  });
                  if (fetchedPrice && fetchedPrice.price != null) {
                    coursePrice = fetchedPrice;
                  }
                } catch {
                  // Fallback to existing
                }
              }

              const topicName =
                targetCourse.topic?.name ||
                (targetCourse.topic?.id ? topicsMap.get(targetCourse.topic.id) : null) ||
                targetCourse.topic?.name;

              const levelName =
                targetCourse.level?.name ||
                (targetCourse.level?.id ? levelsMap.get(targetCourse.level.id) : null) ||
                targetCourse.level?.name;

              const enrichedCourse = {
                ...targetCourse,
                price: coursePrice,
                topic: {
                  ...targetCourse.topic,
                  name: topicName,
                },
                level: {
                  ...targetCourse.level,
                  name: levelName,
                },
              };

              return item.course ? { ...item, course: enrichedCourse } : enrichedCourse;
            }),
          );
        }

        setCourses(processedCourses);
        setTotalPages(pages);

        if (!defaultIsLiked) {
          const likedStatus = await Promise.all(
            processedCourses.map(async (item: any) => {
              const courseId = item.course ? item.course.id : item.id;
              const isLiked = await favouriteService.checkCourseInFavourite(courseId);
              return { id: courseId, liked: isLiked };
            }),
          );
          setLikedCourses(likedStatus);
        }
      } else {
        setCourses([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      errorToast('Error loading courses');
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    filterOptions,
    extraFilterParams,
    fetchData,
    enrichData,
    defaultIsLiked,
    errorToast,
  ]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadCourses();
  };

  const handleWishlistToggle = async (id: any, isCurrentlyLiked?: boolean) => {
    if (onWishlistToggle) {
      await onWishlistToggle(id, Boolean(isCurrentlyLiked));
      return;
    }

    try {
      if (isCurrentlyLiked) {
        await favouriteService.deleteFavourite(id);
        successToast('Removed from wishlist');
      } else {
        await favouriteService.addFavourite(id);
        successToast('Added to wishlist');
      }

      setLikedCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, liked: !c.liked } : c)),
      );
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      errorToast('Error updating wishlist');
    }
  };

  const handlePreview = async (course: any) => {
    if (onPreviewClick) {
      onPreviewClick(course);
      return;
    }
    const courseId = course.id;
    try {
      await courseService.countView(courseId);
    } catch (e) {
      console.error(e);
    }
    navigate(`/course-view-detail/${courseId}`);
  };

  return {
    courses,
    loading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    likedCourses,
    filterOptions,
    setFilterOptions,
    handleSearch,
    handleWishlistToggle,
    handlePreview,
    navigate, // provide navigate to components
  };
};
