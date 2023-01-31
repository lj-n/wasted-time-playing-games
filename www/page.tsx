/** @jsx h */
/** @jsxFrag Fragment */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="dom.iterable" />
/// <reference lib="deno.ns" />

import {
	Fragment,
	h,
	render,
} from "https://deno.land/x/nano_jsx@v0.0.36/mod.ts";
import { Language, minify } from "https://deno.land/x/minifier@v1.1.1/mod.ts";
import { formatMinutes, type GameData, type ProfileData } from "../mod.ts";

const css = await Deno.readTextFile("www/style.css");

interface PageProps {
	profile?: ProfileData;
	games?: GameData;
	error?: string;
}

export function Page({ error, games, profile }: PageProps) {
	const Form = render(
		<form action="/">
			<label>
				Steam ID
				<input
					required
					type="text"
					name="steamId"
					id="steam-id"
					placeholder="Steam ID"
				/>
			</label>

			<label>
				Steam Web API Key <span>(optional)</span>
				<input type="text" name="apiKey" id="apy-key" />
			</label>
			<div class="info">
				<p>
					If you provide no Steam Web Api Key, the Steam ID's user
					profile must be public! You can{" "}
					<a href="https://steamcommunity.com/dev/apikey">
						create an api key here
					</a>
					.
				</p>
			</div>

			<button type="submit">get total sum</button>
		</form>
	);

	const Content = render(
		games && profile ? (
			<>
				<div class="divider" />
				<div class="profile">
					<a href={profile.profileURL}>
						<img
							src={profile.avatar}
							alt={`${profile.profileName} Steam Avatar`}
							height="64px"
							width="64px"
						/>
					</a>
					<div>
						<h2>{profile.profileName}</h2>
						<span>Steam ID: {profile.steamId}</span>
					</div>
				</div>
				<span class="total">
					📜 You played a total of{" "}
					<strong>{formatMinutes(games.totalPlaytime)}</strong>!
				</span>
				<h3>Your top played games are:</h3>
				<table>
					{games.mostPlayed.map((g) => (
						<tr>
							<td>{g.name}:</td>
							<td>{formatMinutes(g.playtime)}</td>
						</tr>
					))}
				</table>
			</>
		) : null
	);

	return (
		<html lang="en">
			<head>
				<title>Get Your Total Played Steam Hours</title>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width" />
				<meta
					name="description"
					content="Calculate the amount of time you wasted playing Steam games."
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content="Get Your Total Played Steam Hours"
				/>
				<meta
					property="og:description"
					content="Calculate the amount of time you wasted playing Steam games."
				/>
				<style>{minify(Language.CSS, css)}</style>
			</head>
			<body>
				<h1>Get Your Total Played Steam Hours</h1>

				<Content />

				<div class="divider" />

				<Form />

				{error ? <span class="error">{error}</span> : null}

				<footer>
					<a href="https://github.com/lj-n/wasted-time-playing-games">Sourcecode</a>
				</footer>
			</body>
		</html>
	);
}
