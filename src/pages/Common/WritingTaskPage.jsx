import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { CheckIcon, ChatIcon } from '@chakra-ui/icons';

const WritingTaskPage = () => {
  const [activeTab, setActiveTab] = useState('original');

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
            The table below illustrates weekly consumption by age group of dairy
            products in a European country. Summarise the information by
            selecting and reporting the main features, and make comparisons
            where relevant.
          </Box>

          {/* Hình ảnh bảng số liệu */}
          <Flex justify="center" my={4}>
            <img
              src="https://cms.youpass.vn/assets/29a06a2d-2af8-49e0-847f-9af15f7ae8f5?width=500"
              alt="Table data"
              style={{ border: '1px solid black' }}
            />
          </Flex>

          {/* Thảo luận và chia sẻ */}
          <HStack spacing={4} my={4}>
            <Button leftIcon={<ChatIcon />} variant="outline">
              11 thảo luận
            </Button>
            <Button leftIcon={<CheckIcon />} colorScheme="green">
              Chia sẻ bài làm
            </Button>
          </HStack>

          {/* Nội dung bài viết theo tab */}
          {activeTab === 'original' && (
            <>
              <Text>
                The given table shows the information for weekly consumption by
                age group about from 25 to 65+ of dairy goods in a European
                country.
              </Text>
              <Text mt={2}>
                Overall, it is obvious that the senior group is has the most
                highest intake of milk about at 1900 ml, while middle ages group
                has the most highest consumption to use of butter.
              </Text>
              <Text mt={2}>
                Additionally, the youngest age group shows the lowest dairy
                consumption, indicating a trend of increasing intake with age.
                This pattern suggests that dietary habit evolve over time,
                potentially due to health awareness or lifestyle changes.
              </Text>
            </>
          )}

          {activeTab === 'highlight' && (
            <>
              <Text>
                The given table presents data on weekly dairy consumption by
                different age groups, ranging
                <Tag bg="yellow.300">about</Tag>
                <Tag bg="yellow.500">FROM</Tag> 25 to 65+ in a European country.
              </Text>
              <Text mt={2}>
                Overall, it is evident that the senior group{' '}
                <Tag bg="yellow.300">is</Tag>
                <Tag bg="yellow.500">HAS</Tag> the{' '}
                <Tag bg="yellow.300">most highest</Tag>
                <Tag bg="yellow.500">HIGHEST</Tag> intake of milk, reaching{' '}
                <Tag bg="yellow.300">about</Tag>
                <Tag bg="yellow.500">AT</Tag> 1900 ml per week. Meanwhile, the
                middle <Tag bg="yellow.500">ages</Tag>
                <Tag bg="yellow.500">AGE</Tag> group{' '}
                <Tag bg="yellow.500">HAS</Tag> the{' '}
                <Tag bg="yellow.500">HIGHEST</Tag> consumption{' '}
                <Tag bg="yellow.300">to use</Tag>
                <Tag bg="yellow.500">OF</Tag> butter, significantly exceeding
                other age categories.
              </Text>
              <Text mt={2}>
                Additionally, the youngest age group shows the lowest dairy
                consumption, indicating a<Tag bg="yellow.300">trend</Tag>
                <Tag bg="yellow.500">TENDENCY</Tag> of increasing intake with
                age. This pattern suggests that dietary
                <Tag bg="yellow.300">habit</Tag>
                <Tag bg="yellow.500">HABITS</Tag> evolve over time, potentially
                due to health awareness or lifestyle changes.
              </Text>
            </>
          )}

          {activeTab === 'upgrade' && (
            <>
              <Text>
                <u style={{ color: 'green' }}>Overall</u>, milk consumption{' '}
                <u style={{ color: 'green' }}>tends to increase</u> with age,
                with the <u style={{ color: 'green' }}>65+ age group</u>{' '}
                consuming the <u style={{ color: 'green' }}>highest volume</u>.
                This trend suggests that{' '}
                <u style={{ color: 'green' }}>older individuals</u> may rely
                more on milk for its{' '}
                <u style={{ color: 'green' }}>nutritional benefits</u>,
                particularly for <u style={{ color: 'green' }}>bone health</u>.
                Conversely, butter consumption{' '}
                <u style={{ color: 'green' }}>peaks</u> in the{' '}
                <u style={{ color: 'green' }}>middle-aged group (45-64)</u> and
                then <u style={{ color: 'green' }}>declines</u>. This could be
                due to <u style={{ color: 'green' }}>dietary changes</u> as
                people grow older, with a shift toward{' '}
                <u style={{ color: 'green' }}>healthier fat alternatives</u>.
                Additionally,{' '}
                <u style={{ color: 'green' }}>younger age groups</u> may consume{' '}
                <u style={{ color: 'green' }}>less butter</u> due to evolving{' '}
                <u style={{ color: 'green' }}>dietary preferences</u>,
                influenced by <u style={{ color: 'green' }}>health awareness</u>{' '}
                and <u style={{ color: 'green' }}>modern food trends</u>.
              </Text>
            </>
          )}

          {activeTab === 'sample' && (
            <>
              <Text fontWeight="bold">
                Đây là bài mẫu từ YouPass với cách viết cải thiện:
              </Text>
              <Text mt={2}>
                The given table contains information about weekly dairy
                consumption in four age groups, namely below 25, 26 to 45, 45 to
                65, and over 65. <br />
                Overall, it is clear that people of their retirement age drink
                the most milk, while those in the second oldest group eat by far
                the most butter. <br />
                In addition, people across all age demographics prefer the
                low-fat alternative for both products, with the exception of the
                youngest group. Regarding milk consumption, people under 25
                drink the least milk, at 1200ml per week, 59% of which is full
                fat, while the rest is low fat. 80% of the 1650ml drunk by those
                from 26 to 45 is low-fat milk, compared to 20% for full fat.
                Similarly, people in the second oldest age group drink 1670ml a
                week, at 55% for low fat versus 45% for full fat. 1900ml is
                drunk per week by the elderly, only 30% of which is full fat,
                while the remaining 70% is low fat.
              </Text>
            </>
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
            <Text bg="gray.100" p={2} borderRadius="md">
              Khi nói về phạm vi độ tuổi, ta dùng "from... to..." thay vì
              "about".
            </Text>
            <Text bg="gray.100" p={2} borderRadius="md">
              Trong câu này, ta đang so sánh lượng tiêu thụ, nên dùng "has" thay
              vì "is".
            </Text>
            <Text bg="gray.100" p={2} borderRadius="md">
              Trong tiếng Anh, ta không dùng "most highest", chỉ cần "highest"
              là đủ.
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default WritingTaskPage;
