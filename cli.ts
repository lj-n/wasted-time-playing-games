import { parse } from "https://deno.land/std@0.175.0/flags/mod.ts";
import * as cl from "https://deno.land/std@0.175.0/fmt/colors.ts";
import { formatMinutes, getGameData, getProfileData } from "./mod.ts";

/** Parse command line arguments into structured data */
const { apiKey, steamId, silent } = parse(Deno.args, {
  string: ["apiKey", "steamId"],
  boolean: ["silent"],
  default: { silent: true },
});

// getUserData({ apiKey, userId, silent });
async function runCLI() {
  if (!apiKey || !steamId) {
    console.log(cl.red("👻 Please provide a Steam Api Key and User Id."));
    return;
  }

  try {
    const [profile, { mostPlayed, totalPlaytime }] = await Promise.all([
      getProfileData({ apiKey, steamId }),
      getGameData({ apiKey, steamId }),
    ]);

    console.log(
      "\nFound the Steam Profile",
      cl.black(cl.italic(profile.profileName)),
      "with the Steam ID",
      cl.black(cl.italic(profile.steamId)),
    );

    console.log(
      `${profile.profileName}'s total playtime:`,
      cl.bold(cl.brightGreen(formatMinutes(totalPlaytime))),
      "\n\n",
    );

    console.log(cl.italic("The most played games are"));

    for (const { name, playtime } of mostPlayed) {
      console.log(`${name}: `, cl.blue(formatMinutes(playtime)));
    }
    console.log("\n");
  } catch (error) {
    console.log(cl.red(`👻 Error: ${error.message}`));
    if (!silent) console.log(error.stack);
  }
}

runCLI();
