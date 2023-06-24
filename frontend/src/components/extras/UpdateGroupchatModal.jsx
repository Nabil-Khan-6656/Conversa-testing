import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react'

import { Button } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import { useState } from 'react'
import UserBadgeItem from './UserBadgeItem'
import axios from "axios"
import UserListItem from "../UserAvatar/UserListItem"



const UpdateGroupchatModal = ({ fetchAgain, setFetchAgain , fetchMessages}) => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameloading, setRenameloading] = useState(false)

  const toast = useToast()



  const { selectedChat, setSelectedChat, user } = ChatState()

  const handleRemove = async (user1) => {
    if(selectedChat.groupAdmin._id !== user._id && user1._id  !== user._id){
      toast({
        title: "Only Admins can remove someone !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
      return
    }

    try {
      setLoading(true)
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

      const { data } = await axios.put(`/api/chat/groupremove`, {
        chatId : selectedChat._id,
        userId : user1._id
      }, config)

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
      toast({
        title: "User removed",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
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
  const handleRename = async() => {
    if(!groupChatName){
      return
    }

    try {
      setRenameloading(true)
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

     

      const { data } = await axios.put(`/api/chat/rename`, { 
        chatId: selectedChat._id ,
        chatName: groupChatName
      }, config)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameloading(false)
      toast({
        title: "Group Name Updated",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      console.log(error);

      setRenameloading(false)
    }
    setGroupChatName("")
  }

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
          console.log(data);
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


const handleAdduser = async(user1) =>{
  if(selectedChat.users.find((u)=> u._id === user1._id)){
    toast({
      title: "User already in group",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom-left"
    })
    return
  }

  if(selectedChat.groupAdmin._id !== user._id){
    toast({
      title: "Only Admins can add someone !",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom-left"
    })
    return
  }

  try {
    setLoading(true)

    const config = {
      headers:{
        Authorization:`Bearer ${user.token}`
      }

    }

    const { data } = await axios.put(`/api/chat/groupadd`, {
      chatId : selectedChat._id,
      userId: user1._id
    }, config)

    setSelectedChat(data)
    setFetchAgain(!fetchAgain)
    setLoading(false)
    toast({
      title: "User Added ",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom"
    })

  } catch (error)  {
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
  return (
    <>
      <IconButton display={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {
                selectedChat.users.map((user) => {
                  return (
                    <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                  )
                })
              }
            </Box>


            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            { loading ? <Spinner size="lg" />
            : (
              searchResults.map((user)=>{
                return(
                  <UserListItem 
                  key={user._id}
                  user={user}
                  handleFunction={()=> handleAdduser(user)}
                  />
                )
              })
            )  
          }



          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupchatModal
