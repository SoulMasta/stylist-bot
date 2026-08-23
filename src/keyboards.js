export function mainMenu() {
    return{
        inline_keyboard: [
        [
            {
            text: "📝 Помощь в стиле по-братски",
            callback_data: "start_lead",
            },
        ],
        [
            {
            text: "Заказ с Китая",
            callback_data: "china",
            },
        ],
        [
            {
            text: "Мой профиль",
            callback_data: "my_lead",
            },
        ],
        [
            {
            text: "Персональный разбор",
            callback_data: "about",
            },
        ],
        [
            {
            text: "💬 Связаться со мной",
            callback_data: 'contact'
            },
        ],
        ],
    };
}

export function back() {
    return {
        inline_keyboard: [
            [
                {
                text: 'На главное меню', 
                callback_data: 'to_main'
                }
            ],
        ]
    }
}