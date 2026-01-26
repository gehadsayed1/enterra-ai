import axios from "axios";
import { CONFIG } from "@/config";

class RAGService {
  constructor() {
    this.api = axios.create({
      baseURL: CONFIG.API_BASE_URL,
      headers: {
        "X-Tenant-ID": "default",
      },
    });
  }

  /**
   * Checks if the API server is running.
   */
  async checkHealth() {
    try {
      const response = await this.api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Health Check Error:", error);
      throw error;
    }
  }

  /**
   * Uploads and processes documents.
   * @param {FileList|File[]} files
   * @param {string} tenantId
   */
  async ingestDocuments(files, tenantId = "default") {
    try {
      const formData = new FormData();
      if (files instanceof FileList) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      } else if (Array.isArray(files)) {
        files.forEach((file) => formData.append("files", file));
      } else {
        formData.append("files", files); // Single file
      }

      const response = await this.api.post("/ingest", formData, {
        params: { tenant_id: tenantId },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Ingestion Error:", error);
      throw error;
    }
  }

  /**
   * Clears the vector store and resets internal graph state.
   */
  async resetKB() {
    try {
      const response = await this.api.post("/reset");
      return response.data;
    } catch (error) {
      console.error("Reset Error:", error);
      throw error;
    }
  }

  /**
   * Runs the evaluation suite and returns metrics.
   */
  async evaluate() {
    try {
      const response = await this.api.post("/evaluate");
      return response.data;
    } catch (error) {
      console.error("Evaluation Error:", error);
      throw error;
    }
  }

  /**
   * Returns the URL for graph visualization.
   */
  getGraphUrl() {
    return `${CONFIG.API_BASE_URL}/graph.png?t=${Date.now()}`;
  }
}

export const ragService = new RAGService();
