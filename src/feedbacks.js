// ─────────────────────────────────────────────
//  Feedbacks
// ─────────────────────────────────────────────

export function registerFeedbacks(instance) {
	const plChoices = instance.playlistChoices.length
		? instance.playlistChoices
		: [{ id: '', label: '(loading)' }]

	instance.setFeedbackDefinitions({
		is_playing: {
			type: 'boolean',
			name: 'Player: Is Playing',
			defaultStyle: { bgcolor: 0x00aa00, color: 0xffffff },
			options: [],
			callback: () => instance.state.playerState === 'playing',
		},
		is_paused: {
			type: 'boolean',
			name: 'Player: Is Paused',
			defaultStyle: { bgcolor: 0xcccc00, color: 0x000000 },
			options: [],
			callback: () => instance.state.playerState === 'paused',
		},
		is_stopped: {
			type: 'boolean',
			name: 'Player: Is Stopped',
			defaultStyle: { bgcolor: 0xaa0000, color: 0xffffff },
			options: [],
			callback: () => instance.state.playerState === 'stopped',
		},
		is_muted: {
			type: 'boolean',
			name: 'Player: Is Muted',
			defaultStyle: { bgcolor: 0x884400, color: 0xffffff },
			options: [],
			callback: () => !!instance.state.muted,
		},
		volume_above: {
			type: 'boolean',
			name: 'Player: Volume ≥ X%',
			defaultStyle: { bgcolor: 0x00aaaa, color: 0xffffff },
			options: [
				{ type: 'number', id: 'threshold', label: 'Threshold (0–100)', default: 50, min: 0, max: 100 },
			],
			callback: (fb) => instance.state.volume >= fb.options.threshold,
		},
		focus_playlist_is: {
			type: 'boolean',
			name: 'Focus: Playlist matches',
			defaultStyle: { bgcolor: 0x0055aa, color: 0xffffff },
			options: [
				{
					type: 'dropdown', id: 'playlistId', label: 'Playlist',
					choices: plChoices,
					default: plChoices[0]?.id ?? '',
				},
			],
			callback: (fb) => String(instance.state.focusPlaylistId) === String(fb.options.playlistId),
		},
		focus_track_is: {
			type: 'boolean',
			name: 'Focus: Track matches (by file path)',
			defaultStyle: { bgcolor: 0x005599, color: 0xffffff },
			options: [
				{
					type: 'dropdown', id: 'playlistId', label: 'Playlist',
					choices: plChoices,
					default: plChoices[0]?.id ?? '',
				},
				{
					type: 'textinput', id: 'trackId', label: 'Track file path',
					default: '',
				},
			],
			callback: (fb) =>
				String(instance.state.focusPlaylistId) === String(fb.options.playlistId) &&
				instance.state.focusTrackId === fb.options.trackId,
		},
		playing_playlist_is: {
			type: 'boolean',
			name: 'Playing: Playlist matches',
			defaultStyle: { bgcolor: 0x006600, color: 0xffffff },
			options: [
				{
					type: 'dropdown', id: 'playlistId', label: 'Playlist',
					choices: plChoices,
					default: plChoices[0]?.id ?? '',
				},
			],
			callback: (fb) => String(instance.state.playingPlaylistId) === String(fb.options.playlistId),
		},
		playing_track_is: {
			type: 'boolean',
			name: 'Playing: Track matches (playlist + file path)',
			defaultStyle: { bgcolor: 0x006600, color: 0xffffff },
			options: [
				{
					type: 'dropdown', id: 'playlistId', label: 'Playlist',
					choices: plChoices,
					default: plChoices[0]?.id ?? '',
				},
				{
					type: 'textinput', id: 'trackId', label: 'Track file path',
					default: '',
				},
			],
			callback: (fb) =>
				String(instance.state.playingPlaylistId) === String(fb.options.playlistId) &&
				instance.state.playingTrackId === fb.options.trackId,
		},
		is_shuffled: {
			type: 'boolean',
			name: 'Player: Is Shuffled',
			defaultStyle: { bgcolor: 0x8800aa, color: 0xffffff },
			options: [],
			callback: () => !!instance.state.shuffle,
		},
		is_repeat: {
			type: 'boolean',
			name: 'Player: Is Repeat On',
			defaultStyle: { bgcolor: 0x8800aa, color: 0xffffff },
			options: [],
			callback: () => !!instance.state.repeat,
		},
		is_auto_jump: {
			type: 'boolean',
			name: 'Player: Is Auto Jump On',
			defaultStyle: { bgcolor: 0x8800aa, color: 0xffffff },
			options: [],
			callback: () => !!instance.state.autoJump,
		},
	})
}

export function allFeedbackIds() {
	return [
		'is_playing', 'is_paused', 'is_stopped',
		'is_muted',
		'volume_above',
		'focus_playlist_is', 'focus_track_is',
		'playing_playlist_is', 'playing_track_is',
		'is_shuffled', 'is_repeat', 'is_auto_jump',
	]
}