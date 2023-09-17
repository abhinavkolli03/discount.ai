import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GeneratePage = () => {
    const [ticker, setTicker] = useState('');
    const [status, setStatus] = useState('Enter a stock ticker to create a DCF');
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [downloadURL, setDownloadURL] = useState('');
    const [showAnalyze, setShowAnalyze] = useState(false);

    //fetch endpoint for later
    useEffect(() => {
        if (loading) {
            const fetchData = async () => {
                try {
                    const fetchURL = `http://127.0.0.1:5000/download${ticker.toLowerCase()}`;
                    // Sending ticker to Flask backend
                    const response = await axios.get(fetchURL);
                    const data = response.data;
                    console.log(response)
                    if (data.result) {
                        setStatus(data.result);
                    } else if (data.url) {
                        setDownloadURL(data.url);
                        console.log(downloadURL)
                        setStatus('Data is ready! Click below to download.');
                    }
                    setLoading(false);
                } catch (error) {
                    console.log('fail')
                    setStatus('Error fetching data for this ticker. Please try again later!');
                    setLoading(false);
                }
            }
            fetchData();
        }
    }, [loading]);

    const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY

    const handleInputChange = (e) => {
        setTicker(e.target.value);
        if (e.target.value) {
            setStatus('There we go! Add that ticker!');
        } else {
            setStatus('Enter a stock ticker to create a DCF');
        }
    }

    const checkWord = async () => {
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`);
            const data = await response.json();
            if (data.bestMatches && data.bestMatches.length > 0 && data.bestMatches[0]['1. symbol'] === ticker) {
                setStatus('Valid ticker! Proceeding with computation...');
            } else {
                setStatus('Invalid ticker. Please enter an official stock ticker.');
                setProcessing(false);
            }
        } catch (error) {
            setStatus('Error validating ticker. Please try again.');
            setProcessing(false);
        }
    }

    const handleSubmit = () => {
        setProcessing(true);
        checkWord();
        if (processing) {
            setLoading(true);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-10">Create DCF</h1>
            <p className="mb-5">Here you can automatically generate and analyze discounted cash flows!</p>
            
            <div className="mb-5 w-full max-w-md flex">
                <input 
                    type="text" 
                    placeholder="Enter Stock Ticker..."
                    className="flex-grow p-3 rounded-l border focus:outline-none focus:border-blue-500"
                    value={ticker}
                    onChange={handleInputChange}
                />
                <button 
                    className="bg-blue-500 text-white p-3 rounded-r"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>

            <div className="w-full max-w-lg h-64 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                <p className="text-center text-lg">{status}</p>
            </div>
            <div className="flex space-x-5 mt-5">
                {downloadURL && (
                    <a 
                        href={downloadURL}
                        download
                        onClick={() => setShowAnalyze(true)}
                        className={`bg-green-500 hover:bg-green-700 text-white p-3 rounded flex items-center space-x-2 transition-transform duration-500 transform ${showAnalyze ? 'translate-x-[-100px]' : ''}`}
                        >
                        Save Data
                    </a>
                )}
                {showAnalyze && (
                    <button
                    className={`bg-cyan-800 hover:bg-sky-600 text-white p-3 rounded flex items-center space-x-2 transition-transform duration-500 transform ${showAnalyze ? 'translate-x-[+100px]' : ''}`}
                    >
                        <Link 
                            to="/analyze"
                        >
                            <span>Analyze</span>
                        </Link>                   
                    </button>
                )
            }
            </div>
            <h1 className="mt-10 text-cyan-800"
            >Simply enter a ticker, download our auto-generated DCF, and let's analyze it!</h1>
        </div>
    );
}

export default GeneratePage;