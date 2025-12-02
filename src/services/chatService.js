import axios from "axios";
import { CONFIG } from "@/config";

class ChatService {
  /**
   * يرسل استعلام نصي إلى الخادم ويتوقع رداً نصياً ورابطاً للصوت (TTS).
   * @param {string} query - الاستعلام النصي.
   * @returns {Promise<{answer: string, audioUrl: string}>} - الرد النصي ورابط ملف الصوت.
   */
  async sendMessage(query) {
    console.log("🚀 Sending to API:", query);

    try {
      const response = await axios.post(
        `${CONFIG.API_BASE_URL}/chat`,
        {
          query,
        },
        { timeout: 60000 } // زيادة المهلة الزمنية لانتظار توليد الصوت
      );
      console.log("✅ API Response:", response.data);
      // نتوقع أن يحتوي الرد على answer (نص) و audioUrl (رابط الصوت)
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // تم إزالة دالة sendVoiceMessage لأنها لم تعد ضرورية.
  // سيتم استخدام sendMessage لجميع أنواع الإرسال.
}

export const chatService = new ChatService();
