import { useState } from 'react';

const App = () => {
    const [targetAmount, setTargetAmount] = useState("");
    const [coinDenominations, setCoinDenominations] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto'
        },
        title: {
            fontSize: '24px',
            marginBottom: '20px'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        },
        label: {
            fontWeight: 'bold'
        },
        input: {
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
        },
        button: {
            padding: '10px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
        },
        error: {
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '15px'
        },
        resultContainer: {
            marginTop: '20px'
        },
        resultTitle: {
            fontSize: '20px',
            marginBottom: '10px'
        },
        resultContent: {
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        if (isNaN(targetAmount) || targetAmount <= 0) {
            setError("Please enter a valid target amount.");
            return;
        }

        const denominations = coinDenominations
            .split(",")
            .map((d) => parseFloat(d.trim()))
            .filter((d) => !isNaN(d) && d > 0);

        if (denominations.length === 0) {
            setError("Please enter at least one valid coin denomination.");
            return;
        }

        try {
            const response = await fetch("http://54.255.195.248:8080/api/v1/coins", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetAmount: parseFloat(targetAmount),
                    denominations: denominations,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An error occurred');
            }

            setResult(data);
        } catch (error) {
            setError(error.message || "An error occurred while processing your request.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Coin Calculator</h1>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Target Amount:
                    </label>
                    <input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Coin Denominations (comma-separated):
                    </label>
                    <input
                        type="text"
                        value={coinDenominations}
                        onChange={(e) => setCoinDenominations(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                
                <button type="submit" style={styles.button}>
                    Calculate
                </button>
            </form>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {result && (
                <div style={styles.resultContainer}>
                    <h2 style={styles.resultTitle}>Result</h2>
                    <div style={styles.resultContent}>
                        {Array.isArray(result) ? (
                            result.join(", ")
                        ) : (
                            typeof result === 'object' ? 
                                JSON.stringify(result, null, 2) : 
                                result
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;