import React from 'react'
import { Route , Routes } from "react-router-dom"
import Home from "./pages/Home"
import ChatPage from "./pages/ChatPage"
import './App.css'
const App = () => {
  return (
 
   <div className="App">
     <Routes>
      <Route exact path='/' element={<Home/>}/>
      <Route exact path='/chats' element={<ChatPage/>}/>
      </Routes>
      </div>
  )
}

export default App

