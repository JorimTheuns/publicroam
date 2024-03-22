// AnswerCard.js
import React from "react"
import { useState } from "react"
import "./AnswerCard.css"
import AnswerCard from "./AnswerCard"

const ClusterCard = ({ question, cluster, referencedAnswers }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const handleAnswerClick = (answer) => {
    console.log(answer)
    setSelectedAnswer(answer)
  }
  return (
    <div className="cluster-card">
      {" "}
      <div className="answer-content">
        <h2>{cluster.name}</h2>
        <p className="small">
          <strong>Question: </strong>
          {question}
        </p>{" "}
        <p> {cluster.argument} </p> <h3>Answers Referenced</h3>{" "}
        <div className="answer-grid">
          {referencedAnswers.map((reference, index) =>
            reference && reference.title ? (
              <div
                key={`${index}`}
                className="tiny-card"
                onClick={() => handleAnswerClick(reference)}
              >
                <strong>
                  <p>{reference.title}</p>
                </strong>
                <p>{reference.id}</p>
              </div>
            ) : null
          )}
        </div>
      </div>{" "}
      <div className="answer-images">
        {" "}
        {cluster.images.map((imagePath, index) => (
          <img key={index} src={imagePath} alt={imagePath} />
        ))}{" "}
      </div>{" "}
      {selectedAnswer && (
        <div className="right">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedAnswer(null)}>
              &times;
            </span>
            <AnswerCard question={question} answer={selectedAnswer} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ClusterCard
