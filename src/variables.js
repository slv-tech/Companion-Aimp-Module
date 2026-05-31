// ─────────────────────────────────────────────
//  Variables
// ─────────────────────────────────────────────

function fmtTime(seconds) {
	if (!seconds || seconds < 0) seconds = 0
	const m = Math.floor(seconds / 60)
	const s = Math.floor(seconds % 60)
	return `${m}:${s.toString().padStart(2, '0')}`
}

export function registerVariables(instance) {
	instance.setVariableDefinitions({
		player_state:          { name: 'Player State (playing/paused/stopped)' },
		volume_pct:            { name: 'Volume (0–100)' },
		muted:                 { name: 'Muted (true/false)' },
		shuffle:               { name: 'Shuffle (true/false)' },
		repeat:                { name: 'Repeat (true/false)' },
		auto_jump:             { name: 'Auto Jump (true/false)' },
		position:              { name: 'Position (s)' },
		position_fmt:          { name: 'Position (mm:ss)' },
		duration:              { name: 'Duration (s)' },
		duration_fmt:          { name: 'Duration (mm:ss)' },
		remaining:             { name: 'Remaining (s)' },
		remaining_fmt:         { name: 'Remaining (mm:ss)' },
		progress_pct:          { name: 'Progress (%)' },
		playing_track_title:   { name: 'Playing Track Title' },
		playing_track_artist:  { name: 'Playing Track Artist' },
		playing_playlist_id:   { name: 'Playing Playlist AIMP ID' },
		playing_playlist_name: { name: 'Playing Playlist Name' },
		playing_track_id:      { name: 'Playing Track ID' },
		focus_playlist_id:     { name: 'Focus Playlist AIMP ID' },
		focus_playlist_name:   { name: 'Focus Playlist Name' },
		focus_track_id:        { name: 'Focus Track ID' },
		focus_track_index:     { name: 'Focus Track Index (0-based)' },
		focus_track_title:     { name: 'Focus Track Title' },
		focus_track_artist:    { name: 'Focus Track Artist' },
		next_track_title:      { name: 'Next Track Title' },
		next_track_artist:     { name: 'Next Track Artist' },
	})
}

export function updateVariables(instance) {
	const s = instance.state
	const remaining = Math.max(0, s.duration - s.position)
	const progress  = s.duration > 0 ? Math.round((s.position / s.duration) * 100) : 0

	instance.setVariableValues({
		player_state:          s.playerState,
		volume_pct:            Math.round(s.volume),
		muted:                 s.muted,
		position:              s.position.toFixed(1),
		position_fmt:          fmtTime(s.position),
		duration:              s.duration.toFixed(1),
		duration_fmt:          fmtTime(s.duration),
		remaining:             remaining.toFixed(1),
		remaining_fmt:         fmtTime(remaining),
		progress_pct:          progress,
		shuffle:               s.shuffle,
		repeat:                s.repeat,
		auto_jump:             s.autoJump,
		playing_track_title:   s.playingTrackTitle,
		playing_track_artist:  s.playingTrackArtist,
		playing_playlist_id:   s.playingPlaylistId,
		playing_playlist_name: s.playingPlaylistName,
		playing_track_id:      s.playingTrackId,
		focus_playlist_id:     s.focusPlaylistId,
		focus_playlist_name:   s.focusPlaylistName,
		focus_track_id:        s.focusTrackId,
		focus_track_index:     s.focusTrackIndex,
		focus_track_title:     s.focusTrackTitle,
		focus_track_artist:    s.focusTrackArtist,
		next_track_title:      s.nextTrackTitle,
		next_track_artist:     s.nextTrackArtist,
	})
}