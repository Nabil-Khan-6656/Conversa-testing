import React from 'react'
import { IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { Image ,Modal , ModalOverlay , ModalContent , ModalHeader , ModalBody , ModalCloseButton , ModalFooter ,Button } from '@chakra-ui/react'


const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {
                children ? <span onClick={onOpen}>{children}</span> : (
                    <IconButton display='flex' icon={<ViewIcon />} onClick={onOpen} />)}

            <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent height="410px">
                    <ModalHeader fontSize="40px" fontFamily='Work sans' display='flex' justifyContent='center'>{user.name}</ModalHeader>

                    <ModalCloseButton />
                    <ModalBody display='flex' alignItems='center' flexDir='column' justifyContent="space-between">
                        <Image 
                        borderRadius="full"
                        boxSize="150px"
                        src={user.pic}
                        alt={user.name}
                        
                        />

                        <Text fontSize={{base: "28px", md:"30px"}} fontFamily='Work sans'>Email : {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
