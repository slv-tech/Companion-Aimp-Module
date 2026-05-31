// ─────────────────────────────────────────────
//  Actions
// ─────────────────────────────────────────────

export function buildActions(instance) {
	const plChoices = instance.playlistChoices.length
		? instance.playlistChoices
		: [{ id: '', label: '(no playlists)' }]

	const defaultPlId = plChoices[0]?.id ?? ''

	return {
		// ══════════════════════════════════════════
		//  PLAYER CONTROLS
		// ══════════════════════════════════════════

		play: {
			name: '▶ Play',
			options: [],
			callback: async () => { await instance._request('POST', '/player/play') },
		},
		pause: {
			name: '⏸ Pause',
			options: [],
			callback: async () => { await instance._request('POST', '/player/pause') },
		},
		play_pause: {
			name: '▶⏸ Play / Pause Toggle',
			options: [],
			callback: async () => {
				if (instance.state.playerState === 'playing') {
					await instance._request('POST', '/player/pause')
				} else {
					await instance._request('POST', '/player/play')
				}
			},
		},
		stop: {
			name: '⏹ Stop',
			options: [],
			callback: async () => { await instance._request('POST', '/player/stop') },
		},
		next: {
			name: '⏭ Next Track',
			options: [],
			callback: async () => { await instance._request('POST', '/player/next') },
		},
		prev: {
			name: '⏮ Previous Track',
			options: [],
			callback: async () => { await instance._request('POST', '/player/prev') },
		},

		// ══════════════════════════════════════════
		//  VOLUME & MUTE
		// ══════════════════════════════════════════

		mute_toggle: {
			name: '🔇 Mute Toggle',
			options: [],
			callback: async () => { await instance._request('POST', '/player/mute') },
		},
		set_volume: {
			name: '🔊 Set Volume (absolute)',
			options: [
				{ type: 'number', id: 'volume', label: 'Volume (0–100)', default: 50, min: 0, max: 100 },
			],
			callback: async (action) => {
				await instance._request('PUT', '/player/volume', null, { volume: action.options.volume })
			},
		},
		volume_up: {
			name: '🔊 Volume Up',
			options: [
				{ type: 'number', id: 'step', label: 'Step', default: 5, min: 1, max: 50 },
			],
			callback: async (action) => {
				const next = Math.min(100, Math.round(instance.state.volume) + (action.options.step ?? 5))
				await instance._request('PUT', '/player/volume', null, { volume: next })
			},
		},
		volume_down: {
			name: '🔉 Volume Down',
			options: [
				{ type: 'number', id: 'step', label: 'Step', default: 5, min: 1, max: 50 },
			],
			callback: async (action) => {
				const next = Math.max(0, Math.round(instance.state.volume) - (action.options.step ?? 5))
				await instance._request('PUT', '/player/volume', null, { volume: next })
			},
		},

		// ══════════════════════════════════════════
		//  SHUFFLE / REPEAT / AUTO-JUMP
		// ══════════════════════════════════════════

		shuffle_toggle: {
			name: '🔀 Shuffle Toggle',
			options: [],
			callback: async () => { await instance._request('POST', '/player/shuffle') },
		},
		repeat_toggle: {
			name: '🔁 Repeat Toggle',
			options: [],
			callback: async () => { await instance._request('POST', '/player/repeat') },
		},
		auto_jump_toggle: {
			name: '⏭ Auto Jump Toggle',
			options: [],
			callback: async () => { await instance._request('POST', '/player/auto-jump') },
		},

		// ══════════════════════════════════════════
		//  SEEK
		// ══════════════════════════════════════════

		seek_seconds: {
			name: '⏩ Seek to Position (seconds)',
			options: [
				{ type: 'number', id: 'position', label: 'Position (s)', default: 0, min: 0, max: 36000 },
			],
			callback: async (action) => {
				await instance._request('PUT', '/player/position', null, { position: action.options.position })
			},
		},
		seek_percent: {
			name: '⏩ Seek to Position (%)',
			options: [
				{ type: 'number', id: 'percent', label: 'Percent (0–100)', default: 0, min: 0, max: 100 },
			],
			callback: async (action) => {
				if (instance.state.duration > 0) {
					const pos = (action.options.percent / 100) * instance.state.duration
					await instance._request('PUT', '/player/position', null, { position: pos })
				}
			},
		},

		// ══════════════════════════════════════════
		//  FOCUS NAVIGATION
		// ══════════════════════════════════════════

		focus_playlist_next: {
			name: '▶ Focus: Next Playlist',
			options: [],
			callback: async () => { await instance._request('POST', '/focus/playlist/next') },
		},
		focus_playlist_prev: {
			name: '◀ Focus: Previous Playlist',
			options: [],
			callback: async () => { await instance._request('POST', '/focus/playlist/prev') },
		},
		focus_track_next: {
			name: '▶ Focus: Next Track',
			options: [],
			callback: async () => { await instance._request('POST', '/focus/track/next') },
		},
		focus_track_prev: {
			name: '◀ Focus: Previous Track',
			options: [],
			callback: async () => { await instance._request('POST', '/focus/track/prev') },
		},
		focus_play: {
			name: '▶ Focus: Play Focused Track',
			options: [],
			callback: async () => { await instance._request('POST', '/focus/play') },
		},

		// ══════════════════════════════════════════
		//  PLAYLIST ACTIONS
		// ══════════════════════════════════════════

		playlist_play: {
			name: '▶ Playlist: Play from Beginning',
			options: [
				{ type: 'dropdown', id: 'playlistId', label: 'Playlist', choices: plChoices, default: defaultPlId },
			],
			callback: async (action) => {
				const idx = instance._playlistIndex(action.options.playlistId)
				if (idx == null) return
				await instance._request('POST', `/playlists/${idx}/play`)
			},
		},
		playlist_select: {
			name: '☑ Playlist: Select (activate tab)',
			options: [
				{ type: 'dropdown', id: 'playlistId', label: 'Playlist', choices: plChoices, default: defaultPlId },
			],
			callback: async (action) => {
				const idx = instance._playlistIndex(action.options.playlistId)
				if (idx == null) return
				await instance._request('POST', `/playlists/${idx}/select`)
			},
		},
		playlist_action: {
			name: '🎶 Playlist: Play or Focus',
			options: [
				{
					type: 'dropdown',
					id: 'playlistId',
					label: 'Playlist',
					choices: plChoices,
					default: defaultPlId,
				},
				{
					type: 'dropdown',
					id: 'action',
					label: 'Action',
					choices: [
						{ id: 'play',   label: '▶ Play from beginning' },
						{ id: 'select', label: '☑ Set focus (select tab)' },
					],
					default: 'play',
				},
			],
			callback: async (action) => {
				const idx = instance._playlistIndex(action.options.playlistId)
				if (idx == null) return
				if (action.options.action === 'play') {
					await instance._request('POST', `/playlists/${idx}/play`)
				} else {
					await instance._request('POST', `/playlists/${idx}/select`)
				}
			},
		},

		// ══════════════════════════════════════════
		//  PLAYLIST TRACK NAVIGATION
		// ══════════════════════════════════════════

		playlist_track_next: {
			name: '⏭ Playlist: Next Track (in playlist)',
			options: [
				{ type: 'dropdown', id: 'playlistId', label: 'Playlist', choices: plChoices, default: defaultPlId },
			],
			callback: async (action) => {
				const aimpId = action.options.playlistId
				const plIdx = instance._playlistIndex(aimpId)
				if (plIdx == null) return
				await instance._ensureTracksLoaded(aimpId)
				const tracks = instance.tracksCache[String(aimpId)]
				if (!tracks || tracks.length === 0) return
				const currentTrackId = String(instance.state.playingPlaylistId) === String(aimpId)
					? instance.state.playingTrackId
					: instance.state.focusTrackId
				const currentIdx = tracks.findIndex(t => t.id === currentTrackId)
				const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % tracks.length : 0
				const trackApiIdx = instance._trackIndex(aimpId, tracks[nextIdx].id)
				if (trackApiIdx == null) return
				await instance._request('POST', `/playlists/${plIdx}/tracks/${trackApiIdx}/play`)
			},
		},
		playlist_track_prev: {
			name: '⏮ Playlist: Previous Track (in playlist)',
			options: [
				{ type: 'dropdown', id: 'playlistId', label: 'Playlist', choices: plChoices, default: defaultPlId },
			],
			callback: async (action) => {
				const aimpId = action.options.playlistId
				const plIdx = instance._playlistIndex(aimpId)
				if (plIdx == null) return
				await instance._ensureTracksLoaded(aimpId)
				const tracks = instance.tracksCache[String(aimpId)]
				if (!tracks || tracks.length === 0) return
				const currentTrackId = String(instance.state.playingPlaylistId) === String(aimpId)
					? instance.state.playingTrackId
					: instance.state.focusTrackId
				const currentIdx = tracks.findIndex(t => t.id === currentTrackId)
				const prevIdx = currentIdx > 0 ? currentIdx - 1 : tracks.length - 1
				const trackApiIdx = instance._trackIndex(aimpId, tracks[prevIdx].id)
				if (trackApiIdx == null) return
				await instance._request('POST', `/playlists/${plIdx}/tracks/${trackApiIdx}/play`)
			},
		},

		// ══════════════════════════════════════════
		//  TRACK ACTIONS
		// ══════════════════════════════════════════

		track_action: {
			name: '🎵 Track: Play or Focus (enter track ID)',
			options: [
				{ type: 'dropdown', id: 'playlistId', label: 'Playlist', choices: plChoices, default: defaultPlId },
				{ type: 'number', id: 'trackId', label: 'Track ID', default: 0, min: 0, max: 99999 },
				{
					type: 'dropdown',
					id: 'action',
					label: 'Action',
					choices: [
						{ id: 'play',   label: '▶ Play track' },
						{ id: 'select', label: '☑ Set focus (select)' },
					],
					default: 'play',
				},
			],
			callback: async (action) => {
				const { playlistId, trackId, action: act } = action.options
				const idx = instance._playlistIndex(playlistId)
				if (idx == null) return
				if (act === 'play') {
					await instance._request('POST', `/playlists/${idx}/tracks/${trackId}/play`)
				} else {
					await instance._request('POST', `/playlists/${idx}/tracks/${trackId}/select`)
				}
			},
		},

		track_action_browse: {
			name: '🎵 Track: Play or Focus (browse list)',
			options: (() => {
				const activePlId = instance._browseActivePlaylist || defaultPlId
				const trackChoices = instance._trackChoicesFor(activePlId)
				return [
					{
						type: 'dropdown',
						id: 'playlistId',
						label: 'Playlist',
						choices: plChoices,
						default: defaultPlId,
					},
					{
						type: 'dropdown',
						id: 'trackId',
						label: 'Track',
						choices: trackChoices,
						default: trackChoices[0]?.id ?? '',
						allowCustom: true,
						minChoicesForSearch: 5,
					},
					{
						type: 'dropdown',
						id: 'action',
						label: 'Action',
						choices: [
							{ id: 'play',   label: '▶ Play track' },
							{ id: 'select', label: '☑ Set focus (select)' },
						],
						default: 'play',
					},
				]
			})(),
			optionsToMonitorForSubscribe: ['playlistId'],
			subscribe: async (action) => {
				const plId = action.options.playlistId
				if (!plId) return
				instance._browseActivePlaylist = plId
				await instance._ensureTracksLoaded(plId)
				instance.setActionDefinitions(buildActions(instance))
			},
			callback: async (action) => {
				const { playlistId, trackId, action: act } = action.options
				if (!playlistId) {
					instance.log('warn', 'track_action_browse: playlistId is empty')
					return
				}
				const plIdx = instance._playlistIndex(playlistId)
				if (plIdx == null) {
					instance.log('warn', `track_action_browse: unknown playlist ${playlistId}`)
					return
				}
				let filePath = trackId
				if (!filePath || filePath === '__loading__') {
					const tracks = instance._trackChoicesFor(playlistId)
					filePath = tracks[0]?.id
				}
				if (!filePath || filePath === '__loading__') {
					instance.log('warn', 'track_action_browse: no track selected')
					return
				}
				const trackApiIdx = instance._trackIndex(playlistId, filePath)
				if (trackApiIdx == null) {
					instance.log('warn', `track_action_browse: cannot resolve track index for "${filePath}"`)
					return
				}
				instance.log('debug', `track_action_browse: playlist=${playlistId} (plIdx=${plIdx}), track=${trackApiIdx}, action=${act}`)
				if (act === 'play') {
					await instance._request('POST', `/playlists/${plIdx}/tracks/${trackApiIdx}/play`)
				} else {
					await instance._request('POST', `/playlists/${plIdx}/tracks/${trackApiIdx}/select`)
				}
			},
		},
	}
}