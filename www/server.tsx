/** @jsx h */

import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.36/mod.ts";

import { getGameData, getProfileData } from "../mod.ts";
import { Page } from "./page.tsx";

const { STEAM_API_KEY } = config({ path: "www/.env" });

async function handler(req: Request) {
  /** User Input */
  const { searchParams } = new URL(req.url);
  const steamId = searchParams.get("steamId");
  const apiKey = searchParams.get("apiKey") || STEAM_API_KEY;

  if (!steamId) {
    return new Response(renderSSR(<Page />), {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }

  try {
    const [profile, games] = await Promise.all([
      getProfileData({ steamId, apiKey }),
      getGameData({ steamId, apiKey }),
    ]);

    return new Response(
      renderSSR(<Page profile={profile} games={games} />),
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.log(error);
    return new Response(
      renderSSR(
        <Page error="This did not work, sorry! Be sure to use a valid steam user id or api key!" />,
      ),
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      },
    );
  }
}

serve(handler);
