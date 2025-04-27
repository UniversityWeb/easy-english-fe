import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  Tag,
  Badge,
  VStack,
  HStack,
  Textarea,
} from '@chakra-ui/react';
import { CheckIcon, ChatIcon } from '@chakra-ui/icons';
import './WritingTaskPage.scss';
import writingService from '~/services/writingService';
import writingResultService from '~/services/writingResultService';
const text = {
  score: 6.5,
  errorGrammar: 6,
  errorVocabulary: 4,
  sampleAnswer:
    'The debate surrounding school uniforms is a prevalent one, with compelling arguments on both sides. While some advocate for mandatory uniforms, others champion the freedom of students to express themselves through their clothing choices. This essay will explore both perspectives before offering my own opinion.\n\nProponents of school uniforms often highlight the benefits of equality and discipline. Uniforms eliminate socio-economic disparities in appearance, preventing bullying and fostering a sense of unity among students. They also reduce distractions in the classroom, allowing students to focus on their studies rather than comparing outfits. Furthermore, uniforms can simplify the morning routine and alleviate pressure on parents to purchase trendy clothes.\n\nConversely, those who oppose school uniforms argue that they stifle individuality and self-expression. Clothing is a powerful tool for communicating personality and creativity, and forcing students to conform to a dress code can be detrimental to their self-esteem. Allowing students to choose their own clothes can also promote responsibility and decision-making skills. Moreover, some argue that uniforms are a financial burden for low-income families, as they still need to purchase clothes for non-school activities.\n\nIn my opinion, while both sides have valid points, the benefits of allowing students to choose their own clothing outweigh the drawbacks of uniforms. Fostering individuality and self-expression is crucial for personal development, and allowing students to choose their clothes empowers them to explore their identities and develop their own unique styles. While concerns about inequality and distraction are legitimate, they can be addressed through alternative measures, such as promoting a culture of respect and acceptance within the school environment.\n\nIn conclusion, the decision of whether or not to implement school uniforms is a complex one with valid arguments on both sides. However, I believe that allowing students to choose their own clothes promotes individuality, self-expression, and responsibility, ultimately contributing to a more positive and enriching learning environment.',
};

const question =
  'The table below illustrates weekly consumption by age group of dairy products in a European country. Summarise the information byselecting and reporting the main features, and make comparisons where relevant.';

const WritingTaskPage = ({ infoWriting }) => {
  console.log('infoWriting', infoWriting);
  const [activeTab, setActiveTab] = useState('original');
  const [data, setData] = useState(null);
  const [textSubmit, setTextSubmit] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const inputRef = useRef(null);
  const handleImageClick = () => {
    inputRef.current.click(); // Mở dialog chọn ảnh
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
      submittedText: 'Đề bài: ' + question + ' Bài làm: ' + textSubmit,
    };

    try {
      const response =
        await writingResultService.supportWriting(writingRequest);
      setData(response);
    } catch (error) {}
  };

  return (
    <Container maxW="container.xl" bg="#FAE6D8" p={4} borderRadius="md">
      {/* Thanh công cụ trên */}
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

      {/* Bố cục chính */}
      <Flex gap={4} align="start">
        {/* Nội dung bài viết */}
        <Box flex="2" bg="white" p={6} borderRadius="md" boxShadow="md">
          <Text fontWeight="bold">Word count: 289/400</Text>

          {/* Đoạn văn gốc */}
          <Box
            border="1px solid #000"
            p={4}
            my={4}
            borderRadius="md"
            fontWeight="bold"
          >
            {infoWriting?.title}
            {/* ({infoWriting?.instructions}) */}
          </Box>

          {/* Hình ảnh bảng số liệu */}

          {/* Thảo luận và chia sẻ */}

          {/* Nội dung bài viết theo tab */}
          {activeTab === 'original' && (
            <>
              <HStack spacing={4} my={4}>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {/* Nút gọi input và gọi API */}
                <Button
                  leftIcon={<ChatIcon />}
                  variant="outline"
                  onClick={handleImageClick}
                >
                  Ảnh
                </Button>
                <Button
                  leftIcon={<CheckIcon />}
                  colorScheme="green"
                  onClick={submitWriting}
                >
                  Nộp bài
                </Button>
              </HStack>
              {/* <Text>
                {text.sampleAnswer.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </Text> */}
              <Textarea
                value={textSubmit}
                height={500}
                onChange={(e) => setTextSubmit(e.target.value)}
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

        {/* Sidebar bên phải */}
        <Box flex="1">
          {/* Điểm số */}
          <VStack
            align="start"
            spacing={2}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="md"
          >
            <Badge colorScheme="green" fontSize="lg" p={2}>
              Band Score 5
            </Badge>
            <Badge colorScheme="blue">Task Achievement: 6</Badge>
            <Badge colorScheme="blue">Coherence & Cohesion: 5</Badge>
            <Badge colorScheme="blue">Lexical Resource: 5</Badge>
            <Badge colorScheme="blue">Grammar & Accuracy: 5</Badge>
            <Text color="red.500" fontWeight="bold">
              Lưu ý chấm điểm!
            </Text>
          </VStack>

          {/* Ghi chú ngữ pháp */}
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
            {data?.errorGrammarAndVocabulary?.map((item, index) => (
              <Text key={index} bg="gray.100" p={3} borderRadius="md">
                {item.error}
              </Text>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default WritingTaskPage;
