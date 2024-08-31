import { useToast } from '@chakra-ui/react';

const useCustomToast = () => {
  const toast = useToast();

  const successToast = (message) => {
    toast({
      title: message,
      status: 'success',
      position: 'top-right',
      isClosable: true,
      duration: 7000,
    });
  };

  const errorToast = (message) => {
    toast({
      title: message,
      status: 'error',
      position: 'top-right',
      isClosable: true,
      duration: 7000,
    });
  };

  const infoToast = (message) => {
    toast({
      title: message,
      status: 'info',
      position: 'top-right',
      isClosable: true,
      duration: 7000,
    });
  };

  const warningToast = (message) => {
    toast({
      title: message,
      status: 'info',
      position: 'top-right',
      isClosable: true,
      duration: 7000,
    });
  };

  return { successToast, errorToast, infoToast, warningToast };
};

export default useCustomToast;
