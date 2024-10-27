import React, { useState } from 'react';
import { Box, Text, Icon, Collapse, VStack, HStack } from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
    const [isOpen1, setIsOpen1] = useState(false); // Trạng thái cho câu hỏi 1
    const [isOpen2, setIsOpen2] = useState(false); // Trạng thái cho câu hỏi 2

    const toggleFAQ1 = () => setIsOpen1(!isOpen1); // Toggle cho câu hỏi 1
    const toggleFAQ2 = () => setIsOpen2(!isOpen2); // Toggle cho câu hỏi 2

    return (
        <Box mt={4}>
            <VStack spacing={4} align="stretch">
                {/* Câu hỏi 1 */}
                <Box>
                    <HStack justify="space-between" cursor="pointer" onClick={toggleFAQ1}>
                        <Text fontWeight="bold" fontSize="lg">What is Lorem Ipsum?</Text>
                        <Icon as={isOpen1 ? FaChevronUp : FaChevronDown} />
                    </HStack>
                    <Collapse in={isOpen1} animateOpacity>
                        <Text mt={2}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
                        </Text>
                    </Collapse>
                </Box>

                {/* Câu hỏi 2 */}
                <Box>
                    <HStack justify="space-between" cursor="pointer" onClick={toggleFAQ2}>
                        <Text fontWeight="bold" fontSize="lg">Why do we use it?</Text>
                        <Icon as={isOpen2 ? FaChevronUp : FaChevronDown} />
                    </HStack>
                    <Collapse in={isOpen2} animateOpacity>
                        <Text mt={2}>
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                        </Text>
                    </Collapse>
                </Box>
            </VStack>
        </Box>
    );
};

export default FAQ;
