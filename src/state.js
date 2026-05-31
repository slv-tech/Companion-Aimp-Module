// ─────────────────────────────────────────────
//  Initial state
// ─────────────────────────────────────────────

export function buildInitialState() {
	return {
		playerState:         'stopped',
		volume:              50,
		muted:               false,
		position:            0,
		duration:            0,

		// Playing — привязка к aimp_id плейлиста, file_path трека
		playingPlaylistId:   '', // aimp_id (GUID)
		playingPlaylistName: '',
		playingTrackId:      '', // file_path (стабильный идентификатор)
		playingTrackTitle:   '',
		playingTrackArtist:  '',

		// Focus — привязка к aimp_id плейлиста, file_path трека
		focusPlaylistId:     '', // aimp_id (GUID)
		focusPlaylistName:   '',
		focusTrackId:        '', // file_path (стабильный идентификатор)
		focusTrackIndex:     0,
		focusTrackTitle:     '',
		focusTrackArtist:    '',

		// Next track (from API)
		nextTrackTitle:      '',
		nextTrackArtist:     '',

		// Shuffle / Repeat / Auto-jump
		shuffle:             false,
		repeat:              false,
		autoJump:            false,

		// Internal — отслеживание изменений по aimp_id
		_playlistAimpIds:    '',
	}
}