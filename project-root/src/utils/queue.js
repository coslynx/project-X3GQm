class Queue {
  constructor() {
    this._queue = [];
  }

  /**
   * Adds a track to the queue.
   *
   * @param {Object} track The track to add to the queue.
   */
  add(track) {
    this._queue.push(track);
  }

  /**
   * Removes a track from the queue.
   *
   * @param {Object} track The track to remove from the queue.
   */
  remove(track) {
    const index = this._queue.indexOf(track);
    if (index !== -1) {
      this._queue.splice(index, 1);
    }
  }

  /**
   * Shuffles the queue.
   */
  shuffle() {
    for (let i = this._queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._queue[i], this._queue[j]] = [this._queue[j], this._queue[i]];
    }
  }

  /**
   * Returns the next track in the queue without removing it.
   *
   * @returns {Object} The next track in the queue.
   */
  peek() {
    return this._queue[0];
  }

  /**
   * Removes and returns the next track in the queue.
   *
   * @returns {Object} The next track in the queue.
   */
  dequeue() {
    return this._queue.shift();
  }

  /**
   * Returns the number of tracks in the queue.
   *
   * @returns {number} The number of tracks in the queue.
   */
  getLength() {
    return this._queue.length;
  }
}

module.exports = Queue;