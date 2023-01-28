## Calculate the amount of time you wasted playing Steam games

<br >

### Requirements

1. Install [Deno](https://deno.land/manual@v1.30.0/getting_started/installation)
2. Go [here](https://steamcommunity.com/dev/apikey) and log into your steam account, then proceed to create an api key. As domain url just use _127.0.0.1_.

<br >

### Hot to use

```bash
deno run -A https://github.com/lj-n/wasted-time-playing-games/blob/main/mod.ts --apiKey="Steam Api Key here" --steamId="Steam User ID here"
```