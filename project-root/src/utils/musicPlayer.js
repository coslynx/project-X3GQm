const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const nodeFetch = require('node-fetch');
const Queue = require('./queue');

class MusicPlayer {
  constructor(guild, voiceChannel, textChannel) {
    this._guild = guild;
    this._voiceChannel = voiceChannel;
    this._textChannel = textChannel;
    this._connection = null;
    this._player = createAudioPlayer();
    this._dispatcher = null;
    this._currentTrack = null;
    this._queue = new Queue();
    this._volume = 1;
    this._loopMode = false;

    this._player.on('error', (error) => {
      console.error('Music player error:', error);
      this._textChannel.send('An error occurred while playing music. Please try again.');
    });

    this._player.on('finish', () => {
      this._nextTrack();
    });

    this._player.on('idle', () => {
      if (this._queue.getLength() > 0) {
        this._nextTrack();
      } else {
        this._stopMusic();
      }
    });
  }

  /**
   * Joins the voice channel.
   */
  async joinVoiceChannel() {
    try {
      this._connection = joinVoiceChannel({
        channelId: this._voiceChannel.id,
        guildId: this._guild.id,
        adapterCreator: this._guild.voiceAdapterCreator,
      });
      this._connection.subscribe(this._player);
    } catch (error) {
      console.error('Error joining voice channel:', error);
      this._textChannel.send('Failed to join the voice channel. Please make sure I have the necessary permissions.');
    }
  }

  /**
   * Plays the specified track.
   *
   * @param {Object} track The track to play.
   */
  async play(track) {
    try {
      const stream = ytdl(track.url, { filter: 'audioonly', quality: 'highestaudio' });
      const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

      this._dispatcher = this._player.play(resource);
      this._currentTrack = track;
      this._textChannel.send(`Now playing: ${track.title} by ${track.artist}`);

      this._dispatcher.on('finish', () => {
        this._nextTrack();
      });
    } catch (error) {
      console.error('Error playing track:', error);
      this._textChannel.send('An error occurred while playing the track. Please try again.');
    }
  }

  /**
   * Stops the current track.
   */
  stop() {
    if (this._dispatcher) {
      this._dispatcher.stop();
      this._textChannel.send('Stopped playing music.');
    }
  }

  /**
   * Pauses playback.
   */
  pause() {
    if (this._dispatcher) {
      this._dispatcher.pause();
      this._textChannel.send('Paused playback.');
    }
  }

  /**
   * Resumes playback.
   */
  resume() {
    if (this._dispatcher) {
      this._dispatcher.resume();
      this._textChannel.send('Resumed playback.');
    }
  }

  /**
   * Sets the playback volume.
   *
   * @param {number} volume The volume to set (0-100).
   */
  setVolume(volume) {
    if (this._dispatcher) {
      this._volume = volume / 100;
      this._dispatcher.setVolumeLogarithmic(this._volume);
      this._textChannel.send(`Volume set to ${volume}%`);
    }
  }

  /**
   * Sets the looping mode.
   *
   * @param {string} loopMode The looping mode (song or queue).
   */
  setLoop(loopMode) {
    if (loopMode === 'song') {
      this._loopMode = true;
      this._textChannel.send('Looping the current song.');
    } else if (loopMode === 'queue') {
      this._loopMode = 'queue';
      this._textChannel.send('Looping the entire queue.');
    } else {
      this._loopMode = false;
      this._textChannel.send('Looping disabled.');
    }
  }

  /**
   * Adds a track to the queue.
   *
   * @param {Object} track The track to add to the queue.
   */
  addToQueue(track) {
    this._queue.add(track);
    this._textChannel.send(`${track.title} by ${track.artist} added to the queue.`);
  }

  /**
   * Skips to the next track in the queue.
   */
  skipTrack() {
    if (this._dispatcher) {
      this._dispatcher.stop();
      this._textChannel.send('Skipping to the next track.');
    }
  }

  /**
   * Stops the music and disconnects from the voice channel.
   */
  _stopMusic() {
    if (this._connection) {
      this._connection.disconnect();
      this._textChannel.send('Disconnected from the voice channel.');
    }
    this._connection = null;
    this._dispatcher = null;
    this._currentTrack = null;
    this._queue.clear();
  }

  /**
   * Plays the next track in the queue.
   */
  _nextTrack() {
    if (this._loopMode && this._currentTrack) {
      this.play(this._currentTrack);
      return;
    }

    const nextTrack = this._queue.dequeue();
    if (nextTrack) {
      this.play(nextTrack);
    } else {
      this._stopMusic();
    }
  }
}

module.exports = MusicPlayer;