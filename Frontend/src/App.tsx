import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { Navbar } from './components/Navbar'

function App() {
  return (
  <Navbar 
  brandName="library"
  items={[
    {label: "Home", path: "/"},
    {label: "Books", path: "/books"}
  ]}
  />

)}

export default App
