import { useState } from "react";
import quizData from "../Data/quizData";

function Quiz() {
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track selected answers by question index
  const [answers, setAnswers] = useState([]); // Track answers for each question

  const currentData = quizData[currQuestionIndex];

  const handleAnswerSelection = (answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currQuestionIndex]: answer,
    }));
  };

  const handleNext = () => {
    if (selectedAnswers[currQuestionIndex] === currentData.answer) {
      setScore(score + 1);
    }

    setAnswers((prev) => [
      ...prev,
      {
        question: currentData.question,
        selectedAnswer: selectedAnswers[currQuestionIndex],
        correctAnswer: currentData.answer,
      },
    ]);

    if (currQuestionIndex < quizData.length - 1) {
      setCurrQuestionIndex(currQuestionIndex + 1);
      setSelectedAnswers((prev) => ({
        ...prev,
        [currQuestionIndex]: null,
      })); // Reset selected answer for the next question
    } else {
      setIsQuizFinished(true);
    }
  };

  const handlePrev = () => {
    if (currQuestionIndex > 0) {
      setCurrQuestionIndex(currQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit your answers?")) {
      // Add the last question's answers
      setAnswers((prev) => [
        ...prev,
        {
          question: currentData.question,
          selectedAnswer: selectedAnswers[currQuestionIndex],
          correctAnswer: currentData.answer,
        },
      ]);
      setIsQuizFinished(true);
    }
  };

  const handleRetake = () => {
    setCurrQuestionIndex(0);
    setIsQuizFinished(false);
    setScore(0);
    setSelectedAnswers({}); // Clear selected answers for retake
    setAnswers([]); // Clear answers for retake
  };

  const getOptionStyle = (option) => {
    if (isQuizFinished) {
      if (option === currentData.answer) {
        return { backgroundColor: "lightgreen" }; // Correct answer
      }
      if (
        option === selectedAnswers[currQuestionIndex] &&
        option !== currentData.answer
      ) {
        return { backgroundColor: "lightcoral" }; // Incorrect answer
      }
    }
    return { backgroundColor: "white" }; // Default background
  };

  return (
    <div>
      {!isQuizFinished ? (
        <div>
          <h2>
            Q.{currQuestionIndex + 1} {currentData.question}
          </h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {currentData.options.map((option, index) => (
              <li
                key={index}
                style={{
                  margin: "5px 0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedAnswers[currQuestionIndex] === option}
                    onChange={() => handleAnswerSelection(option)}
                    style={{ marginRight: "10px" }}
                  />
                  <span style={getOptionStyle(option)}>{option}</span>
                </label>
              </li>
            ))}
          </ul>
          <div>
            <button
              style={{ margin: "10px" }}
              onClick={handlePrev}
              disabled={currQuestionIndex === 0} // Disable if at the first question
            >
              Previous
            </button>
            <button style={{ margin: "10px" }} onClick={handleNext}>
              Next
            </button>
            <button
              style={{ margin: "10px" }}
              onClick={handleSubmit} // Add Submit button
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Quiz Over</h2>
          <p>
            Your Score is: {score}/{quizData.length}
          </p>
          <button
            style={{ margin: "10px" }}
            onClick={handleRetake} // Add Retake button
          >
            Retake Test
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
