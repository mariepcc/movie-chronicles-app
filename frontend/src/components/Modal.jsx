import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const ModalComponent = ({ isOpen, onClose, movie, content }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {movie.original_title} - movie ending explained:
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box whiteSpace="pre-wrap">{content}</Box>
        </ModalBody>
        <ModalFooter>
          <Button variantColor="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
