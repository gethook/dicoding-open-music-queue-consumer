const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT id, name FROM playlists 
            WHERE id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songlists 
            LEFT JOIN songs ON songs.id=songlists.song_id
            WHERE songlists.playlist_id = $1`,
      values: [id],
    };

    const songsResult = await this._pool.query(querySongs);
    const songs = songsResult.rows;

    const playlist = result.rows[0];
    playlist.songs = songs;
    return { playlist };
  }
}

module.exports = PlaylistsService;
