import axios from "axios";
import { CONFIG } from "@/config";

class ChatService {
  async sendMessage(query) {
    console.log("🚀 Sending to API:", query);
    
    try {
      const response = await axios.post(`${CONFIG.API_BASE_URL}/chat/`, {
        query,
      }, { timeout: 30000 });
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const chatService = new ChatService();
