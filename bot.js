
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const port = process.env.PORT || 3000;

const token = '7343754319:AAExlcVRzUi0iCE8Y4CSFAPCJQUdZ9WNHmc';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'SHOP', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'SHOP',
            web_app: { url: `https://lk-rt5d.onrender.com/admin/index.html?userId=${chatId}` }
                    }
                ]
            ]
        }
    });
});

app.get('/', (req, res) => {
    res.send('Telegram Bot is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

