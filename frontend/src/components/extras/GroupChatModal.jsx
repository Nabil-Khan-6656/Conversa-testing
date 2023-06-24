import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    Spinner,
  } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from './UserBadgeItem'
import { Box } from '@chakra-ui/react'

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [ groupChatName , setGroupChatName] = useState()

    const [selectedUsers , setSelectedUsers] = useState([])
    
    const [search , setSearch] = useState("")

    const [searchResults , setSearchResults] = useState()

    const [loading , setLoading] = useState()

    const toast = useToast()

    const { user , chats , setChats} = ChatState()

    const handleSearch = async (query) =>{
        setSearch(query)

        if(!query){
            return
        }
        try {
            setLoading(true)
            const config = {
                headers:{
                  Authorization:`Bearer ${user.token}`
                }
              }

              const { data } = await axios.get(`/api/user?search=${search}`,config)
              setLoading(false)
              setSearchResults(data)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
              })
        }
    }


    const handleSubmit = async() =>{
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
              })
              return
        }

        try {
            const config = {
                headers:{
                  Authorization:`Bearer ${user.token}`
                }
              }

              const { data } = await axios.post(`/api/chat/group`, {
                name : groupChatName,
                users: JSON.stringify(selectedUsers.map(u=> u._id))
              }, config)

              setChats([data , ...chats])
              onClose()
              toast({
                title: "New Group Chat Created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
              })

        } catch (error) {
            toast({
                title: "Failed to create the chat",
                description: error.message ,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
              })
        }
    }

    const handleDelete = (deletedUser) =>{
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== deletedUser._id))
    }

    const handleGroup = (usersToAdd) =>{
        if(selectedUsers.includes(usersToAdd)){
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
              })
              return
        }

        setSelectedUsers([...selectedUsers, usersToAdd])
    }
    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader   fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center">Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody  display="flex" flexDir="column" alignItems="center">
               <FormControl>
                <Input placeholder="Chat Name" mb={3}
                 onChange={(e)=>setGroupChatName(e.target.value)}
                />
               </FormControl>

               <FormControl>
                <Input placeholder="Add Users eg: user1 , user2 , user3" mb={1}
                 onChange={(e)=>handleSearch(e.target.value)}
                />
               </FormControl>

               {/* List of Selected Users */}
               <Box w="100%" display="flex" flexWrap="wrap">
                {
                    selectedUsers.map((user)=>{
                        return(
                            <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>
                        )
                    })
                }
                 </Box>
                 {/* Render Search Users */}
               { loading ? <Spinner mt={3}/> : (
                searchResults?.slice(0,4).map((user)=>{
                    return(
                    <UserListItem key={user._id} user={user}  handleFunction={()=> handleGroup(user)}/>
                    )
                })
               )}
         

              
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create Chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModal
