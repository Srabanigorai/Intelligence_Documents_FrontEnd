import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000/api/v1";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [file, setFile] = useState(null);

  const [documentId, setDocumentId] = useState(null);
  const [status, setStatus] = useState(null);

  // Keeps the original question document when an answer key is uploaded.
  const [questionDocumentId, setQuestionDocumentId] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ---------------------------------------------------------
  // AUTHENTICATION
  // ---------------------------------------------------------

  async function authenticate() {
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        await axios.post(`${API}/auth/register`, {
          email,
          password,
        });
      }

      const response = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      const accessToken = response.data.access_token;

      localStorage.setItem("token", accessToken);
      setToken(accessToken);

      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // UPLOAD
  // ---------------------------------------------------------

  async function uploadDocument() {
    if (!file) {
      setError("Please select a PDF or image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (questions.length > 0 && documentId) {
        setQuestionDocumentId(documentId);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API}/documents`,
        formData,
        {
          headers: {
            ...authHeaders,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newDocumentId = response.data.id;

      setDocumentId(newDocumentId);
      setStatus(response.data.status);
      setFile(null);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // STATUS
  // ---------------------------------------------------------

  async function loadStatus() {
    if (!documentId) {
      return;
    }

    try {
      const response = await axios.get(
        `${API}/documents/${documentId}/status`,
        {
          headers: authHeaders,
        }
      );

      const currentStatus = response.data.status;

      setStatus(currentStatus);

      if (currentStatus === "COMPLETED") {
        const targetDocumentId =
          questionDocumentId || documentId;

        await loadQuestions(targetDocumentId);
      }

      if (currentStatus === "FAILED") {
        setError(
          response.data.error_message ||
            "Document processing failed."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not get document status"
      );
    }
  }

  // ---------------------------------------------------------
  // QUESTIONS
  // ---------------------------------------------------------

  async function loadQuestions(targetDocumentId) {
    if (!targetDocumentId) {
      return;
    }

    try {
      const response = await axios.get(
        `${API}/documents/${targetDocumentId}/questions`,
        {
          headers: authHeaders,
        }
      );

      const extractedQuestions =
        response.data.questions || [];

      setQuestions(extractedQuestions);

      if (extractedQuestions.length > 0) {
        setQuestionDocumentId(targetDocumentId);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not load questions"
      );
    }
  }

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------

  function logout() {
    localStorage.removeItem("token");

    setToken(null);
    setDocumentId(null);
    setQuestionDocumentId(null);
    setQuestions([]);
    setStatus(null);
    setFile(null);
  }

  // ---------------------------------------------------------
  // POLLING
  // ---------------------------------------------------------

  useEffect(() => {
    if (
      token &&
      documentId &&
      status !== "COMPLETED" &&
      status !== "FAILED"
    ) {
      const interval = setInterval(
        loadStatus,
        2000
      );

      return () => clearInterval(interval);
    }
  }, [token, documentId, status]);

  // ---------------------------------------------------------
  // LOGIN / REGISTER
  // ---------------------------------------------------------

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-layout">
          <div className="auth-brand">
            <div className="brand-mark">DI</div>

            <p className="eyebrow">
              DOCUMENT INTELLIGENCE
            </p>

            <h1>
              Turn documents into
              <span> structured knowledge.</span>
            </h1>

            <p className="auth-description">
              Upload question papers, scanned documents
              and answer keys. Extract structured
              questions with source pages and confidence
              information.
            </p>

            <div className="feature-list">
              <div>
                <span>✓</span>
                PDF & image processing
              </div>

              <div>
                <span>✓</span>
                OCR for scanned documents
              </div>

              <div>
                <span>✓</span>
                Question & answer extraction
              </div>

              <div>
                <span>✓</span>
                Confidence-based review
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-mobile-brand">
              <div className="brand-mark">DI</div>
            </div>

            <p className="form-eyebrow">
              {mode === "login"
                ? "WELCOME BACK"
                : "GET STARTED"}
            </p>

            <h2>
              {mode === "login"
                ? "Sign in to your workspace"
                : "Create your account"}
            </h2>

            <p className="form-description">
              {mode === "login"
                ? "Continue processing your documents."
                : "Start extracting structured data from documents."}
            </p>

            <div className="form-group">
              <label>Email address</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            {error && (
              <div className="error">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              className="primary-button auth-submit"
              onClick={authenticate}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign in"
                : "Create account"}

              {!loading && <span>→</span>}
            </button>

            <div className="auth-switch">
              <span>
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>

              <button
                onClick={() => {
                  setMode(
                    mode === "login"
                      ? "register"
                      : "login"
                  );
                  setError("");
                }}
              >
                {mode === "login"
                  ? "Create one"
                  : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------

  const answeredCount = questions.filter(
    (question) => question.answer
  ).length;

  const reviewCount = questions.filter(
    (question) => question.review_required
  ).length;

  const pages = [
    ...new Set(
      questions.flatMap(
        (question) => question.source_pages || []
      )
    ),
  ];

  const averageConfidence =
    questions.length > 0
      ? Math.round(
          (questions.reduce(
            (sum, question) =>
              sum + (question.confidence || 0),
            0
          ) /
            questions.length) *
            100
        )
      : 0;

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark small">
              DI
            </div>

            <div>
              <h1>Document Intelligence</h1>
              <p>
                Question Extraction Service
              </p>
            </div>
          </div>

          <div className="header-actions">
            <div className="user-pill">
              <span className="user-avatar">
                {email
                  ? email.charAt(0).toUpperCase()
                  : "U"}
              </span>

              <span>
                {email || "Workspace"}
              </span>
            </div>

            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container">

        {/* HERO */}

        <section className="hero">
          <div>
            <p className="eyebrow blue">
              DOCUMENT PROCESSING WORKSPACE
            </p>

            <h2>
              Extract questions.
              <br />
              <span>Structure the information.</span>
            </h2>

            <p>
              Upload a question paper or answer key
              and let the processing pipeline turn
              unstructured documents into structured data.
            </p>
          </div>

          <div className="hero-status">
            <span className="status-dot"></span>
            Processing service
            <strong>Ready</strong>
          </div>
        </section>

        {/* UPLOAD */}

        <section className="upload-card">

          <div className="card-heading">
            <div>
              <p className="card-label">
                INPUT DOCUMENT
              </p>

              <h3>Upload a document</h3>

              <p>
                Supported formats: PDF, JPG, JPEG and PNG
              </p>
            </div>

            <div className="upload-icon">
              ↑
            </div>
          </div>

          <label className="drop-zone">
            <div className="drop-icon">
              ↑
            </div>

            <strong>
              Choose a document to process
            </strong>

            <span>
              Click to browse from your computer
            </span>

            <small>
              PDF, JPG, JPEG, PNG · Maximum 10 MB
            </small>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />
          </label>

          {file && (
            <div className="selected-file">
              <div className="file-icon">
                {file.name
                  .toLowerCase()
                  .endsWith(".pdf")
                  ? "PDF"
                  : "IMG"}
              </div>

              <div className="file-info">
                <strong>{file.name}</strong>
                <span>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>

              <button
                className="remove-file"
                onClick={() => setFile(null)}
              >
                ×
              </button>
            </div>
          )}

          <div className="upload-action">
            <button
              className="primary-button upload-button"
              onClick={uploadDocument}
              disabled={loading}
            >
              {loading
                ? "Uploading..."
                : "Upload & Process"}

              {!loading && <span>→</span>}
            </button>
          </div>

          {error && (
            <div className="error">
              <span>!</span>
              {error}
            </div>
          )}
        </section>

        {/* STATUS */}

        {documentId && (
          <section className="processing-card">

            <div className="processing-top">
              <div>
                <p className="card-label">
                  PROCESSING STATUS
                </p>

                <h3>
                  Document #{documentId}
                </h3>
              </div>

              <div
                className={`status-badge status-${String(
                  status
                ).toLowerCase()}`}
              >
                <span></span>
                {status}
              </div>
            </div>

            <div className="processing-steps">

              <div
                className={
                  status
                    ? "processing-step active"
                    : "processing-step"
                }
              >
                <span>01</span>
                <div>
                  <strong>Uploaded</strong>
                  <small>
                    Document received
                  </small>
                </div>
              </div>

              <div className="step-line"></div>

              <div
                className={
                  status === "PROCESSING" ||
                  status === "COMPLETED"
                    ? "processing-step active"
                    : "processing-step"
                }
              >
                <span>02</span>
                <div>
                  <strong>Processing</strong>
                  <small>
                    Extracting document data
                  </small>
                </div>
              </div>

              <div className="step-line"></div>

              <div
                className={
                  status === "COMPLETED"
                    ? "processing-step active"
                    : "processing-step"
                }
              >
                <span>03</span>
                <div>
                  <strong>Completed</strong>
                  <small>
                    Structured data ready
                  </small>
                </div>
              </div>

            </div>

            {status !== "COMPLETED" &&
              status !== "FAILED" && (
                <div className="processing-message">
                  <span className="spinner"></span>
                  Processing your document. This may
                  take a few moments...
                </div>
              )}

          </section>
        )}

        {/* SUMMARY */}

        {questions.length > 0 && (
          <>
            <section className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon blue-icon">
                  Q
                </div>

                <div>
                  <span>Questions</span>
                  <strong>{questions.length}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple-icon">
                  P
                </div>

                <div>
                  <span>Source pages</span>
                  <strong>{pages.length}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green-icon">
                  ✓
                </div>

                <div>
                  <span>Answered</span>
                  <strong>{answeredCount}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange-icon">
                  !
                </div>

                <div>
                  <span>Review needed</span>
                  <strong>{reviewCount}</strong>
                </div>
              </div>

            </section>

            {/* SOURCE */}

            <div className="question-source">
              <div>
                <span className="source-label">
                  QUESTION SOURCE
                </span>

                <strong>
                  Document #{questionDocumentId}
                </strong>
              </div>

              <div className="source-meta">
                <span>
                  {questions.length} questions
                </span>

                <span>
                  {averageConfidence}% avg. confidence
                </span>
              </div>
            </div>

            {/* QUESTIONS */}

            <section className="questions-section">

              <div className="section-header">
                <div>
                  <p className="card-label">
                    EXTRACTED DATA
                  </p>

                  <h2>
                    Questions
                  </h2>
                </div>

                <span className="question-count">
                  {questions.length} extracted
                </span>
              </div>

              {questions.map((question, index) => (
                <article
                  className="question-card"
                  key={question.id}
                >

                  <div className="question-card-top">

                    <div className="question-number">
                      <span>
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div>
                        <small>
                          QUESTION
                        </small>

                        <strong>
                          Q{question.question_number}
                        </strong>
                      </div>
                    </div>

                    <div className="page-badge">
                      PAGE{" "}
                      {question.source_pages?.join(
                        ", "
                      ) || "—"}
                    </div>
                  </div>

                  <div className="question-content">

                    <p className="question-text">
                      {question.question_text}
                    </p>

                    {question.options?.length > 0 && (
                      <div className="options">

                        {question.options.map(
                          (option) => (
                            <div
                              className={`option ${
                                question.answer ===
                                option.label
                                  ? "correct"
                                  : ""
                              }`}
                              key={`${question.id}-${option.label}`}
                            >
                              <span className="option-label">
                                {option.label}
                              </span>

                              <span className="option-text">
                                {option.text}
                              </span>

                              {question.answer ===
                                option.label && (
                                <span className="correct-mark">
                                  ✓
                                </span>
                              )}
                            </div>
                          )
                        )}

                      </div>
                    )}

                    <div className="question-footer">

                      <div className="answer-info">
                        <span className="footer-label">
                          ANSWER
                        </span>

                        <span
                          className={
                            question.answer
                              ? "answer-badge"
                              : "answer-badge unavailable"
                          }
                        >
                          {question.answer ||
                            "Not available"}
                        </span>
                      </div>

                      <div className="confidence-info">
                        <span className="footer-label">
                          CONFIDENCE
                        </span>

                        <div className="confidence">
                          <div className="confidence-bar">
                            <span
                              style={{
                                width: `${Math.round(
                                  (question.confidence ||
                                    0) * 100
                                )}%`,
                              }}
                            ></span>
                          </div>

                          <strong>
                            {Math.round(
                              (question.confidence ||
                                0) * 100
                            )}
                            %
                          </strong>
                        </div>
                      </div>

                    </div>

                    {question.review_required && (
                      <div className="review-warning">
                        <span>!</span>

                        <div>
                          <strong>
                            Manual review recommended
                          </strong>

                          <small>
                            This extraction has been
                            flagged for verification.
                          </small>
                        </div>
                      </div>
                    )}

                  </div>

                </article>
              ))}

            </section>
          </>
        )}

      </main>

      <footer className="footer">
        <span>
          Document Intelligence & Question Extraction
        </span>

        <span>
          FastAPI · PostgreSQL · Redis · OCR
        </span>
      </footer>
    </div>
  );
}

export default App;