import { useToast } from '@chakra-ui/react';
import { useRef, useCallback } from 'react';

const MAX_TOASTS = 3; // Define the maximum number of toasts allowed at once

const useCustomToast = () => {
  const toast = useToast();
  const toastQueueRef = useRef([]); // Queue to track active toasts

  const showToast = useCallback((message, status) => {
    // Check if we need to close the oldest toast
    if (toastQueueRef.current.length >= MAX_TOASTS) {
      const oldestToastId = toastQueueRef.current.shift(); // Remove the oldest toast from the queue
      toast.close(oldestToastId); // Close the oldest toast
    }

    // Show the new toast and add its ID to the queue
    const toastId = toast({
      title: message,
      status: status,
      position: 'top-right',
      isClosable: true,
      duration: 7000,
      onCloseComplete: () => {
        // Remove this toast ID from the queue when it closes
        toastQueueRef.current = toastQueueRef.current.filter(id => id !== toastId);
      },
    });

    // Add the new toast ID to the queue
    toastQueueRef.current.push(toastId);
  }, [toast]);

  const successToast = useCallback((message) => {
    showToast(message, 'success');
  }, [showToast]);

  const errorToast = useCallback((message) => {
    showToast(message, 'error');
  }, [showToast]);

  const infoToast = useCallback((message) => {
    showToast(message, 'info');
  }, [showToast]);

  const warningToast = useCallback((message) => {
    showToast(message, 'warning');
  }, [showToast]);

  return { successToast, errorToast, infoToast, warningToast };
};

export default useCustomToast;
