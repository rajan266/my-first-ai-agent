
import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [answer, setAnswer] = useState("");
const [pages, setPages] = useState([]);
  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("PDF size must be 10 MB or less.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  }

 

async function handleSubmit(event) {
  event.preventDefault();

  if (!file) {
    setError("Please upload a PDF first.");
    return;
  }

  if (!question.trim()) {
    setError("Please enter a question.");
    return;
  }

  setLoading(true);
  setError("");
  setAnswer("");
  setPages([]);

  try {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("question", question.trim());

    const response = await fetch("/api/pdf/ask", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to answer your question."
      );
    }

    setAnswer(data.answer || "No answer was returned.");
    setPages(data.pages || []);
  } catch (err) {
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <h1>PDF Agent</h1>
            <p>AI-powered document assistant</p>
          </div>
        </div>

        <span className="status">
          <span className="status-dot" />
          Groq AI
        </span>
      </header>

      <main className="main">
        <section className="hero">
          <span className="eyebrow">YOUR DOCUMENT ASSISTANT</span>
          <h2>Ask your documents anything.</h2>
          <p>
            Upload a PDF, ask a question, and get answers
            based on your document with page references.
          </p>
        </section>

        <form className="agent-card" onSubmit={handleSubmit}>
          <label className="section-label">
            1. Upload your PDF
          </label>

          <label className="upload-area">
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
            />

            <div className="upload-icon">↑</div>
            <strong>
              {file ? file.name : "Choose a PDF to get started"}
            </strong>
            <span>
              {file
                ? `${(file.size / 1024).toFixed(1)} KB`
                : "Click here to browse · Maximum 10 MB"}
            </span>
          </label>

          {file && (
            <button
              type="button"
              className="remove-file"
              onClick={() => setFile(null)}
            >
              Remove PDF
            </button>
          )}

          <label className="section-label question-label">
            2. Ask a question
          </label>

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Example: What was the initial project budget?"
            rows={4}
          />

         <button
  className="ask-button"
  type="submit"
  disabled={loading}
>
  {loading ? "Searching PDF and generating answer..." : "✦ Ask PDF Agent"}
</button>

          <p className="privacy-note">
            Your answers will be generated from relevant passages
            in your uploaded document.
          </p>
        </form>

{error && (
  <div className="result-error" role="alert">
    {error}
  </div>
)}

{loading && (
  <div className="result-card">
    Extracting text from your PDF...
  </div>
)}


{answer && (
  <section className="result-card">
    <h3>Answer</h3>

    <p className="extracted-text">{answer}</p>

    {pages.length > 0 && (
      <p className="result-description">
        Relevant PDF pages: {pages.join(", ")}
      </p>
    )}
  </section>
)}


        <section className="features">
          <div className="feature">
            <span>⌕</span>
            <div>
              <strong>Relevant passages</strong>
              <p>Search the document before answering.</p>
            </div>
          </div>

          <div className="feature">
            <span>▤</span>
            <div>
              <strong>Page references</strong>
              <p>See where the answer came from.</p>
            </div>
          </div>

          <div className="feature">
            <span>✦</span>
            <div>
              <strong>Groq-powered AI</strong>
              <p>Get answers grounded in your PDF.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        Built with React, Node.js and Groq
      </footer>
    </div>
  );
}

export default App;
