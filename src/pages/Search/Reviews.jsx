import React, { useEffect, useState } from 'react';
import { Box, Text, HStack, VStack, Progress, Button, Icon, Spinner } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import reviewService from '~/services/reviewService';

const Reviews = ({ courseId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingsCount, setRatingsCount] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            const response = await reviewService.fetchReviewByCourse({ courseId: courseId });
            if (response) {
                setReviews(response);
                calculateAverageRating(response);
            }
            setLoading(false);
        };
        fetchReviews();
    }, [courseId]);

    const calculateAverageRating = (reviews) => {
        const count = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const total = reviews.reduce((acc, review) => {
            count[review.rating] += 1;
            return acc + review.rating;
        }, 0);
        setRatingsCount(count);
        setAverageRating((total / reviews.length).toFixed(1));
    };

    if (loading) return <Spinner />;

    return (
        <Box mt={4}>
            <HStack spacing={4} align="center">
                <Text fontSize="4xl" fontWeight="bold">{averageRating}</Text>
                <VStack align="flex-start">
                    <HStack>
                        {[...Array(Math.floor(averageRating))].map((_, i) => (
                            <Icon key={i} as={FaStar} color="orange.400" />
                        ))}
                        {averageRating % 1 !== 0 && <Icon as={FaStar} color="gray.300" />}
                    </HStack>
                    <Text fontSize="sm">{reviews.length} review(s)</Text>
                </VStack>
                <Button colorScheme="blue" variant="outline" size="sm">Write Review</Button>
            </HStack>

            <Box mt={4}>
                <VStack spacing={2} align="stretch">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <HStack key={star} justify="space-between">
                            <Text>Stars {star}</Text>
                            <Progress value={(ratingsCount[star] / reviews.length) * 100} size="sm" colorScheme="blue" w="70%" />
                            <Text>{ratingsCount[star]}</Text>
                        </HStack>
                    ))}
                </VStack>
            </Box>

            <Box mt={6}>
                {reviews.map((review) => (
                    <Box key={review.id} mt={4}>
                        <HStack>
                            {[...Array(review.rating)].map((_, i) => (
                                <Icon key={i} as={FaStar} color="orange.400" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                                <Icon key={i} as={FaStar} color="gray.300" />
                            ))}
                            <Text fontWeight="bold">{review.comment}</Text>
                        </HStack>
                        <Text>by {review.owner}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Reviews;
