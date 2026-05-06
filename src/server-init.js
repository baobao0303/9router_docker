import initializeApp from "./shared/services/initializeApp.js";

async function startServer() {
  console.log("Starting server...");
  
  try {
    await initializeApp();
    console.log("Server initialized");

    // Tự động ping mỗi 14 phút để giữ Render không bị Sleep
    const pingUrl = process.env.RENDER_EXTERNAL_URL || process.env.CLOUD_URL;
    if (pingUrl) {
      console.log(`[Keep-Alive] Đã bật chế độ tự động ping tới ${pingUrl} mỗi 14 phút...`);
      setInterval(() => {
        const targetUrl = `${pingUrl}/api/health`;
        fetch(targetUrl)
          .then(res => {
            if (res.ok) console.log(`[Keep-Alive] Ping thành công lúc ${new Date().toISOString()}`);
            else console.log(`[Keep-Alive] Ping trả về mã lỗi: ${res.status}`);
          })
          .catch(err => console.log(`[Keep-Alive] Ping thất bại: ${err.message}`));
      }, 14 * 60 * 1000); // 14 phút
    } else {
      console.log("[Keep-Alive] Không tìm thấy biến môi trường RENDER_EXTERNAL_URL hoặc CLOUD_URL, tính năng tự ping bị tắt.");
    }
  } catch (error) {
    console.log("Error initializing server:", error);
    process.exit(1);
  }
}

startServer().catch(console.log);

export default startServer;
