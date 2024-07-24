
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const port = process.env.PORT || 3000;

const token = '7237894833:AAHB2FJLiU9-pczE_NDm5Xdcd6dBwHd6uBE';
const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Check if the chat ID matches the specified ID
    if (chatId === 6981136606) {
        console.log(chatId);  // Log the chat ID
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
    } else {
        console.log(`Ignored chat ID: ${chatId}`);
    }
});

app.get('/', (req, res) => {
    res.send('Telegram Bot is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

