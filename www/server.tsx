/** @jsx h */

import * as dotenv from "https://deno.land/std@0.175.0/dotenv/mod.ts";
import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.36/mod.ts";

import { getGameData, getProfileData } from "../mod.ts";
import { Page } from "./page.tsx";

const { STEAM_API_KEY } = await dotenv.load({ envPath: "www/.env" });

function getReponse(html: string) {
	const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
	return new Response(`<!DOCTYPE html>${html}`, { headers });
}

async function handler(req: Request) {
	/** User Input */
	const { searchParams } = new URL(req.url);
	const steamId = searchParams.get("steamId");
	const apiKey = searchParams.get("apiKey") || STEAM_API_KEY;

	if (!steamId) {
		return getReponse(renderSSR(<Page />));
	}

	try {
		const [profile, games] = await Promise.all([
			getProfileData({ steamId, apiKey }),
			getGameData({ steamId, apiKey }),
		]);

		return getReponse(renderSSR(<Page profile={profile} games={games} />));
	} catch (error) {
		console.log(error);
		return getReponse(
			renderSSR(
				<Page error="This did not work, sorry! Be sure to use a valid steam user id or api key!" />
			)
		);
	}
}

serve(handler);
