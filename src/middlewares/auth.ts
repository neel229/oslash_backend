import { IContext } from "../interfaces/context";
import type { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { verifyJWT } from "../utils/jwt";

export const isAuth: MiddlewareFn<IContext> = async ({ context }, next) => {
	const auth = context.req.headers["authorization"];
	if (!auth) throw new Error("Not Authenticated");
	try {
		const sig = auth.split(" ")[0];
		if (sig !== "Bearer") throw new Error("Invalid token type");
		const token = auth.split(" ")[1];
		const payload = verifyJWT(token);
		context.payload = payload;
	} catch (err) {
		console.error(err);
		throw new Error("Not Authenticated");
	}

	return next();
};
