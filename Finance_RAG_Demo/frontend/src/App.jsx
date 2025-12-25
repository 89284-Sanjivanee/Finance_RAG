import { useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState({});
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  /* ---------------- File Upload ---------------- */

  const uploadFile = async () => {
    if (!file) {
      setUploadMsg("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BACKEND_URL}/ingest/file`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setUploadMsg(`Uploaded successfully: ${data.filename}`);
      setFile(null);
    } catch (err) {
      setUploadMsg("File upload failed");
    }

    setUploading(false);
  };

  /* ---------------- Query ---------------- */

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setSources({});

    try {
      const res = await fetch(
        `${BACKEND_URL}/query?question=${encodeURIComponent(question)}`
      );

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      setAnswer(data.answer);
      setSources(data.sources || {});
    } catch (err) {
      setError("Failed to connect to backend");
    }

    setLoading(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>Finance RAG Demo</h2>

      {/* Upload Section */}
      <section style={{ marginBottom: "30px" }}>
        <h3>Upload Financial Document</h3>

        <input
          type="file"
          accept=".pdf,.csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button onClick={uploadFile} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        {uploadMsg && <p>{uploadMsg}</p>}
      </section>

      <hr />

      {/* Query Section */}
      <section style={{ marginTop: "30px" }}>
        <h3>Ask a Question</h3>

        <input
          style={{ width: "400px", padding: "10px" }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a finance question..."
        />

        <br /><br />

        <button onClick={askQuestion} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>

        <br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        {answer && (
          <div style={{ background: "#black", padding: "15px" }}>
            <strong>Answer:</strong>
            <p>{answer}</p>
          </div>
        )}

        {Object.keys(sources).length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <strong>Sources:</strong>
            <ul>
              {Object.entries(sources).map(([key, value]) => (
                <li key={key}>
                  [{key}] {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
