import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async function ({ platform }) {
	const queryResult = await platform?.env.DATABASE.prepare('SELECT * FROM todos LIMIT 5').run();

	return json(queryResult);
};

export const POST: RequestHandler = async function ({ request, platform }) {
	const { name, description, dueDate, priority } = await request.json();

    const createdAt = new Date().toISOString();

	try {
        const formattedDueDate = new Date(dueDate).toISOString();

		await platform?.env.DATABASE.prepare(
			'INSERT INTO todos (id, name, description, due_date, priority, created_at) VALUES (NULL, ?, ?, ?, ?, ?)'
		)
			.bind(name, description, formattedDueDate, priority, createdAt)
			.run();

		return json({
			success: true
		});
	} catch {
		return new Response('Internal Error', {
			status: 500
		});
	}
};
