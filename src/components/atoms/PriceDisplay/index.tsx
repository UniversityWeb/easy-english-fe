import React from 'react';
import { Badge, Flex, HStack, Text } from '@chakra-ui/react';
import { formatVNDMoney } from '@/utils/methods';

interface PriceDisplayProps {
  priceResponse?: any;
  primaryColor?: string;
  secondaryColor?: string;
  fontWeight?: string;
  fontSize?: string;
  align?: string;
  direction?: 'row' | 'column';
  showFreeBadge?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  priceResponse,
  primaryColor = 'blue.600',
  secondaryColor = 'gray.400',
  fontWeight = 'bold',
  fontSize = 'md',
  align = 'flex-start',
  direction,
  showFreeBadge = false,
}) => {
  let originalPrice = 0;
  let salePrice = 0;
  let isActive = false;
  let startDate: string | null = null;
  let endDate: string | null = null;

  if (typeof priceResponse === 'number') {
    originalPrice = priceResponse;
  } else if (typeof priceResponse === 'string') {
    originalPrice = parseFloat(priceResponse) || 0;
  } else if (priceResponse && typeof priceResponse === 'object') {
    const data =
      priceResponse.price && typeof priceResponse.price === 'object'
        ? priceResponse.price
        : priceResponse;

    originalPrice =
      typeof data.price === 'number'
        ? data.price
        : typeof data.originalPrice === 'number'
          ? data.originalPrice
          : parseFloat(data.price || data.originalPrice) || 0;

    salePrice =
      typeof data.salePrice === 'number'
        ? data.salePrice
        : typeof data.discountPrice === 'number'
          ? data.discountPrice
          : parseFloat(data.salePrice || data.discountPrice) || 0;

    startDate = data.startDate || null;
    endDate = data.endDate || null;

    if (data.isActive !== undefined && data.isActive !== null) {
      isActive = Boolean(data.isActive);
    } else {
      isActive = salePrice > 0 && salePrice < originalPrice;
    }
  }

  const now = new Date();
  const hasDateRange = Boolean(startDate && endDate);
  const isDateRangeValid = hasDateRange
    ? new Date(startDate!) <= now && now <= new Date(endDate!)
    : true;

  const hasSale =
    isActive &&
    salePrice > 0 &&
    salePrice < originalPrice &&
    isDateRangeValid;

  const isFree = originalPrice === 0 && salePrice === 0;

  if (isFree) {
    if (showFreeBadge) {
      return (
        <Badge
          colorScheme="green"
          fontSize={fontSize}
          px={2}
          py={0.5}
          borderRadius="md"
          fontWeight="bold"
        >
          Free
        </Badge>
      );
    }
    return (
      <Text fontSize={fontSize} fontWeight={fontWeight} color="green.500">
        Free
      </Text>
    );
  }

  const effectiveDirection = direction || (hasSale ? 'column' : 'row');

  if (hasSale) {
    return (
      <Flex align={align} direction={effectiveDirection} gap={0.5}>
        <HStack spacing={2} align="center">
          <Text fontSize={fontSize} fontWeight={fontWeight} color={primaryColor}>
            {formatVNDMoney(salePrice)}
          </Text>
          <Text as="s" fontSize="xs" color={secondaryColor}>
            {formatVNDMoney(originalPrice)}
          </Text>
        </HStack>
      </Flex>
    );
  }

  return (
    <Flex align={align} justify="center">
      <Text fontSize={fontSize} fontWeight={fontWeight} color={primaryColor}>
        {formatVNDMoney(originalPrice)}
      </Text>
    </Flex>
  );
};

export default PriceDisplay;
