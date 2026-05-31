// ─────────────────────────────────────────────
//  Presets
// ─────────────────────────────────────────────

import { combineRgb } from '@companion-module/base'

export function updatePresets(instance) {
	const presets = {}
	const playlists = instance.playlistChoices || []

	presets['play_pause'] = {
		type: 'simple',
		name: 'Play/Pause',
		style: {
			text: '⏯', size: '40',
			color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 0, 0),
		},
		steps: [{ down: [{ actionId: 'play_pause', options: {} }], up: [] }],
		feedbacks: [
			{ feedbackId: 'is_playing', options: {}, style: { text: '⏸', bgcolor: combineRgb(0, 128, 0) } },
			{ feedbackId: 'is_paused',  options: {}, style: { text: '►', bgcolor: combineRgb(128, 128, 0) } },
		],
	}

	presets['stop'] = {
		type: 'simple',
		name: 'Stop',
		style: {
			text: '⬛', size: '40',
			color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 0, 0),
		},
		steps: [{ down: [{ actionId: 'stop', options: {} }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'is_stopped', options: {},
				style: { text: '⬛', size: '40', color: combineRgb(255, 0, 0), bgcolor: combineRgb(0, 0, 0) },
			},
			{ type: 'internal', feedbackId: 'flash', options: { color: combineRgb(255, 0, 0), bgcolor: combineRgb(0, 0, 0) } },
		],
	}

	presets['prev_track'] = {
		type: 'simple',
		name: 'Previous Track',
		style: { text: '⏮', size: '40', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 0, 0) },
		steps: [{ down: [{ actionId: 'prev', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['next_track'] = {
		type: 'simple',
		name: 'Next Track',
		style: { text: '⏭', size: '40', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 0, 0) },
		steps: [{ down: [{ actionId: 'next', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['volume_up'] = {
		type: 'simple',
		name: 'Volume Up',
		style: { text: 'VOL\n+', size: '18', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 100, 150) },
		steps: [{ down: [{ actionId: 'volume_up', options: { step: 20 } }], up: [] }],
		feedbacks: [],
	}

	presets['volume_down'] = {
		type: 'simple',
		name: 'Volume Down',
		style: { text: 'VOL\n–', size: '18', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 100, 150) },
		steps: [{ down: [{ actionId: 'volume_down', options: { step: 20 } }], up: [] }],
		feedbacks: [],
	}

	presets['mute_toggle'] = {
		type: 'simple',
		name: 'Mute Toggle',
		style: { text: 'MUTE', size: '18', color: combineRgb(255, 0, 0), bgcolor: combineRgb(255, 255, 255) },
		steps: [{ down: [{ actionId: 'mute_toggle', options: {} }], up: [] }],
		feedbacks: [
			{ feedbackId: 'is_muted', options: {}, style: { text: 'MUTE', color: combineRgb(0, 0, 0), bgcolor: combineRgb(255, 0, 0) } },
			{ type: 'internal', feedbackId: 'flash', options: { color: combineRgb(0, 0, 0), bgcolor: combineRgb(255, 0, 0) } },
		],
	}

	presets['shuffle_toggle'] = {
		type: 'simple',
		name: 'Shuffle Toggle',
		style: { text: '⤭\nSHUFFLE', size: '14', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 0, 0) },
		steps: [{ down: [{ actionId: 'shuffle_toggle', options: {} }], up: [] }],
		feedbacks: [
			{ feedbackId: 'is_shuffled', options: {}, style: { text: '⤭\nSHUFFLE', color: combineRgb(255, 140, 0), bgcolor: combineRgb(40, 40, 40) } },
		],
	}

	presets['repeat_toggle'] = {
		type: 'simple',
		name: 'Repeat Toggle',
		style: { text: '⭮\nREPEAT', size: '14', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 0, 0) },
		steps: [{ down: [{ actionId: 'repeat_toggle', options: {} }], up: [] }],
		feedbacks: [
			{ feedbackId: 'is_repeat', options: {}, style: { text: '⭮\nREPEAT', color: combineRgb(255, 140, 0), bgcolor: combineRgb(40, 40, 40) } },
		],
	}

	presets['auto_jump_toggle'] = {
		type: 'simple',
		name: 'AUTO NEXT',
		style: { text: 'AUTO NEXT\n⛔', size: '14', color: combineRgb(255, 0, 0), bgcolor: combineRgb(0, 0, 0) },
		steps: [{ down: [{ actionId: 'auto_jump_toggle', options: {} }], up: [] }],
		feedbacks: [
			{ feedbackId: 'is_auto_jump', options: {}, style: { text: 'AUTO\nNEXT', color: combineRgb(0, 255, 0), bgcolor: combineRgb(0, 0, 0) } },
			{ type: 'internal', feedbackId: 'flash', options: { color: combineRgb(255, 0, 0), bgcolor: combineRgb(0, 0, 0) } },
		],
	}

	presets['volume_display'] = {
		type: 'simple',
		name: 'Volume Display',
		style: { text: '$(aimp:volume_pct)%', size: '24', color: combineRgb(255, 255, 255), bgcolor: combineRgb(40, 40, 40) },
		steps: [],
		feedbacks: [
			{
				type: 'internal', feedbackId: 'compare',
				options: { variable: 'aimp:volume_pct', operation: 'eq', value: 0 },
				style: { color: combineRgb(255, 0, 0), bgcolor: combineRgb(20, 0, 0) },
			},
		],
	}

	presets['track_info'] = {
		type: 'simple',
		name: 'Track Info',
		style: {
			text: 'Play NOW:\n$(aimp:playing_track_artist)\n$(aimp:playing_track_title)',
			size: '10', color: combineRgb(255, 255, 255), bgcolor: combineRgb(20, 20, 20),
		},
		steps: [],
		feedbacks: [
			{ feedbackId: 'is_stopped', options: {}, style: { color: combineRgb(255, 0, 0) } },
		],
	}

	presets['next_track_info'] = {
		type: 'simple',
		name: 'Next Track Info',
		style: {
			text: 'Play NEXT:\n$(aimp:next_track_artist)\n$(aimp:next_track_title)',
			size: '10', color: combineRgb(255, 255, 255), bgcolor: combineRgb(20, 20, 20),
		},
		steps: [],
		feedbacks: [],
	}

	presets['progress_display'] = {
		type: 'simple',
		name: 'Progress Display',
		style: {
			text: '$(aimp:position_fmt) | $(aimp:remaining_fmt)\n$(aimp:duration_fmt)',
			size: '12', color: combineRgb(200, 200, 200), bgcolor: combineRgb(20, 20, 20),
		},
		steps: [],
		feedbacks: [],
	}

	presets['focus_playlist_next'] = {
		type: 'simple',
		name: 'Focus: Next Playlist (show name)',
		style: { text: 'Focus:\n NEXT PL', size: '12', color: combineRgb(255, 255, 255), bgcolor: combineRgb(51, 25, 0) },
		steps: [{ down: [{ actionId: 'focus_playlist_next', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['focus_playlist_prev'] = {
		type: 'simple',
		name: 'Focus: Previous Playlist',
		style: { text: 'Focus:\nPREV PL', size: '12', color: combineRgb(255, 255, 255), bgcolor: combineRgb(51, 25, 0) },
		steps: [{ down: [{ actionId: 'focus_playlist_prev', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['focus_track_next'] = {
		type: 'simple',
		name: 'Focus: Next Track',
		style: { text: 'Focus:\nNEXT TR', size: '12', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 30, 0) },
		steps: [{ down: [{ actionId: 'focus_track_next', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['focus_track_prev'] = {
		type: 'simple',
		name: 'Focus: Previous Track',
		style: { text: 'Focus:\nPREV TR', size: '12', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 30, 0) },
		steps: [{ down: [{ actionId: 'focus_track_prev', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['focus_play'] = {
		type: 'simple',
		name: 'Focus: PLAY',
		style: { text: '⏎', size: '44', color: combineRgb(255, 140, 0), bgcolor: combineRgb(40, 40, 40) },
		steps: [{ down: [{ actionId: 'focus_play', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['focus_track_info'] = {
		type: 'simple',
		name: 'Focus Track Info',
		style: {
			text: 'Focus TR:\n$(aimp-remote:focus_track_artist)\n$(aimp-remote:focus_track_title)',
			size: '12', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 70, 0),
		},
		steps: [],
		feedbacks: [],
	}

	presets['focus_playlist_info'] = {
		type: 'simple',
		name: 'Focus Playlist Info',
		style: {
			text: 'Focus PL:\n$(aimp-remote:focus_playlist_name)',
			size: '12', color: combineRgb(255, 255, 255), bgcolor: combineRgb(102, 51, 0),
		},
		steps: [],
		feedbacks: [],
	}

	// Первые 4 плейлиста
	for (let i = 0; i < Math.min(4, playlists.length); i++) {
		const pl = playlists[i]
		presets[`playlist_${i}`] = {
			type: 'simple',
			name: `Play ${pl.label}`,
			style: { text: pl.label, size: 'auto', color: combineRgb(255, 255, 255), bgcolor: combineRgb(100, 50, 150) },
			steps: [{ down: [{ actionId: 'playlist_play', options: { playlistId: pl.id } }], up: [] }],
			feedbacks: [
				{ feedbackId: 'playing_playlist_is', options: { playlistId: pl.id }, style: { bgcolor: combineRgb(0, 150, 0) } },
			],
		}
	}

	// Track Browse
	const firstPl = playlists[0]
	const firstPlTracks = firstPl ? (instance.tracksCache[String(firstPl.id)] || []) : []
	const firstTrackId = firstPlTracks.length > 0 ? firstPlTracks[0].id : ''
	presets['track_browse'] = {
		type: 'simple',
		name: 'Track: Browse & Play',
		style: { text: 'TRACK', size: '18', color: combineRgb(255, 255, 255), bgcolor: combineRgb(80, 40, 80) },
		steps: [
			{
				down: [{
					actionId: 'track_action_browse',
					options: { playlistId: firstPl?.id ?? '', trackId: firstTrackId, action: 'play' },
				}],
				up: [],
			},
		],
		feedbacks: [],
	}

	const structure = [
		{ id: 'playback',       name: 'Playback',                  definitions: ['play_pause', 'stop', 'prev_track', 'next_track'] },
		{ id: 'volume',         name: 'Volume',                    definitions: ['volume_up', 'volume_down', 'mute_toggle', 'volume_display'] },
		{ id: 'shuffle_repeat', name: 'Shuffle / Repeat / Auto Jump', definitions: ['shuffle_toggle', 'repeat_toggle', 'auto_jump_toggle'] },
		{ id: 'info',           name: 'Info',                      definitions: ['track_info', 'next_track_info', 'progress_display'] },
		{ id: 'focus',          name: 'Focus',                     definitions: ['focus_playlist_next', 'focus_playlist_prev', 'focus_track_next', 'focus_track_prev', 'focus_play', 'focus_playlist_info', 'focus_track_info'] },
		{ id: 'tracks',         name: 'Play this track',           definitions: ['track_browse'] },
		{ id: 'playlists',      name: 'Playlists',                 definitions: playlists.slice(0, 4).map((_, i) => `playlist_${i}`) },
	]

	instance.setPresetDefinitions(structure, presets)
}