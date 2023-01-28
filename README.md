## Calculate the amount of time you wasted playing Steam games

<br >

### Requirements

1. Install [Deno](https://deno.land/manual@v1.30.0/getting_started/installation)
2. Go [here](https://steamcommunity.com/dev/apikey) and log into your steam account, then proceed to create an api key. As domain url just use _127.0.0.1_.
3. Get the user ID of the profile for which you want to sum up the hours.

<br >

### Hot to use

> 🛸 The profile associated with the number should be public **or** the profile that generated the API key.

```bash
deno run -A https://github.com/lj-n/wasted-time-playing-games/blob/main/mod.ts --apiKey="Steam Api Key here" --steamId="Steam User ID here"
```

Should result in something like this:

```bash
🎲 Found 178 Games, with a total playtime of 4295 hours!

Your three most played games are:
┌──────────────────────────────────┬────────┐
│ (idx)                            │ Values │
├──────────────────────────────────┼────────┤
│ Dota 2                           │   1787 │
│ Counter-Strike: Global Offensive │    418 │
│ Counter-Strike: Source           │    221 │
└──────────────────────────────────┴────────┘
```
