<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Intelligence Frontend</title>
</head>

<body>

<h1>Document Intelligence Frontend</h1>

<p>
    React + Vite frontend for the
    <strong>Document Intelligence &amp; Question Extraction Service</strong>.
</p>

<p>
    The application provides authentication, document upload, asynchronous
    processing status, extracted questions, options, source pages,
    confidence/review information, and answer-key results.
</p>

<hr>

<h2>Features</h2>

<ul>
    <li>User registration</li>
    <li>User login</li>
    <li>JWT-authenticated API requests</li>
    <li>PDF/JPEG/PNG document upload</li>
    <li>Asynchronous processing status</li>
    <li>Processing status polling</li>
    <li>Extracted question display</li>
    <li>Multiple-choice option display</li>
    <li>Correct answer display</li>
    <li>Source-page information</li>
    <li>Extraction confidence</li>
    <li>Review-required indicators</li>
    <li>Separate answer-key upload workflow</li>
    <li>Responsive dashboard UI</li>
    <li>Processing pipeline visualization</li>
    <li>Extraction summary statistics</li>
</ul>

<hr>

<h2>Technology Stack</h2>

<table>
    <thead>
        <tr>
            <th>Component</th>
            <th>Technology</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>UI</td>
            <td>React</td>
        </tr>

        <tr>
            <td>Build Tool</td>
            <td>Vite</td>
        </tr>

        <tr>
            <td>Language</td>
            <td>JavaScript</td>
        </tr>

        <tr>
            <td>HTTP Client</td>
            <td>Axios</td>
        </tr>

        <tr>
            <td>Styling</td>
            <td>CSS</td>
        </tr>

        <tr>
            <td>Backend</td>
            <td>FastAPI</td>
        </tr>
    </tbody>
</table>

<hr>

<h2>Project Structure</h2>

<pre>
document-intelligence-frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
</pre>

<hr>

<h2>Prerequisites</h2>

<ul>
    <li>Node.js</li>
    <li>npm</li>
    <li>Git</li>
    <li>Running FastAPI backend</li>
</ul>

<p>
    The frontend expects the backend API at:
</p>

<pre>
http://127.0.0.1:8000/api/v1
</pre>

<hr>

<h2>Installation</h2>

<h3>1. Clone the repository</h3>

<pre>
git clone https://github.com/Md-Mohseen-Ali/document-intelligence-frontend.git
cd document-intelligence-frontend
</pre>

<h3>2. Install dependencies</h3>

<pre>
npm install
</pre>

<hr>

<h2>Run the Frontend</h2>

<p>Start the Vite development server:</p>

<pre>
npm run dev
</pre>

<p>
    The frontend will normally be available at:
</p>

<pre>
http://localhost:5173
</pre>

<p>or:</p>

<pre>
http://127.0.0.1:5173
</pre>

<hr>

<h2>Backend Setup</h2>

<p>
    The frontend communicates with the following backend service:
</p>

<p>
    <a href="https://github.com/Md-Mohseen-Ali/document-intelligence-service">
        Document Intelligence Backend
    </a>
</p>

<h3>Start PostgreSQL and Redis</h3>

<pre>
docker compose up -d
</pre>

<h3>Start FastAPI</h3>

<pre>
uvicorn app.main:app --reload
</pre>

<h3>Start Celery Worker</h3>

<pre>
celery -A app.worker.celery_app worker --loglevel=info --pool=solo
</pre>

<hr>

<h2>Application Flow</h2>

<pre>
Register / Login
       |
       v
   Dashboard
       |
       v
 Upload Document
       |
       v
Processing Status
       |
       v
Extracted Questions
       |
       +------------------+
       |                  |
       v                  v
    Options          Source Pages
       |
       v
Confidence / Review
       |
       v
 Upload Answer Key
       |
       v
Associated Answers
</pre>

<hr>

<h2>Demonstration Workflow</h2>

