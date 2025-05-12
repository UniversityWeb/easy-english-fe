import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  Badge,
  VStack,
  HStack,
  Textarea,
  List,
  ListItem,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { CheckIcon, ArrowBackIcon } from '@chakra-ui/icons';
import writingResultService from '~/services/writingResultService';

const SupportWriting = ({ infoWriting }) => {
  const [activeTab, setActiveTab] = useState('original');
  const [data, setData] = useState(null);
  const [textSubmit, setTextSubmit] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [writingList, setWritingList] = useState([]);
  const [selectedWriting, setSelectedWriting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await writingResultService.imageToText(formData);
      setTextSubmit(response);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const submitWriting = async () => {
    const writingRequest = {
      submittedText: textSubmit,
    };

    setIsLoading(true); // Bắt đầu hiển thị loading

    try {
      const response =
        await writingResultService.supportWriting(writingRequest);
      setData(response);
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
    } finally {
      setIsLoading(false); // Kết thúc loading dù thành công hay thất bại
    }
  };

  const handleFeedBack = async () => {
    const writingRequest = {
      id: selectedWriting.id,
      submittedText: selectedWriting.submittedText,
      writingTaskId: selectedWriting.writingTaskId,
      feedback: JSON.stringify(data),
      status: 'FEEDBACK_PROVIDED',
    };
    try {
      const response = await writingResultService.updateWritingResult(
        writingRequest.id,
        writingRequest,
      );
      setData(response);
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
    } finally {
      setIsLoading(false); // Kết thúc loading dù thành công hay thất bại
    }
  };

  const fetchWritingList = async () => {
    try {
      //await writingResultService.getWritingResultForTeacher(writingList);
      const writingRequest = {
        writingTaskId: infoWriting.id,
        ownerUsername: '',
        status: 'SUBMITTED',
        pageNumber: 0,
        size: 8,
      };
      const writingList =
        await writingResultService.getWritingResult(writingRequest);
      console.log('writingList', writingList);
      setWritingList(writingList.content);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết:', error);
    }
  };

  useEffect(() => {
    fetchWritingList();
  }, []);

  const handleSelectWriting = (writing) => {
    setSelectedWriting(writing);
    setTextSubmit(writing.submittedText || '');
    setData(writing.feedback || '');
    setActiveTab('original');
  };

  const handleBack = () => {
    setSelectedWriting(null);
    setData(null);
    setTextSubmit('');
  };

  return (
    <Container maxW="container.xl" bg="#FAE6D8" p={4} borderRadius="md">
      {!selectedWriting && (
        <Box bg="white" p={4} borderRadius="md" boxShadow="md">
          <Text fontWeight="bold" mb={2}>
            Danh sách bài viết đã nộp
          </Text>
          <List spacing={2}>
            {writingList.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  p={2}
                  borderRadius="md"
                  bg="gray.50"
                  cursor="pointer"
                  _hover={{ bg: 'orange.100' }}
                  onClick={() => handleSelectWriting(item)}
                >
                  <Flex justify="space-between">
                    <Text fontWeight="medium">{item.ownerUsername}</Text>
                    <Badge
                      colorScheme={
                        item.status === 'SUBMITTED' ? 'yellow' : 'green'
                      }
                    >
                      {item.status}
                    </Badge>
                  </Flex>
                  {/* <Text fontSize="sm" noOfLines={1}>
                    {item.feedback || 'Chưa có phản hồi'}
                  </Text> */}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {selectedWriting && (
        <>
          <Button
            leftIcon={<ArrowBackIcon />}
            mb={4}
            colorScheme="gray"
            onClick={handleBack}
          >
            Quay lại danh sách
          </Button>

          <Flex gap={3} mb={4}>
            {['original', 'highlight', 'upgrade', 'sample'].map((tab) => (
              <Button
                key={tab}
                colorScheme={activeTab === tab ? 'orange' : 'gray'}
                fontWeight={activeTab === tab ? 'bold' : 'normal'}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'original'
                  ? 'Bài gốc'
                  : tab === 'highlight'
                    ? 'YouPass sửa bài'
                    : tab === 'upgrade'
                      ? 'Gợi ý nâng cấp'
                      : 'Sample từ YouPass'}
              </Button>
            ))}
          </Flex>

          <Flex gap={4} align="start">
            <Box flex="2" bg="white" p={6} borderRadius="md" boxShadow="md">
              <Text fontWeight="bold">
                Word count: {textSubmit?.split(' ').length || 0}/400
              </Text>

              <Box
                border="1px solid #000"
                p={4}
                my={4}
                borderRadius="md"
                fontWeight="bold"
              >
                {selectedWriting?.title || 'Không có tiêu đề'}
              </Box>

              {activeTab === 'original' && (
                <>
                  <HStack spacing={4} my={4}>
                    {selectedWriting?.status === 'SUBMITTED' && (
                      <>
                        <Button
                          leftIcon={
                            isLoading ? <Spinner size="sm" /> : <CheckIcon />
                          }
                          colorScheme="green"
                          onClick={submitWriting}
                          isLoading={isLoading}
                          loadingText="Đang chấm bài..."
                          disabled={isLoading}
                        >
                          {isLoading ? 'Đang chấm bài...' : 'AI chấm bài'}
                        </Button>
                        <Button
                          colorScheme="green"
                          onClick={handleFeedBack}
                          disabled={isLoading}
                        >
                          Feedback
                        </Button>
                      </>
                    )}
                  </HStack>
                  <Textarea
                    value={textSubmit}
                    height={500}
                    onChange={(e) => setTextSubmit(e.target.value)}
                    isDisabled={isLoading}
                  />
                </>
              )}

              {activeTab === 'highlight' && (
                <div
                  className="fix-by-ai"
                  dangerouslySetInnerHTML={{ __html: data?.fixByAI }}
                />
              )}
              {activeTab === 'upgrade' && (
                <div
                  className="upgrade-by-ai"
                  dangerouslySetInnerHTML={{ __html: data?.upgradeByAI }}
                />
              )}
              {activeTab === 'sample' && (
                <div dangerouslySetInnerHTML={{ __html: data?.sampleByAI }} />
              )}
            </Box>

            <Box flex="1">
              <VStack
                align="start"
                spacing={3}
                bg="white"
                p={4}
                borderRadius="md"
                mt={4}
                boxShadow="md"
              >
                <HStack>
                  <Badge colorScheme="yellow">Ngữ pháp</Badge>
                  <Badge colorScheme="green">Từ vựng</Badge>
                </HStack>
                {isLoading ? (
                  <Flex justify="center" w="100%" p={4}>
                    <VStack spacing={3}>
                      <Spinner size="lg" color="orange.500" thickness="4px" />
                      <Text color="gray.600">Đang phân tích bài viết...</Text>
                    </VStack>
                  </Flex>
                ) : (
                  data?.errorGrammarAndVocabulary?.map((item, index) => (
                    <Text key={index} bg="gray.100" p={3} borderRadius="md">
                      {item.error}
                    </Text>
                  ))
                )}
              </VStack>
            </Box>
          </Flex>
        </>
      )}
    </Container>
  );
};

export default SupportWriting;
