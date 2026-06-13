exports.handler = async (event) => {
  // Разрешаем CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method not allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, phone } = data;

    if (!name || !phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Заполните все поля" })
      };
    }

    // Токен и Chat ID из переменных окружения (скрыты!)
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `🌿 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}`;

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    if (response.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    } else {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Ошибка отправки в Telegram" })
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
