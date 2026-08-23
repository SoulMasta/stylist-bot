import { telegram } from "./telegram.js";
import { mainMenu } from "./keyboards.js";
import { back } from "./keyboards.js";

export default {
    async fetch(request, env) {
        try {
            if (request.method !== "POST") {
                return new Response("Stylist bot is alive");
            }

            const update = await request.json();

            console.log(JSON.stringify(update));

            if (update.message) {
                await handleMessage(update.message, env);
            }

            if (update.callback_query) {
                await handleCallback(update.callback_query, env);
            }

            return new Response("OK");
        } catch (error) {
            console.error(error);

            return new Response("Internal error", {
                status: 500
            });
        }
    }
};

async function handleMessage(message, env) {
    const chatId = message.chat.id;
    const text = message.text;

    if (!text) {
        return;
    }

    if (text === "/start") {
        await telegram("sendMessage", {
            chat_id: chatId,
            text:
                "Привет! 👋\n\n" +
                "Я твой личный стилист. Выбери то, что ты хочешь сегодня.",
            reply_markup: mainMenu()
        }, env);

        return;
    }
}

async function handleCallbacks(callback, env) {
	const chatId = callback.massage_chat.id;
	const data = callback.data; 

	if (data === 'lead_start') {
		await telegram("answerCallbackQuery", {
			callback_query_id: callback.id
		}, env)

		await telegram("sendMessage", {
			chat_id: chatId, 
			text: "Отлично. Начнём с нескольких вопросов.\n\nКак тебя зовут?"
		}, env)

		return;
	}

	if (data === "china") {
		await telegram("answerCallbackQuery", {
			callback_query_id: callback.id
		}, env)

		await telegram("sendMessage", {
			chat_id: chatId, 
			text: "Здесь ты можешь заказать любые вещи с любых платформ Китая: TaoBao, Pinduoduo, Poizon.\n\nПомимо этого доставляем брендовые легит вещи с бутиков, парфюм и то, на что необходим китайский ID.\nПока что эта страница бота в разработке, поэтому свяжись со мной для заказа в меню",
			reply_markup: back
		}, env)

		return;
	}

	if (data === "my_lead") {
		await telegram("answerCallbackQuery", {
			callback_query_id: callback.id
		}, env)

		await telegram("sendMessage", {
			chat_id: chatId, 
			text: "Твои данные таковы. Скажи, если нужно что то изменить", 
		})

		return;
	}

	if (data === "contact") {
        await telegram("answerCallbackQuery", {
            callback_query_id: callback.id
        }, env);

        await telegram("sendMessage", {
            chat_id: chatId,
            text: "Напиши мне напрямую: @geldhalter"
        }, env);

        return;
    }

	await telegram("answerCallbackQuery", {
        callback_query_id: callback.id
    }, env);
	
}

