import React, { useState } from 'react';
import {
  Button,
  FormControl, FormLabel, Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, Spinner,
} from '@chakra-ui/react';

const VerifyOtpModal = ({ isOpen, onClose, onOtpSubmitted }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOtpSubmit = async () => {
    setLoading(true);
    onOtpSubmitted(otp);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verify OTP</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Enter OTP</FormLabel>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="cyan"
            onClick={handleOtpSubmit}
            ml={3}
            isLoading={loading}
            disabled={!otp}
          >
            {loading ? <Spinner size="sm" /> : 'Verify OTP'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VerifyOtpModal;