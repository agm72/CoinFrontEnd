import { useState } from 'react';
import axios from "axios";
import './App.css';

function App() {
    const [targetAmount, setTargetAmount] = useState("");
    const [coinDenominations, setCoinDenominations] = useState("");
    const [result, setResult] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isNaN(targetAmount) || targetAmount <= 0) {
            alert("Please enter a valid target amount.");
            return;
        }

        const denominations = coinDenominations
            .split(",")
            .map((d) => parseFloat(d.trim()))
            .filter((d) => !isNaN(d) && d > 0);

        if (denominations.length === 0) {
            alert("Please enter at least one valid coin denomination.");
            return;
        }

        try {
            const response = await axios.post("http://54.255.195.248:8080/api/v1/coins", {
                targetAmount: parseFloat(targetAmount),
                denominations: denominations,
            });
            setResult(response.data);
        } catch (error) {
            const errorMessage = error.response?.data || error.message || "An error occurred";
            alert(errorMessage);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Coin Calculator</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Target Amount:</label>
                    <input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Coin Denominations (comma-separated):</label>
                    <input
                        type="text"
                        value={coinDenominations}
                        onChange={(e) => setCoinDenominations(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Calculate</button>
            </form>

            {result.length > 0 && (
                <div>
                    <h2>Result</h2>
                    <p>{result.join(", ")}</p>
                </div>
            )}
        </div>
    );
}

export default App;
