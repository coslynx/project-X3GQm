# Discord Music Bot

This project implements a Discord music bot designed to enhance the social and entertainment aspects of Discord servers. It offers a wide range of features for music playback, search, and queue management, all within the Discord environment.

## Features:

* **Music Playback:** Plays music from various sources like YouTube, Spotify, and SoundCloud.
* **Search Functionality:** Allows users to search for specific songs, artists, or playlists.
* **Queue Management:** Maintains a queue of requested songs for collaborative listening.
* **Volume Control:** Enables users to adjust the playback volume.
* **Looping:** Supports looping the current song or the entire queue.
* **Voice Channel Management:** Joins and leaves voice channels seamlessly.
* **User Interaction:** Interacts with users through text chat commands.
* **Error Handling:**  Includes robust error handling to ensure smooth operation.
* **Logging:** Records bot activity, errors, and important events for troubleshooting.

## Installation:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/discord-music-bot.git
   ```

2. **Install Dependencies:**
   ```bash
   cd discord-music-bot
   npm install
   ```

3. **Create a .env File:**
   Create a `.env` file in the project root directory and add the following environment variables:

   ```
   DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
   PREFIX=!
   YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
   SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID
   SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET
   SOUNDCLOUD_CLIENT_ID=YOUR_SOUNDCLOUD_CLIENT_ID
   SOUNDCLOUD_CLIENT_SECRET=YOUR_SOUNDCLOUD_CLIENT_SECRET
   ```

4. **Start the Bot:**
   ```bash
   node src/index.js
   ```

## Usage:

* **!play <query>:** Plays a song from YouTube, Spotify, or SoundCloud.
* **!skip:** Skips the current song.
* **!stop:** Stops the current song and clears the queue.
* **!queue:** Displays the current music queue.
* **!volume <volume>:** Sets the playback volume (0-100).
* **!loop <mode>:** Loops the current song or the entire queue (mode: song or queue).
* **!join:** Joins the user's voice channel.
* **!help:** Displays a list of available commands.

## Contributing:

Contributions are welcome! Please follow these guidelines:

1. **Fork the Repository:** Create a fork of the repository on GitHub.
2. **Create a Branch:** Create a new branch for your feature or bug fix.
3. **Commit Your Changes:** Commit your changes with clear and concise commit messages.
4. **Push to Your Branch:** Push your branch to your fork on GitHub.
5. **Create a Pull Request:** Submit a pull request to the original repository.

## License:

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements:

* **discord.js:** https://discord.js.org/
* **ytdl-core:** https://www.npmjs.com/package/ytdl-core
* **@discordjs/voice:** https://www.npmjs.com/package/@discordjs/voice
* **spotify-web-api-node:** https://www.npmjs.com/package/spotify-web-api-node
* **soundcloud:** https://www.npmjs.com/package/soundcloud
* **winston:** https://www.npmjs.com/package/winston

Enjoy the music!