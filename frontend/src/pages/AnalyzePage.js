import React, { useState, useRef, useEffect } from "react";
import DropFileInput from '../components/DropfileInput';
import "./AnalyzePage.css";
import axios from 'axios';
import AWS from 'aws-sdk';

const AnalyzePage = () => {
  const [files, setFiles] = useState([]);
  const [isValidFile, setIsValidFile] = useState(false);
  const [summary, setSummary] = useState(null);
  const textareaRef = useRef(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [botResponses, setBotResponses] = useState([]);
  const [typingResponses, setTypingResponses] = useState({});

  useEffect(() => {
    for (let question in botResponses) {
      if (!typingResponses[question]) {
        let index = 0;
        setTypingResponses(prev => ({ ...prev, [question]: botResponses[question][0] }));

        const intervalId = setInterval(() => {
          if (index < botResponses[question].length - 1) {
            setTypingResponses(prev => ({
              ...prev,
              [question]: prev[question] + botResponses[question][index]
            }));
            index++;
          } else {
            clearInterval(intervalId);
          }
        }, 50);
      }
    }
  }, [botResponses]);

  useEffect(() => {
    // Adjusts the height of the textarea based on scrollHeight
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [summary]);

  const onFileChange = (uploadedFiles) => {
    if (uploadedFiles.length > 0) {
      setIsValidFile(true);
    } else {
      setIsValidFile(false);
    }
    setFiles(uploadedFiles);
  };

  const generatePresignedUrl = (bucket, key, expires = 3600) => {
    const s3 = new AWS.S3({
      region: "us-east-1",
      accessKeyId: process.env.REACT_APP_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_SECRET_KEY,
    });

    const url = s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: expires,
    });

    return url;
  }

  const uploadFile = async () => {
    if (files.length === 0) {
      alert("No file selected.");
      return;
    }

    const file = files[0];

    const S3_BUCKET = "discount.ai-storage";
    const REGION = "us-east-1";
    const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
    const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

    AWS.config.update({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    });

    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    try {
      const presignedUrl = generatePresignedUrl(S3_BUCKET, file.name);
      alert("Successful upload!");

      const mockSummary = "Based on the inputted DCF, this valuation rests heavily in a stable topline with minimal bottom line growth. Approximately 50% is vested in terminal value. WACC is roughly 11%, contributing to a high weighted cost of capital. This translates to an amplified implied upside/downturn in returns. Please ask more questions.";
      let index = 0;
      setSummary(mockSummary[0]);

      const intervalId = setInterval(() => {
        if (index < mockSummary.length - 1) {
          setSummary(prevSummary => prevSummary + mockSummary[index]);
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 50);

      // Sending the presigned URL to the backend for processing and summarizing
      //const response = await axios.post("http://127.0.0.1:5001/process_and_summarize", { url: presignedUrl });

      //const summary = response.data.summary;
      //console.log("Summary:", summary);

    } catch (error) {
      console.error("Error uploading the file:", error);
    }
  };

  const handleQuestionSubmit = () => {
    if (currentQuestion.trim() !== "") {
      setUserQuestions(prevQuestions => [...prevQuestions, currentQuestion.trim()]);
      setBotResponses(prevResponses => ({
        ...prevResponses,
        [currentQuestion.trim()]: "We see an average decrease of $121B annually. Given the timespan, this may be signs of reduced liquidity, increased liabilities, and changes in capital distribution."
      }));
      setCurrentQuestion("");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white">
      <h1 className="text-center text-neutral-950 text-3xl mb-8">Analyze DCF</h1>
      <p className="text-center text-sky-800 text-xl mb-8">Input your DCF here and ask discount.ai to help you analyze the content!</p>

      <DropFileInput onFileChange={onFileChange} />

      <div className="mt-5 text-center">
        <button
          className={`px-6 py-3 rounded-md ${isValidFile ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'} transition-colors`}
          onClick={uploadFile}
          disabled={!isValidFile}
        >
          Upload to S3
        </button>
      </div>

      {summary &&
        <div className="mt-10 p-6 border-2 border-gray-300 bg-[var(--input-bg)] rounded-md">
          <h1>discount.ai summarizes...</h1>
          <textarea
            ref={textareaRef}
            value={summary}
            readOnly
            style={{
              width: '100%',
              overflowY: 'hidden', // Hide vertical scrollbar
              border: 'none',
              backgroundColor: 'transparent',
              resize: 'none', // Prevent manual resize
            }}
          />
        </div>
      }

      <div className="mt-5 p-6 border-2 border-gray-300 bg-[var(--input-bg)] rounded-md">
        {userQuestions.map(question => (
          <React.Fragment key={question}>
            <div className="mb-2 bg-green-100 p-3 rounded-md">{question}</div>
            <div className={`mb-4 p-3 rounded-md ${typingResponses[question] === botResponses[question] ? 'bg-red-100' : 'bg-gray-200'}`}>
              {typingResponses[question]}
            </div>
          </React.Fragment>
        ))}
        <input
          type="text"
          placeholder="Ask your question here..."
          className="w-full p-2 border-2 border-gray-400 rounded-md"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleQuestionSubmit();
            }
          }}
        />
      </div>
    </div>
  );
};

export default AnalyzePage;
