import {EthProvider} from "./contexts/EthContext";
import React from 'react';
import Dashboard from "./components/Dashboard";
import Collection from "./components/Collection";
import Marketplace from "./components/Marketplace";
import Error from "./components/Error404";
import Profile from "./components/Profile";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/ui/navbar";

import Upload from "./components/uploadToIpfs";
import UploadMultiple from "./components/uploadToIpfs_mul";
import NftDetail from "./components/NftDetail";

function App() {

    return (
        <EthProvider>
            <Router forceRefresh={true}>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/collections" element={<Collection/>}/>
                    <Route path="/collections/:contractAddress/:tokenAddress" element={<NftDetail/>}/>
                    <Route path="/marketplace/:contractAddress" element={<Marketplace/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/create" element={<Upload/>}/>
                    <Route path="/create2" element={<UploadMultiple/>}/>

                    <Route path="*" element={<Error/>}/>
                </Routes>
            </Router>
        </EthProvider>
    );
}

export default App;
