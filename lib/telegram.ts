interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

interface OrderData {
  id: string;
  name: string;
  phone: string;
  messenger?: string | null;
  address: string;
  comment?: string | null;
  total: number;
  items: OrderItem[];
  createdAt: Date;
}

export async function sendOrderToTelegram(order: OrderData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram credentials not configured, skipping notification");
    return;
  }

  const itemsList = order.items
    .map((item) => {
      const isSet = !!item.size && item.size.includes(" / ");
      let sizeStr = "";
      if (isSet) {
        sizeStr = ` [Комплект: ${item.size}]`;
      } else if (item.size) {
        sizeStr = ` / ${item.size}`;
      }
      return `• ${item.productName}${item.color ? ` (${item.color})` : ""}${sizeStr} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString("ru-RU")} ₽`;
    })
    .join("\n");

  const message = `
🛍 *Новый заказ #${order.id.slice(-8).toUpperCase()}*

👤 *Клиент:* ${order.name}
📞 *Телефон:* ${order.phone}${order.messenger ? `\n💬 *Мессенджер:* ${order.messenger}` : ""}
📍 *Адрес ПВЗ:* ${order.address}
${order.comment ? `📝 *Комментарий:* ${order.comment}\n` : ""}
🛒 *Состав заказа:*
${itemsList}

💰 *Итого:* ${order.total.toLocaleString("ru-RU")} ₽

🕐 ${new Date(order.createdAt).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}
`.trim();

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to send Telegram notification:", error);
  }
}
