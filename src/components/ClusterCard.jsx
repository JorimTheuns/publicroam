// AnswerCard.js
// AnswerCard.js
import React from "react"
import { useState } from "react"
import "./AnswerCard.css"
import AnswerCard from "./AnswerCard"

const ClusterCard = ({ question, cluster, referencedAnswers }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  // Calculate inverseEvidence for each answer
  const answersWithInverseEvidence = referencedAnswers.map((answer) => ({
    ...answer,
    inverseEvidence: answer.topEvidence + answer.evidenceSpread,
  }))

  // Calculate the mean and standard deviation of inverseEvidence for the referenced answers
  const inverseEvidences = answersWithInverseEvidence.map(
    (answer) => answer.inverseEvidence
  )
  const mean =
    inverseEvidences.reduce((sum, value) => sum + value, 0) /
    inverseEvidences.length
  const stdDev = Math.sqrt(
    inverseEvidences.reduce(
      (sum, value) => sum + Math.pow(value - mean, 2),
      0
    ) / inverseEvidences.length
  )

  // Calculate the z-score for each answer's inverseEvidence
  const sortedAnswers = answersWithInverseEvidence
    .map((answer) => ({
      ...answer,
      zScore: (answer.inverseEvidence - mean) / stdDev,
    }))
    .sort((a, b) => a.inverseEvidence - b.inverseEvidence)

  const handleAnswerClick = (answer) => {
    console.log(answer)
    setSelectedAnswer(answer)
  }

  return (
    <div className="cluster-card">
      <div className="answer-content">
        <h2>{cluster.name}</h2>
        <p className="small">
          <strong>Question: </strong>
          {question}
        </p>
        <p>{cluster.description}</p>
        <h3>Antwoorden per transcript</h3>
        <div className="answer-grid">
          {sortedAnswers.map((reference, index) =>
            reference && reference.title ? (
              <div
                key={`${index}`}
                className="tiny-card tiny-answer-card"
                onClick={() => handleAnswerClick(reference)}
              >
                {reference.zScore < -1 ? (
                  <div className="top pill">Top Antwoord</div>
                ) : reference.zScore > 1 ? (
                  <div className="fresh pill">Frisse blik</div>
                ) : null}
                <strong>
                  <p>{reference.answer}</p>
                </strong>
                <small>{reference.id}</small>
              </div>
            ) : null
          )}
        </div>
      </div>
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
