## Steam Total: Calculate the amount of time you wasted playing Steam games

<br />

### WWW

> 🛸 [steam-total.deno.dev](https://steam-total.deno.dev/)

### CLI

1. Install [Deno](https://deno.land/manual@v1.30.0/getting_started/installation)
2. [Go here](https://steamcommunity.com/dev/apikey) and log into your Steam account, then proceed to create an Steam Web Api Key.
   As domain url just use _127.0.0.1_.
3. Get the Steam ID of the profile for which you want to sum up the hours.

> 🛸 The profile associated with the number should be public **or** the profile that generated the API key.

```bash
deno run -A https://raw.githubusercontent.com/lj-n/wasted-time-playing-games/main/cli.ts --apiKey="Steam Api Key here" --steamId="Steam User ID here"
```
