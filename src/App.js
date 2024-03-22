import React, { useState } from "react"
import data from "./clustered-data.json"
import ClusterCard from "./components/ClusterCard"
import "./App.css"
import ClientLogo from "./machines-for-good-logo.png"
import Logo from "./dembrane-logo.png"

const App = () => {
  const [selectedCluster, setSelectedCluster] = useState(null)

  const handleClusterClick = (
    questionShort,
    cluster,
    sessionIndex,
    questionIndex
  ) => {
    // Find the parent session and question based on their indices
    const parentSession = data.sessions[sessionIndex]
    const parentQuestion = parentSession.questions[questionIndex]

    // Initialize an array to hold the referenced answers
    let referencedAnswers = []

    // Iterate through each table in the parent question
    parentQuestion.tables.forEach((table) => {
      // Filter the answers that are referenced by the cluster
      const filteredAnswers = table.answers.filter((answer) =>
        cluster.answers_referenced.includes(answer.id)
      )
      // Concatenate the filtered answers to the referencedAnswers array
      referencedAnswers = [...referencedAnswers, ...filteredAnswers]
    })

    // Set the selected cluster state with the question, cluster, and referenced answers
    setSelectedCluster({
      question: questionShort,
      cluster,
      referencedAnswers, // Include the referenced answers in the state
    })
  }

  return (
    <div className="app">
      <img src={ClientLogo} className="logo" alt="client-logo" />
      <div className="description">
        <h1>{data.host}</h1>
        <h3>{data.description}</h3>
      </div>
      {data.sessions.map((session, sessionIndex) => (
        <div key={sessionIndex}>
          {session.questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <div className="description">
                <h2>{question.question.short}</h2>
                <h3>{question.question.sub}</h3>
                <p>{question.question.context}</p>
              </div>
              <div className="answer-grid">
                {question.clusters.map((cluster, clusterIndex) =>
                  cluster &&
                  cluster.images &&
                  cluster.images.length > 0 &&
                  cluster.name ? (
                    <div
                      key={`${clusterIndex}`}
                      className="tiny-card"
                      onClick={() =>
                        handleClusterClick(
                          question.question.short,
                          cluster,
                          sessionIndex,
                          questionIndex
                        )
                      }
                    >
                      <img src={cluster.images[0]} alt={cluster.title} />
                      <h3>{cluster.name}</h3>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
      {selectedCluster && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedCluster(null)}>
              &times;
            </span>
            <ClusterCard
              question={selectedCluster.question}
              cluster={selectedCluster.cluster}
              referencedAnswers={selectedCluster.referencedAnswers} // Pass the referenced answers as a prop
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
