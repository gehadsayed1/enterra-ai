import axios from "axios";
import { CONFIG } from "@/config";

class ChatService {
  constructor() {
    this.api = axios.create({
      baseURL: CONFIG.API_BASE_URL,
      headers: {
        "X-Tenant-ID": "default",
      },
      timeout: 60000,
    });
  }

  /**
   * Sends a text query to the server.
   * @param {string} message - The user's message.
   * @param {string} docSetId - The document set ID from ingestion.
   * @param {string} threadId - The conversation thread ID.
   * @param {string} userId - The user ID.
   * @returns {Promise<{answer: string, citations: Array, audio: string|null}>}
   */
  async sendMessage(message, docSetId, threadId, userId) {
    console.log("🚀 Sending to API:", { message, docSetId, threadId, userId });

    try {
      const response = await this.api.post("/chat", {
        message,
        doc_set_id: docSetId,
        thread_id: threadId,
        user_id: userId,
      });
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  /**
   * Generates audio from text using the backend TTS engine.
   * @param {string} text
   * @returns {Promise<{audio: string}>}
   */
  async speech(text) {
    try {
      const response = await this.api.post("/tts", { text });
      return response.data;
    } catch (error) {
      console.error("TTS Error:", error);
      throw error;
    }
  }

  /**
   * Exports the current chat thread to a Word document.
   * @param {string} docSetId
   * @param {string} threadId
   * @returns {Promise<Blob>}
   */
  async exportDocx(docSetId, threadId) {
    try {
      const response = await this.api.post(
        "/export-to-word",
        {
          message: "Requesting export",
          doc_set_id: docSetId,
          thread_id: threadId,
        },
        {
          responseType: "blob",
        },
      );
      return response.data;
    } catch (error) {
      console.error("Export Error:", error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
