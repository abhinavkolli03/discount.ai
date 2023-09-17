// Import required modules and components
import React, { useState, useEffect } from "react";
import DropFileInput from '../components/DropfileInput';
import "./AnalyzePage.css";

// Define the AnalyzePage component
const AnalyzePage = () => {
  
  // State hooks to store various pieces of data
  const [files, setFiles] = useState([]);
  const [isValidFile, setIsValidFile] = useState(false);
  const [summary, setSummary] = useState(null);
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

  // Function to handle file changes
  const onFileChange = (uploadedFiles) => {
    if (uploadedFiles.length > 0) {
      setIsValidFile(true);
    } else {
      setIsValidFile(false);
    }
    setFiles(uploadedFiles);
  };

  // Function to handle the submission of the file
  const handleButtonClick = () => {
    if (isValidFile) {
      console.log("Submitting the file...");

      const mockSummary = "Here's a mock summary of the DCF. This will be replaced with real data once you integrate with the backend.";
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
    }
  };

  // Function to handle the submission of a user's question
  const handleQuestionSubmit = () => {
    if (currentQuestion.trim() !== "") {
      setUserQuestions(prevQuestions => [...prevQuestions, currentQuestion.trim()]);
      setBotResponses(prevResponses => ({
        ...prevResponses,
        [currentQuestion.trim()]: "Here's a dummy response to your question."
      }));
      setCurrentQuestion("");
    }
  };

  // The return statement describes the component's UI
  return (
    <div className="container mx-auto p-8 bg-white">
      <h1 className="text-center text-neutral-950 text-3xl mb-8">Analyze DCF</h1>
      <p className="text-center text-sky-800 text-xl mb-8">Input your DCF here and ask discount.ai to help you analyze the content!</p>
      
      <DropFileInput onFileChange={onFileChange} />
      
      <div className="mt-5 text-center">
        <button 
          className={`px-6 py-3 rounded-md ${isValidFile ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'} transition-colors`} 
          onClick={handleButtonClick}
          disabled={!isValidFile}
        >
          Submit DCF
        </button>
      </div>
      
      {summary && 
        <div className="mt-10 p-6 border-2 border-gray-300 bg-[var(--input-bg)] rounded-md">
          <h1>discount.ai summarizes...</h1>
          <div className="typing-text">
            {summary}
          </div>
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

// Export the AnalyzePage component
export default AnalyzePage;
