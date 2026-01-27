# Frontend Integration Guide: Excel-Powered Agentic RAG

This guide explains how to implement the frontend workflow for uploading Excel files (`.xlsx`, `.xls`) to the Stadia Agentic RAG system and performing document-scoped Q&A from them.

## Overview

The workflow consists of two main steps:
1.  **Ingestion**: Uploading the Excel file(s) to obtain a `doc_set_id`.
2.  **Interaction**: Using the `doc_set_id` to chat with the agent powered by the uploaded data.

---

## 1. Ingesting Excel Files

To process an Excel file, the frontend must send a `POST` request to the `/ingest` endpoint.

### Endpoint Details
- **URL**: `YOUR_BACKEND_URL/ingest`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### Headers
| Header | Description | Required |
| :--- | :--- | :--- |
| `X-Tenant-ID` | Unique identifier for the tenant/organization (e.g., "client-a") | Optional (Default: `default`) |

### Request Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `files` | `File[]` | One or more Excel files (`.xlsx` or `.xls`). |
| `user_id` | `string` | Unique identifier for the user (in query string). |

### Example JavaScript Request (Fetch)

```javascript
const formData = new FormData();
formData.append('files', excelFileInput.files[0]);

const response = await fetch('https://api.example.com/ingest?user_id=user_123', {
  method: 'POST',
  headers: {
    'X-Tenant-ID': 'stadia_internal'
  },
  body: formData
});

const data = await response.json();
console.log('Doc Set ID:', data.doc_set_id);
```

### Successful Response Schema
```json
{
  "doc_set_id": "8a7b6c5d4e...", // Save this for chat!
  "summary_cached": false,
  "document_summary": {
    "title": "Project Budget Q4",
    "main_topics": ["Revenue", "Expenses", "Forecast"],
    "key_entities": ["John Doe", "Marketing Dept"]
  },
  "message": "Indexed 45 chunks from 1 files",
  "stats": {
    "total_documents": 1,
    "total_chunks": 45
  }
}
```

---

## 2. Querying the Data (RAG)

Once you have the `doc_set_id`, all subsequent chat messages must include it to ensure the agent only looks at that specific Excel data.

### Endpoint Details
- **URL**: `YOUR_BACKEND_URL/chat`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body
| Field | Type | Description |
| :--- | :--- | :--- |
| `message` | `string` | The user's question (e.g., "What is the total budget for Q4?"). |
| `doc_set_id` | `string` | The ID received from the `/ingest` step. |
| `thread_id` | `string` | Session identifier for conversation history. |
| `user_id` | `string` | Unique identifier for the user. |

### Example JavaScript Request

```javascript
const chatBody = {
  message: "Give me the sum of all marketing expenses in the spreadsheet.",
  doc_set_id: "8a7b6c5d4e...",
  thread_id: "conversation_456",
  user_id: "user_123"
};

const response = await fetch('https://api.example.com/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'stadia_internal'
  },
  body: JSON.stringify(chatBody)
});

const result = await response.json();
console.log('Agent Answer:', result.answer);
```

---

## Key Features for Excel Processing

### 1. Tabular Context Preservation
The backend uses a specialized loader (`UnstructuredExcelLoader`) that preserves the structured relationships in spreadsheets. It extracts data in "elements" mode, which helps the agent understand rows and columns better than plain text extraction.

### 2. Multi-Sheet Support
Standard `.xlsx` files with multiple sheets are fully supported. The agent can aggregate info across sheets as long as they are part of the same upload session.

### 3. Citations
The response includes a `citations` array. For Excel files, the `source` will be the filename, and the backend is optimized to point the agent towards specific logical chunks of the spreadsheet.

---

## Troubleshooting

- **Large Files**: If an Excel file is extremely large, the `/ingest` request might take longer as the backend generates a summary and builds the vector index.
- **Empty Cells**: The agent is resilient to empty cells, but extremely sparse sheets might result in lower retrieval accuracy.
- **Formulas**: Note that the backend reads the *values* resulting from formulas, not the formula definitions themselves.
