import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

const Announcement = () => {
    return (
        <Box mt={4}>
            <Text fontWeight="bold" fontSize="2xl" mb={4}>Productivity Hacks to Get More Done</Text>
            <VStack align="stretch" spacing={4}>
                <Text>
                    <strong>1. Vulcan News Feed Eradicator (free chrome extension)</strong> Stay focused by removing your Facebook newsfeed and replacing it with an inspirational quote.
                </Text>
                <Text>
                    <strong>2. Hide GUI (free extension for UE4)</strong> Stay focused by hiding your inbox. Click "show your inbox" at a scheduled time.
                </Text>
                <Text>
                    <strong>3. Habitica (free mobile + web app)</strong> Gamify your to-do list. Treat your life like a game and earn gold coins for completing tasks!
                </Text>

                <Text fontWeight="bold" fontSize="lg" mt={6}>Continue Your Learning with our 30 Day App Challenge</Text>

                <Text>1. So there you have it. 30 days to make and publish your app.</Text>
                <Text>2. Good luck and please post your questions to the community.</Text>
            </VStack>
        </Box>
    );
};

export default Announcement;