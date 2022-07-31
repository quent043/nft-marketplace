import {EthProvider} from "./contexts/EthContext";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
    return (
        <EthProvider>
            <div id="App">
                <div className="container">
                    <Dashboard/>
                </div>
            </div>
        </EthProvider>
    );
}

export default App;
