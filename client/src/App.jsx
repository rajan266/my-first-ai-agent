
import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [answer, setAnswer] = useState("");
const [pages, setPages] = useState([]);
const [messages, setMessages] = useState([]);
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
setMessages([]);
setAnswer("");
setPages([]);
setError("");
  }

 



async function handleSubmit(event) {
  event.preventDefault();

  if (loading) return;

  if (!file) {
    setError("Please upload a PDF first.");
    return;
  }

  if (!question.trim()) {
    setError("Please enter a question.");
    return;
  }

  const currentQuestion = question.trim();
  const assistantMessageId = crypto.randomUUID();

  setQuestion("");
  setLoading(true);
  setError("");
  setPages([]);

  // Show the user's question immediately and add
  // one empty agent message for the incoming answer.
  setMessages((previous) => [
    ...previous,
    {
      id: crypto.randomUUID(),
      role: "user",
      content: currentQuestion,
    },
    {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    },
  ]);

  try {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("question", currentQuestion);
    formData.append("history", JSON.stringify(messages));

    const response = await fetch(
      `${API_BASE_URL}/api/pdf/ask`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to answer your question."
      );
    }

    const assistantAnswer =
      data.answer || "No answer was returned.";

    // Update only this question's agent message.
    setMessages((previous) =>
      previous.map((message) =>
        message.id === assistantMessageId
          ? { ...message, content: assistantAnswer }
          : message
      )
    );

    setAnswer(assistantAnswer);
    setPages(data.pages || []);
  } catch (err) {
    // Remove the empty agent message if the request fails.
    setMessages((previous) =>
      previous.filter(
        (message) => message.id !== assistantMessageId
      )
    );

    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
}




  return (
   <div className="app">
    <div className="chat-panel">
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

<section className="agent-card">
     


<div className="compact-pdf-upload">
  <label className="section-label">
    Document
  </label>

  <div className="pdf-file-row">
    <label className="pdf-upload-clickable">
      <input
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
      />

      <span className="pdf-upload-icon">↑</span>

      <span className="pdf-filename" title={file?.name || ""}>
        {file ? file.name : "Choose a PDF or click here to upload"}
      </span>

      {!file && (
        <span className="pdf-hint">Up to 10 MB</span>
      )}
    </label>

    {file && (
      <button
        type="button"
        className="remove-file"
        onClick={() => {
          setFile(null);
          setMessages([]);
          setAnswer("");
          setPages([]);
          setQuestion("");
          setError("");
        }}
      >
        Remove
      </button>
    )}
  </div>
</div>

{messages.length > 0 && (
  <section className="chat-container">
   

   {messages.map((message, index) => (
  <div
    key={message.id}
    className={`chat-message ${message.role}`}
  >
    {message.role === "assistant" && !message.content && loading ? (
      <div className="simple-loader">
        <span className="loader-spinner" />
        <span>Thinking...</span>
      </div>
    ) : (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {message.content}
      </ReactMarkdown>
    )}
  </div>
))}
   
  </section>
)}

 

          

      

</section>
{error && (
  <div className="result-error" role="alert">
    {error}
  </div>
)}










<form className="chat-input-form" onSubmit={handleSubmit}>
  <input
    className="chat-input"
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Ask anything about your PDF..."
    rows={1}
    disabled={loading}
  />

  <button
    type="submit"
    className="chat-send-button"
    disabled={loading || !file || !question.trim()}
    aria-label="Send question"
  >
    {loading ? "..." : "↑"}
  </button>
</form>

<p className="chat-input-hint">
  Answers are based on your uploaded PDF.
</p>
      </main>
</div>
    </div>
  );
}

export default App;
