import {EthProvider} from "./contexts/EthContext";
import React from 'react';
import Dashboard from "./components/Dashboard";
import Collection from "./components/Collection";
import Marketplace from "./components/Marketplace";
import Error from "./components/Error404";
import Profil from "./components/Profil";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/ui/navbar";

import Upload from "./components/uploadToIpfs";
import UploadMultiple from "./components/uploadToIpfs_mul";

function App() {

    return (
        <EthProvider>
            <Router>

                <NavBar />
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/collections/:contractAddress" element={<Collection/>}/>
                    <Route path="/marketplace/:contractAddress" element={<Marketplace/>}/>
                    <Route path="/profil/:contractAddress" element={<Profil/>}/>
                    <Route path="/create/:contractAddress" element={<Upload/>}/>
                    <Route path="/create2/:contractAddress" element={<UploadMultiple/>}/>

                    <Route path="*" element={<Error/>}/>
                </Routes>
            </Router>
        </EthProvider>
    );
}

export default App;
