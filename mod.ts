import { z } from "https://deno.land/x/zod@v3.20.2/mod.ts";

export const formatMinutes = (m: number) => {
  const h = Math.floor(m / 60);
  m = m % 60;

  const hours = h === 1 ? "1 hour" : h > 1 ? `${h} hours` : "";
  const minutes = m === 1 ? "1 minute" : m > 1 ? `${m} minutes` : "";

  return `${hours} ${minutes}`.trim();
};

export type ProfileData = Awaited<ReturnType<typeof getProfileData>>;
export type GameData = Awaited<ReturnType<typeof getGameData>>;

interface GetSteamDataArgs {
  steamId: string;
  apiKey: string;
}

export async function getProfileData(options: GetSteamDataArgs) {
  const url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?";
  const params = new URLSearchParams({
    key: options.apiKey,
    steamids: options.steamId,
  });

  const res = await fetch(url + params);
  const data = await res.json();

  const ProfileSchema = z.object({
    steamid: z.string(),
    personaname: z.string(),
    avatarmedium: z.string(),
    profileurl: z.string(),
  });

  const {
    avatarmedium: avatar,
    personaname: profileName,
    steamid: steamId,
    profileurl: profileURL,
  } = ProfileSchema.parse(data.response.players[0]);

  return { avatar, steamId, profileName, profileURL };
}

export async function getGameData(options: GetSteamDataArgs) {
  const url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?";
  const params = new URLSearchParams({
    key: options.apiKey,
    steamid: options.steamId,
    include_appinfo: "true",
    include_played_free_games: "true",
  });

  const res = await fetch(url + params);
  const data = await res.json();

  const GamesSchema = z.array(z.object({
    name: z.string(),
    playtime_forever: z.number(),
  }));

  const games = GamesSchema.parse(data.response.games);
  const totalPlaytime = games.reduce(
    (acc, game) => acc + game.playtime_forever,
    0,
  );

  /** Get the three most played games */
  games.sort((a, b) => b.playtime_forever - a.playtime_forever);
  const mostPlayed = games.slice(0, 3).map((g) => ({
    name: g.name,
    playtime: g.playtime_forever,
  }));

  return { totalPlaytime, mostPlayed };
}
