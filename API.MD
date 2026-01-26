# Document-Scoped Agentic RAG API Documentation

This documentation details the API endpoints for the Document-Scoped Agentic RAG system. The API allows for document ingestion, chat interactions with scope enforcement, TTS generation, and evaluation.

## Base URL
The API is typically served at `http://localhost:8000` (or the configured host/port).

## Endpoints

### 1. Health Check
Checks if the API server is running.

- **URL**: `/health`
- **Method**: `GET`
- **Description**: Returns a simple status message to indicate the server is healthy.
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

---

### 2. Ingest Documents
Uploads and processes documents to create a document set.

- **URL**: `/ingest`
- **Method**: `POST`
- **Description**: 
  - Uploads files (PDF, DOCX, TXT, CSV, Excel, Images).
  - Computes a deterministic `doc_set_id` based on the file contents.
  - Generates or retrieves a cached `DocumentSummary`.
  - Splits and indexes the content into validity-scoped semantic chunks.
  
- **Query Parameters**:
  - `tenant_id` (string, optional): Identifier for multi-tenant isolation. Default: `"default"`.

- **Request Body**: `multipart/form-data`
  - `files`: List of files to upload.

- **Response**: `IngestResponse`
  ```json
  {
    "doc_set_id": "string (unique identifier for this set of documents)",
    "summary_cached": boolean,
    "document_summary": {
      "domain": "string",
      "covered_topics": ["string"],
      "excluded_topics": ["string"],
      "key_entities": ["string"],
      "time_range": "string | null",
      "language": "string",
      "document_intent": "string",
      "aliases": ["string"]
    },
    "message": "string",
    "failed_files": [["filename", "error_message"]],
    "stats": {
      "total_documents": integer,
      "total_chunks": integer
    }
  }
  ```

---

### 3. Chat
Interact with the RAG agent using a specific document set.

- **URL**: `/chat`
- **Method**: `POST`
- **Description**: 
  - Answers user questions based *only* on the documents in the specified `doc_set_id`.
  - Enforces scope using the cached `DocumentSummary`.
  - Generates citations and optional TTS audio.

- **Headers**:
  - `X-Tenant-ID` (string, optional): Tenant identifier. Default: `"default"`.

- **Request Body**: `ChatRequest`
  ```json
  {
    "message": "string (user question)",
    "doc_set_id": "string (required, returned from /ingest)",
    "thread_id": "string (optional, for conversation history)",
    "user_id": "string (optional)"
  }
  ```

- **Response**: `ChatResponse`
  ```json
  {
    "answer": "string (markdown formatted answer)",
    "citations": [
      {
        "source": "string (filename)",
        "page": integer
      }
    ],
    "audio": "string (base64 encoded audio bytes) | null"
  }
  ```

---

### 4. Text-to-Speech (TTS)
Generate audio for a given text string.

- **URL**: `/tts`
- **Method**: `POST`
- **Description**: detailed generation of audio from text.

- **Request Body**: `TTSRequest`
  ```json
  {
    "text": "string"
  }
  ```

- **Response**:
  ```json
  {
    "audio": "string (base64 encoded audio bytes)"
  }
  ```

---

### 5. Reset Knowledge Base
Clear all stored data.

- **URL**: `/reset`
- **Method**: `POST`
- **Description**: Clears the vector store and resets the internal graph state.

- **Response**:
  ```json
  {
    "message": "Knowledge base cleared successfully."
  }
  ```

---

### 6. Export to Word
Export the last chat result to a Word document.

- **URL**: `/export-to-word`
- **Method**: `POST`
- **Description**:  Generates a `.docx` file containing the question, answer, and citations from a chat interaction.

- **Request Body**: `ChatRequest` (Same as `/chat`)
  ```json
  {
    "message": "string",
    "doc_set_id": "string",
    "thread_id": "string",
    "user_id": "string"
  }
  ```

- **Response**: Binary stream (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`)

---

### 7. Evaluate
Run a RAG evaluation suite.

- **URL**: `/evaluate`
- **Method**: `POST`
- **Description**: Runs a set of predefined evaluation examples against the current document set and returns metrics.

- **Response**: `EvaluationResponse`
  ```json
  {
    "total_examples": integer,
    "overall_score": float,
    "retrieval_precision": float,
    "retrieval_recall": float,
    "answer_correctness": float,
    "answer_relevance": float,
    "results": [
      {
        "question": "string",
        "answer": "string",
        "ground_truth": "string",
        "score": float,
        ...
      }
    ],
    "passed": integer,
    "failed": integer
  }
  ```

---

### 8. Graph Visualization
Get a visualization of the LangGraph execution flow.

- **URL**: `/graph.png`
- **Method**: `GET`
- **Description**: Returns a PNG image of the current agent graph state.
- **Response**: Image (`image/png`)

## Data Models

### DocumentSummary
Structured metadata about the ingested documents, used for scoping.
```json
{
  "domain": "string",
  "covered_topics": ["string"],
  "excluded_topics": ["string"],
  "key_entities": ["string"],
  "time_range": "string | null",
  "language": "string",
  "document_intent": "string",
  "aliases": ["string"]
}
```

### Citation
Reference to a source document.
```json
{
  "source": "string",
  "page": integer
}
```
