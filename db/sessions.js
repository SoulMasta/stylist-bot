export async function getSession(telegramId, env) {
    const result = await env.stylist_db
        .prepare(`
            SELECT *
            FROM sessions
            WHERE telegram_id = ?
        `)
        .bind(String(telegramId))
        .first();

    return result;
}

export async function setSession(telegramId, state, env) {
    await env.stylist_db
        .prepare(`
            INSERT INTO sessions (
                telegram_id,
                state
            )
            VALUES (?, ?)

            ON CONFLICT(telegram_id)
            DO UPDATE SET
                state = excluded.state,
                updated_at = CURRENT_TIMESTAMP
        `)
        .bind(
            String(telegramId),
            state
        )
        .run();
}

export async function updateSessionData(
    telegramId,
    key,
    value,
    env
) {
    const session = await getSession(
        telegramId,
        env
    );

    const data = session?.data
        ? JSON.parse(session.data)
        : {};

    data[key] = value;

    await env.stylist_db
        .prepare(`
            UPDATE sessions
            SET
                data = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE telegram_id = ?
        `)
        .bind(
            JSON.stringify(data),
            String(telegramId)
        )
        .run();
}
