import axios from "axios";
import { CONFIG } from "@/config";

class ChatService {
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
      const response = await axios.post(
        `${CONFIG.API_BASE_URL}/chat`,
        {
          message,
          doc_set_id: docSetId,
          thread_id: threadId,
          user_id: userId,
        },
        {
          timeout: 60000,
          headers: {
            "X-Tenant-ID": "default",
          },
        }
      );
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // تم إزالة دالة sendVoiceMessage لأنها لم تعد ضرورية.
  // سيتم استخدام sendMessage لجميع أنواع الإرسال.
}

export const chatService = new ChatService();
