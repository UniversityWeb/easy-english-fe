import { useState, useCallback, useEffect } from 'react';
import topicService from '@/services/topicService';
import categoryService from '@/services/categoryService';
import levelService from '@/services/levelService';

export const useFilterData = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [topicsData, categoriesData] = await Promise.all([
        topicService.fetchAllTopic(),
        categoryService.fetchAllCategory(),
      ]);
      setTopics(topicsData || []);
      setCategories(categoriesData || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleTopicChangeFetch = async (topicId: any) => {
    try {
      const levelsData = await levelService.fetchAllLevelByTopic({ topicId });
      setLevels(levelsData || []);
    } catch (e) {
      console.error(e);
      setLevels([]);
    }
  };

  return {
    topics,
    categories,
    levels,
    handleTopicChangeFetch,
  };
};