<ol>
    <li>Register or log in to the application.</li>
    <li>Upload a question PDF or supported image.</li>
    <li>Show the document processing status.</li>
    <li>Wait for processing to complete.</li>
    <li>Display the extracted questions.</li>
    <li>Show options and source pages.</li>
    <li>Show confidence and review information.</li>
    <li>Upload a separate answer-key document.</li>
    <li>Wait for answer-key processing.</li>
    <li>Display the associated answers.</li>
</ol>

<hr>

<h2>Backend APIs Used</h2>

<h3>Authentication</h3>

<pre>
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
</pre>

<h3>Documents</h3>

<pre>
POST /api/v1/documents
GET  /api/v1/documents/{document_id}/status
</pre>

<h3>Questions</h3>

<pre>
GET /api/v1/documents/{document_id}/questions
GET /api/v1/questions/{question_id}
</pre>

<h3>Answers</h3>

<pre>
GET /api/v1/questions/{question_id}/answer
</pre>

<hr>

<h2>UI Design</h2>

<p>
    The dashboard is designed specifically around the document intelligence
    workflow rather than a generic administration interface.
</p>

<ul>
    <li>Authentication screen</li>
    <li>Document upload area</li>
    <li>Processing pipeline visualization</li>
    <li>Processing status indicators</li>
    <li>Extraction summary statistics</li>
    <li>Question cards</li>
    <li>Option display</li>
    <li>Correct answer highlighting</li>
    <li>Confidence indicators</li>
    <li>Review warnings</li>
    <li>Source-page display</li>
    <li>Responsive layout</li>
</ul>

<hr>

<h2>Answer Key Workflow</h2>

<p>
    When an answer-key document is uploaded, the frontend preserves the
    original question-document context.
</p>

<pre>
Question Document
       |
       v
Extract Questions
       |
       v
Upload Answer Key
       |
       v
Associate Answers
       |
       v
Display Questions + Answers
</pre>

<hr>

<h2>Development Commands</h2>

<h3>Development server</h3>

<pre>
npm run dev
</pre>

<h3>Production build</h3>

<pre>
npm run build
</pre>

<h3>Preview production build</h3>

<pre>
npm run preview
</pre>

<hr>

<h2>API Configuration</h2>

<p>
    The current frontend communicates with:
</p>

<pre>
http://127.0.0.1:8000/api/v1
</pre>

<p>
    The FastAPI backend must be running for authentication, document uploads,
    processing status, and extracted results.
</p>

<p>
    For local development, the backend allows the Vite development origins:
</p>

<pre>
http://localhost:5173
http://127.0.0.1:5173
</pre>

<hr>

<h2>Important Note</h2>

<p>
    The frontend does not perform OCR or document extraction itself.
    Document processing is handled asynchronously by the FastAPI backend
    and Celery worker.
</p>

<pre>
React
  |
  v
FastAPI
  |
  v
Redis / Celery
  |
  v
Document Processing
  |
  +--&gt; PyMuPDF
  |
  +--&gt; OpenCV
  |
  +--&gt; Tesseract OCR
  |
  +--&gt; Question Extraction
  |
  +--&gt; Answer Association
  |
  v
PostgreSQL
</pre>

<p>
    The frontend consumes the resulting structured data through REST APIs.
</p>

<hr>

<h2>Related Repository</h2>

<p>
    Backend:
    <a href="https://github.com/Md-Mohseen-Ali/document-intelligence-service">
        https://github.com/Md-Mohseen-Ali/document-intelligence-service
    </a>
</p>

<p>
    Frontend:
    <a href="https://github.com/Md-Mohseen-Ali/document-intelligence-frontend">
        https://github.com/Md-Mohseen-Ali/document-intelligence-frontend
    </a>
</p>

<hr>

<h2>License</h2>

<p>
    Developed as an engineering assignment and demonstration project.
</p>

</body>
</html>
