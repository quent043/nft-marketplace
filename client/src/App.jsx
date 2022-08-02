import {EthProvider} from "./contexts/EthContext";
import React from 'react';
import { useState, useEffect } from 'react';
import Dashboard from "./components/Dashboard";
import Collection from "./components/Collection";
import Marketplace from "./components/Marketplace";
import Error from "./components/Error404";
import Profil from "./components/Profil";
import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NavBar from "./components/ui/navbar";

import Upload from "./components/uploadToIpfs";
import UploadMultiple from "./components/uploadToIpfs_mul";

function App() {

    return (
        <EthProvider>
        <Router>
    
            <NavBar></NavBar>
            <Routes> 
            <Route path="/:account" element={<Dashboard/>}/> 
            <Route path="/collection/:account" element={<Collection/>}/> 
            <Route path="/marketplace/:account" element={<Marketplace/>}/> 
            <Route path="/profil/:account" element={<Profil/>}/> 
            <Route path="/create/:account" element={<Upload/>}/> 
            <Route path="/create2/:account" element={<UploadMultiple/>}/> 
     
            <Route path="*" element={<Error/>}/> 
            </Routes>
        </Router>
        </EthProvider>
    );
}

export default App;
