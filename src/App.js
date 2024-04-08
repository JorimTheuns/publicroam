import React, { useState } from "react"
import data from "./clustered-data.json"
import AnswerCard from "./components/AnswerCard"
import "./App.css"
import ClientLogo from "./publicroam.png"
import Logo from "./dembrane-logo.png"
import LoginForm from "./components/LoginForm"

const valenceColors = {
  "Zeer positief": "#b7feb9",
  Positief: "#b7feb9",
  Neutraal: "#a8feff",
  Gemengd: "#a8feff",
  Negatief: "#feb1fe",
}

// Calculate inverseEvidence for each answer and cluster
data.sessions.forEach((session) => {
  session.questions.forEach((question) => {
    question.tables.forEach((table) => {
      table.answers.forEach((answer) => {
        answer.inverseEvidence = answer.topEvidence + answer.evidenceSpread
      })
    })

    // Flatten the answers array
    const allAnswers = question.tables.flatMap((table) => table.answers)

    // Calculate the mean and standard deviation of inverseEvidence for all answers
    const inverseEvidences = allAnswers.map((answer) => answer.inverseEvidence)
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
    allAnswers.forEach((answer) => {
      answer.zScore = (answer.inverseEvidence - mean) / stdDev
    })
  })
})

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const handleLogin = async (username, password) => {
    // Replace with your own authentication logic
    if (username === "dembrane" && password === "dembrane2024!") {
      setIsAuthenticated(true)
    } else {
      throw new Error("Invalid username or password")
    }
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  const handleAnswerClick = (questionShort, answer) => {
    setSelectedAnswer({
      question: questionShort,
      answer,
    })
  }

  return (
    <div className="app">
      <img src={ClientLogo} className="logo" alt="client-logo" />
      <div className="description">
        <h1>{data.host}</h1>
        <h3>{data.context}</h3>
        <h4>{data.description}</h4>
        <h3 style={{ marginTop: 10 + "vh" }}>
          Organisaties zien de voordelen van Public Roam maar worstelen met de
          kosten en het gebrek aan directe vraag van gebruikers. Er is een
          duidelijke behoefte aan meer bewustwording over de veiligheidsrisico's
          van openbare wifi-netwerken en de voordelen van Public Roam.
        </h3>
        <p>{data.commonFactorsAnalysis}</p>
      </div>
      <h2 style={{ marginTop: 20 + "vh" }}>Verdieping per gebruikersoort:</h2>
      {data.sessions.map((session, sessionIndex) => (
        <div key={sessionIndex}>
          <h1>{session.session_name}</h1>
          <p>{session.researchQuestionAnswer}</p>
          {session.questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <div className="description">
                <h3>{question.question.short}</h3>
                <h4>{question.question.sub}</h4>
                <p>{question.summary}</p>
              </div>
              <div className="answer-grid">
                {[...question.tables.flatMap((table) => table.answers)]
                  .sort((a, b) => a.inverseEvidence - b.inverseEvidence)
                  .map((answer, answerIndex) =>
                    answer && answer.title ? (
                      <div
                        key={`${answerIndex}`}
                        className="tiny-card"
                        onClick={() =>
                          handleAnswerClick(question.question.short, answer)
                        }
                        style={{ borderColor: valenceColors[answer.valence] }}
                      >
                        <h3>{answer.title}</h3>
                        <p>{answer.answer}</p>
                        {answer.zScore < -1 ? (
                          <div className="tag top">Top Antwoord</div>
                        ) : answer.zScore > 1 ? (
                          <div className="tag fresh">Frisse Blik</div>
                        ) : null}
                      </div>
                    ) : null
                  )}
              </div>
            </div>
          ))}
        </div>
      ))}
      {selectedAnswer && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedAnswer(null)}>
              &times;
            </span>
            <AnswerCard
              question={selectedAnswer.question}
              answer={selectedAnswer.answer}
            />
          </div>
        </div>
      )}
      <div className="footer">
        <img src={Logo} className="logo" alt="dembrane-logo" />
        <h3>
          This report was created by{" "}
          <a href="https://www.dembrane.com">Dembrane</a>. Dembrane is building
          tools to automate resources intensive aspects of stakeholder
          engagement processes in a scientifically and democratically defensible
          way. In this early stage of development, not every process we run
          fulfills these strict criteria. What follows is a report on the status
          of three key pillars for the validity of this report.
        </h3>
        <ul>
          <li>
            <strong>Traceability:</strong> Many conclusions can be traced to
            direct quotes from the transcripts of the recordings. We have not
            published the full transcripts that lead to this report.
          </li>
          <li>
            <strong>Reproducibility:</strong> The findings in this report have
            not been tested for reproducibility.
          </li>
          <li>
            <strong>Representativeness:</strong> The findings in this report are
            not representative of the opinions of anyone other than the
            participants who attended the workshop, and have not been tested for
            accuracy.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default App
