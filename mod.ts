import { parse } from "https://deno.land/std@0.175.0/flags/mod.ts";
import { z } from "https://deno.land/x/zod@v3.20.2/mod.ts";

/** Parse command line arguments into structured data */
const { apiKey, steamId, silent } = parse(Deno.args, {
  string: ["apiKey", "steamId"],
  boolean: ["silent"],
  default: { silent: true },
});

try {
  if (!apiKey || !steamId) {
    throw new Error("Please provide a steam api key and an user id.");
  }

  const params = new URLSearchParams({
    key: apiKey,
    steamid: steamId,
    include_appinfo: "true",
    include_played_free_games: "true",
  });

  const url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?";

  const res = await fetch(url + params);

  if (!res.ok) {
    throw new Error(
      res.status + ": " + res.statusText +
        ", Probably wrong Api-Key or User-ID",
    );
  }

  const data = await res.json();

  const GamesSchema = z.object({
    name: z.string(),
    playtime_forever: z.number(),
  }).array();

  const games = GamesSchema.parse(data.response.games);

  const sum = games.reduce((acc, game) => acc + game.playtime_forever, 0);

  console.log(
    `%c\n🎲 Found ${games.length} Games, with a total playtime of %c${
      Math.round(sum / 60)
    }%c hours!\n`,
    "color: orange",
    "font-weight: bold; color: orange",
    "font-weight: normal; color: orange",
  );

  /** Log the three most played games */
  games.sort((a, b) => b.playtime_forever - a.playtime_forever);

  console.log("Your three most played games are:");

  const topGames: { [key: string]: number } = {};
  for (let i = 0; i < 3; i++) {
    topGames[games[i].name] = Math.round(games[i].playtime_forever / 60);
  }

  console.table(topGames);
} catch (error) {
  console.log(`%c\n💡 ${error.message}\n`, "color: red");
  if (!silent) console.log(error.stack);
}
