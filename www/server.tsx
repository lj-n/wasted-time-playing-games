/** @jsx h */

import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.36/mod.ts";

import { getGameData, getProfileData } from "../mod.ts";
import { Page } from "./page.tsx";

const STEAM_API_KEY = Deno.env.get("STEAM_API_KEY") as string;

function getReponse(html: string) {
  const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
  return new Response(`<!DOCTYPE html>${html}`, { headers });
}

async function handler(req: Request) {
  const { searchParams, pathname } = new URL(req.url);

  if (pathname.startsWith("/robots.txt")) {
    const file = await Deno.readFile("www/robots.txt");
    return new Response(file, {
      headers: { "content-type": "text/plain" },
    });
  }

  /** User Input */
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
    const message = "Error! Be sure to use a valid ID and/or Key!";
    return getReponse(renderSSR(<Page error={message} />));
  }
}

serve(handler);
