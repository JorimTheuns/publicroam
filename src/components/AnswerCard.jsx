// AnswerCard.js
import React from "react"
import "./AnswerCard.css"

const AnswerCard = ({ question, answer }) => {
  console.log(answer)
  return (
    <div className="answer-card">
      {" "}
      <div className="answer-content">
        <h2>{answer.title}</h2>
        <p>{answer.argument}</p> <h3>Relevant Quotes:</h3>{" "}
        <ul>
          {" "}
          {answer.relevantQuotes.map((quote, index) => (
            <li key={index}>"{quote}"</li>
          ))}{" "}
        </ul>{" "}
      </div>{" "}
    </div>
  )
}

export default AnswerCard
