import React, { useEffect } from 'react'
import { Box, Container , Text  , Tabs , TabList , Tab , TabPanel , TabPanels} from "@chakra-ui/react"
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate()

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"))

    if(user) navigate("/")
  },[navigate])
  return (
    <Container maxW='xl' centerContent>
      <Box 
      d='flex'
      justifyContent='center' 
      p={3}
      bg={"white"}
      w="100%"
      m="40px 0 15px 0"
      borderRadius='lg'
      borderWidth='1px'
      textAlign='center'
      >
        <Text fontSize='4xl' fontFamily='work sans' color='black' fontWeight='600'>Conversa</Text>
      </Box>

      <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
      <Tabs variant='unstyled'>
  <TabList>
    <Tab _selected={{ color: 'white', bg: 'green.400' , borderRadius: '6px' }} width='50%'>Login</Tab>
    <Tab _selected={{ color: 'white', bg: 'green.400'  , borderRadius: '6px'  }} width='50%'>Signup</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
     <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>

    </Container>
  )
}

export default Home
