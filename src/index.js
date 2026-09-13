import { telegram } from "./telegram.js";
import { mainMenu, back } from "./keyboards.js";
import { setSession, getSession, updateSessionData } from "../db/sessions.js";


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
	const session = await getSession(chatId, env);

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

	if (session.state === "waiting_name") {
		await updateSessionData(
			chatId,
			"name",
			text,
			env
		);

		await setSession(
			chatId,
			"waiting_age",
			env
		);
	
		await telegram("sendMessage", {
			chat_id: chatId,
			text: "Сколько тебе лет?"
		}, env);
	
		return;
	}

	if (session.state === "waiting_age") {
		const age = Number(text);
	
		if (!Number.isInteger(age) || age < 14 || age > 100) {
			await telegram("sendMessage", {
				chat_id: chatId,
				text: "Введи возраст числом, например: 20"
			}, env);
	
			return;
		}
	
		await updateSessionData(
			chatId,
			"age",
			age,
			env
		);
	
		await setSession(
			chatId,
			"waiting_city",
			env
		);
	
		await telegram("sendMessage", {
			chat_id: chatId,
			text: "В каком городе ты живёшь?"
		}, env);
	
		return;
	}

	if (session.state === "waiting_city") {
		await updateSessionData(
			chatId,
			"city",
			text,
			env
		);
	
		await setSession(
			chatId,
			"waiting_height",
			env
		);
	
		await telegram("sendMessage", {
			chat_id: chatId,
			text: "Какой у тебя рост в сантиметрах?"
		}, env);
	
		return;
	}

	if (session.state === "waiting_height") {
		const height = Number(text);
	
		if (!Number.isInteger(height) || height < 130 || height > 230) {
			await telegram("sendMessage", {
				chat_id: chatId,
				text: "Введи рост в сантиметрах, например: 183"
			}, env);
	
			return;
		}
	
		await updateSessionData(
			chatId,
			"height",
			height,
			env
		);
	
		await setSession(
			chatId,
			"waiting_weight",
			env
		);
	
		await telegram("sendMessage", {
			chat_id: chatId,
			text: "Какой у тебя вес в кг?"
		}, env);
	
		return;
	}

	if (session.state === "waiting_weight") {
		const weight = Number(text);
	
		if (
			!Number.isFinite(weight) ||
			weight < 35 ||
			weight > 250
		) {
			await telegram("sendMessage", {
				chat_id: chatId,
				text: "Введи вес числом, например: 72"
			}, env);
	
			return;
		}
	
		await updateSessionData(
			chatId,
			"weight",
			weight,
			env
		);
	
		await setSession(
			chatId,
			"waiting_clothing_size",
			env
		);
	
		await telegram("sendMessage", {
			chat_id: chatId,
			text: "Какой размер одежды ты обычно носишь?"
		}, env);
	
		return;
	}
}

async function handleCallback(callback, env) {
	const chatId = callback.message.chat.id;
	const data = callback.data; 

	if (data === 'start_lead') {
		await telegram("answerCallbackQuery", {
			callback_query_id: callback.id
		}, env)

		await setSession(
			chatId,
			"waiting_name",
			env
		);
	

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
			reply_markup: back()
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
		}, env)

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

