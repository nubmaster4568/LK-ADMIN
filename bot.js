
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // For making HTTP requests
const app = express();
const port = process.env.PORT || 10000;

const token = '7486293552:AAGIlAv6UUvgZFczIXDm-FKYXpV85Fhgzhc';
const bot = new TelegramBot(token, { polling: true });

// Helper function to check if user is an admin
async function isAdmin(chatId, username) {
    try {
        // Fetch the list of admins
        const response = await axios.get('https://lk-kpxu.onrender.com//admins');
        const admins = response.data;

        // Check if chatId or username is in the list of admins
        return admins.includes(chatId.toString()) || admins.includes(username);
    } catch (error) {
        console.error('Error fetching admin list:', error.message);
        return false;
    }
}

// Helper function to check admin and send message
async function checkAdminAndExecute(ctx, callback) {
    const chatId = ctx.chat.id;
    const username = ctx.chat.username || ''; // Extract username if available

    // Only check admin status if the username is not 'lavkanalking'
    if (username !== 'lavkanalking') {
        const userIsAdmin = await isAdmin(chatId, username);

        if (userIsAdmin) {
            await callback(ctx);
        } else {
            await bot.sendMessage(chatId, 'You are not an admin.');
        }
    } else {
        // If username is 'lavkanalking', execute the callback without admin check
        await callback(ctx);
    }
}

// Handle /start command
bot.onText(/\/start/, async (msg) => {
    await checkAdminAndExecute(msg, async (ctx) => {
        const chatId = ctx.chat.id;

        bot.sendMessage(chatId, 'Welcome Admin! Here is the shop:', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'SHOP',
                            web_app: { url: `https://lk-kpxu.onrender.com/admin/index.html?userId=${chatId}` }
                        }
                    ]
                ]
            }
        });
    });
});

// Handle /removelocation command
bot.onText(/\/removelocation (.+)/, async (msg, match) => {
    await checkAdminAndExecute(msg, async (ctx) => {
        const chatId = ctx.chat.id;
        const locationName = match[1].trim(); // Extract location name from the command

        try {
            // Send a request to the /removelocation endpoint with correct payload
            const response = await axios.post('https://lk-kpxu.onrender.com/removelocation', {
                location_name: locationName
            });

            if (response.status === 200) {
                bot.sendMessage(chatId, `Location removed successfully: ${locationName}`);
            } else {
                bot.sendMessage(chatId, `Failed to remove location: ${locationName}`);
            }
        } catch (error) {
            console.error('Error removing location:', error.message);
            bot.sendMessage(chatId, `Error removing location: ${locationName}`);
        }
    });
});


// Handle /addadmin command
bot.onText(/\/addadmin (\w+)/, async (msg, match) => {
    await checkAdminAndExecute(msg, async (ctx) => {
        const chatId = ctx.chat.id;
        const userId = match[1];  // Extract userId from the command
        try {
            // Send a request to the /api/admins endpoint to add the admin
            const response = await axios.post('https://lk-kpxu.onrender.com/admins', {
                action: 'add',
                user_id: userId
            });

            if (response.status === 200) {
                bot.sendMessage(chatId, `User with ID ${userId} has been added as admin.`);
            } else {
                bot.sendMessage(chatId, `Failed to add user with ID ${userId} as admin.`);
            }
        } catch (error) {
            console.error('Error adding admin:', error.message);
            bot.sendMessage(chatId, `Error adding user with ID ${userId} as admin.`);
        }
    });
});

// Handle /removeadmin command
bot.onText(/\/removeadmin (\w+)/, async (msg, match) => {
    await checkAdminAndExecute(msg, async (ctx) => {
        const chatId = ctx.chat.id;
        const userId = match[1];  // Extract userId from the command
        try {
            // Send a request to the /api/admins endpoint to remove the admin
            const response = await axios.post('https://lk-kpxu.onrender.com/admins', {
                action: 'remove',
                user_id: userId
            });

            if (response.status === 200) {
                bot.sendMessage(chatId, `User with ID ${userId} has been removed from admin.`);
            } else {
                bot.sendMessage(chatId, `Failed to remove user with ID ${userId} from admin.`);
            }
        } catch (error) {
            console.error('Error removing admin:', error.message);
            bot.sendMessage(chatId, `Error removing user with ID ${userId} from admin.`);
        }
    });
});

// Handle /admins command to list admins
bot.onText(/\/admins/, async (msg) => {
    await checkAdminAndExecute(msg, async (ctx) => {
        const chatId = ctx.chat.id;

        try {
            // Send a request to the /admins endpoint to get the list of admins
            const response = await axios.get('https://lk-kpxu.onrender.com/admins');

            if (response.status === 200) {
                const admins = response.data;
                if (admins.length > 0) {
                    bot.sendMessage(chatId, `List of admins:\n${admins.join('\n')}`);
                } else {
                    bot.sendMessage(chatId, 'No admins found.');
                }
            } else {
                bot.sendMessage(chatId, 'Failed to retrieve list of admins.');
            }
        } catch (error) {
            console.error('Error listing admins:', error.message);
            bot.sendMessage(chatId, 'Error retrieving list of admins.');
        }
    });
});

// Handle /addlocation command
bot.onText(/\/addlocation (.+)/, async (msg, match) => {
    await checkAdminAndExecute(msg, async (ctx) => {
        const chatId = ctx.chat.id;
        const locationName = match[1].trim(); // Extract location name from the command

        try {
            // Send a request to the /addlocation endpoint with correct payload
            const response = await axios.post('https://lk-kpxu.onrender.com/addlocation', {
                location_name: locationName
            });

            if (response.status === 200) {
                bot.sendMessage(chatId, `Location added successfully: ${locationName}`);
            } else {
                bot.sendMessage(chatId, `Failed to add location: ${locationName}`);
            }
        } catch (error) {
            console.error('Error adding location:', error.message);
            bot.sendMessage(chatId, `Error adding location: ${locationName}`);
        }
    });
});

app.get('/', (req, res) => {
    res.send('Telegram Bot is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

