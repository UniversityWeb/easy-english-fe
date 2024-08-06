import { useRadio, Box } from '@chakra-ui/react';
function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" fontSize={'12px'}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'var(--gray-300)',
          color: 'white',
          borderColor: 'var(--gray-300)',
        }}
        px={3}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default RadioCard;
