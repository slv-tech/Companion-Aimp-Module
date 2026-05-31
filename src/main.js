import { InstanceBase, InstanceStatus } from '@companion-module/base'

import { buildInitialState }  from './state.js'
import { getConfigFields }    from './config.js'
import { registerVariables, updateVariables } from './variables.js'
import { registerFeedbacks, allFeedbackIds } from './feedbacks.js'
import { buildActions }       from './actions.js'
import { updatePresets }      from './presets.js'

const BASE_PATH = '/api'

export default class AimpRemote extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.state = buildInitialState()

		// Choices для dropdown-ов: id = aimp_id (GUID), label = имя
		this.playlistChoices = []
		// Маппинг aimp_id → { index, name, aimpId } для конвертации при API-вызовах
		this.playlistsMap = {}
		// Кэш треков: ключ = aimp_id плейлиста, id трека = file_path
		this.tracksCache = {}   // { [aimpId]: [{id: file_path, label}] }
		// Маппинг file_path → текущий порядковый index трека для API-вызовов
		this.tracksMap = {}     // { [aimpId]: {[file_path]: index} }

		this._pollTimer        = null
		this._connectionOk     = false
		this._bootstrapping    = false
		this._pollCount        = 0
		this._tracksRefreshing = false
		this._browseActivePlaylist = null
	}

	// ── Config ───────────────────────────────────

	getConfigFields() {
		return getConfigFields()
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)
		registerVariables(this)
		registerFeedbacks(this)
		this._bootstrap()
	}

	async configUpdated(config) {
		this.config = config
		this._stopPolling()
		this.tracksCache     = {}
		this.tracksMap       = {}
		this.playlistChoices = []
		this.playlistsMap    = {}
		this._bootstrap()
	}

	async destroy() {
		this._stopPolling()
	}

	// ── Bootstrap ────────────────────────────────

	async _bootstrap() {
		if (this._bootstrapping) return
		this._bootstrapping = true
		try {
			const ok = await this._loadPlaylists()
			if (ok) {
				this.updateStatus(InstanceStatus.Ok)
				this._connectionOk = true
				await Promise.all(
					this.playlistChoices.map(pl => this._ensureTracksLoaded(pl.id))
				)
			} else {
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this._connectionOk = false
			}
			this.setActionDefinitions(buildActions(this))
			updatePresets(this)
			this._poll()
			this._startPolling()
		} catch (err) {
			this.log('error', `Bootstrap error: ${err.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure)
			this._connectionOk = false
			this._startPolling()
		} finally {
			this._bootstrapping = false
		}
	}

	// ── HTTP ─────────────────────────────────────

	get _baseURL() {
		return `http://${this.config?.host ?? '127.0.0.1'}:${this.config?.port ?? 19122}${BASE_PATH}`
	}

	async _request(method, path, queryParams = null, body = null) {
		let url = `${this._baseURL}${path}`
		if (queryParams) url += `?${new URLSearchParams(queryParams)}`

		this.log('debug', `→ ${method} ${url}${body ? ' ' + JSON.stringify(body) : ''}`)

		const opts = { method, headers: {} }
		if (body) {
			opts.headers['Content-Type'] = 'application/json'
			opts.body = JSON.stringify(body)
		}

		try {
			const ac  = new AbortController()
			const tid = setTimeout(() => ac.abort(), 5000)
			const res = await fetch(url, { ...opts, signal: ac.signal })
			clearTimeout(tid)

			if (!res.ok) {
				this.log('warn', `HTTP ${res.status} on ${method} ${path}`)
				return null
			}
			const ct = res.headers.get('content-type') || ''
			if (ct.includes('application/json')) return await res.json()
			const text = await res.text()
			try { return JSON.parse(text) } catch { return text || null }
		} catch (err) {
			if (err.name !== 'AbortError') this.log('warn', `Request error: ${err.message}`)
			return null
		}
	}

	// ── Playlist ID helpers ─────────────────────

	/** aimp_id → текущий порядковый index для API-запросов */
	_playlistIndex(aimpId) {
		return this.playlistsMap[aimpId]?.index
	}

	/** aimp_id → имя плейлиста */
	_playlistNameById(aimpId) {
		return this.playlistsMap[aimpId]?.name ?? String(aimpId ?? '')
	}

	/** file_path трека → текущий порядковый index для API-запросов */
	_trackIndex(aimpPlaylistId, filePath) {
		const map = this.tracksMap[String(aimpPlaylistId)]
		if (!map) return undefined
		return map[filePath]
	}

	/** Обновляет playlistChoices и playlistsMap из сырого массива API */
	_updatePlaylistsFromApi(list) {
		this.playlistChoices = list.map(pl => ({
			id: String(pl.aimp_id),
			label: pl.name,
		}))
		this.playlistsMap = {}
		for (const pl of list) {
			this.playlistsMap[String(pl.aimp_id)] = {
				index: pl.id,
				name: pl.name,
				aimpId: String(pl.aimp_id),
			}
		}
	}

	// ── Data loading ─────────────────────────────

	async _loadPlaylists() {
		const data = await this._request('GET', '/playlists')
		const list = Array.isArray(data) ? data : data?.playlists
		if (!Array.isArray(list)) return false
		this._updatePlaylistsFromApi(list)
		this.log('info', `Loaded ${this.playlistChoices.length} playlists`)
		return true
	}

	async _ensureTracksLoaded(aimpId) {
		const key = String(aimpId)
		if (this.tracksCache[key]) return
		await this._loadTracks(aimpId)
	}

	async _loadTracks(aimpId) {
		const key = String(aimpId)
		const idx = this._playlistIndex(key)
		if (idx == null) {
			this.log('warn', `_loadTracks: unknown playlist aimp_id=${key}`)
			return false
		}
		const data = await this._request('GET', `/playlists/${idx}/tracks`, { limit: 500, offset: 0 })
		const list = Array.isArray(data) ? data : data?.tracks
		if (!Array.isArray(list)) {
			const hadCache = !!this.tracksCache[key]
			this.tracksCache[key] = [{ id: '0', label: '⚠ Failed to load' }]
			this.tracksMap[key]   = {}
			return hadCache
		}

		const newTracks = list.map((t, i) => ({
			id: t.file_path || String(t.id ?? i),
			label: `${i + 1}. ${[t.artist, t.title].filter(Boolean).join(' – ') || t.file_path || '?'}`,
		}))

		const newMap = {}
		for (const t of list) {
			const fp = t.file_path || String(t.id)
			newMap[fp] = t.id
		}

		const oldTracks = this.tracksCache[key]
		let changed = false
		if (!oldTracks || oldTracks.length !== newTracks.length) {
			changed = true
		} else {
			for (let i = 0; i < newTracks.length; i++) {
				if (newTracks[i].id !== oldTracks[i].id || newTracks[i].label !== oldTracks[i].label) {
					changed = true
					break
				}
			}
		}

		this.tracksMap[key] = newMap
		if (changed) {
			this.tracksCache[key] = newTracks
			this.log('info', `Tracks updated for playlist ${this._playlistNameById(key)}: ${newTracks.length} tracks`)
		}
		return changed
	}

	async _refreshAllTracks() {
		if (this._tracksRefreshing) return
		this._tracksRefreshing = true
		try {
			const playlists = this.playlistChoices
			if (playlists.length === 0) return
			const results = await Promise.all(playlists.map(pl => this._loadTracks(pl.id)))
			if (results.some(Boolean)) {
				this.setActionDefinitions(buildActions(this))
			}
		} catch (err) {
			this.log('warn', `Tracks refresh error: ${err.message}`)
		} finally {
			this._tracksRefreshing = false
		}
	}

	/** Возвращает choices треков для плейлиста (синхронно, использует кэш) */
	_trackChoicesFor(aimpId) {
		const cached = this.tracksCache[String(aimpId)]
		if (cached && cached.length > 0) return cached
		return [{ id: '__loading__', label: '(loading\u2026)' }]
	}

	// ── Polling ──────────────────────────────────

	_startPolling() {
		this._stopPolling()
		const interval = this.config?.pollInterval
		if (!interval) return
		this._pollTimer = setInterval(() => this._poll(), interval)
	}

	_stopPolling() {
		if (this._pollTimer) { clearInterval(this._pollTimer); this._pollTimer = null }
	}

	async _poll() {
		if (!this.config?.host) return
		try {
			await this._pollInner()
		} catch (err) {
			this.log('error', `Poll error: ${err.message}`)
			if (this._connectionOk) {
				this._connectionOk = false
				this.updateStatus(InstanceStatus.ConnectionFailure)
			}
		}
	}

	async _pollInner() {
		const [status, playlistsData] = await Promise.all([
			this._request('GET', '/player/status'),
			this._request('GET', '/playlists'),
		])

		if (!status) {
			if (this._connectionOk) {
				this._connectionOk = false
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this.tracksCache = {}
				this.tracksMap   = {}
				this.state._playlistAimpIds = ''
			}
			return
		}
		if (!this._connectionOk) {
			this._connectionOk = true
			this.updateStatus(InstanceStatus.Ok)
		}

		// Player state
		this.state.playerState = status.state    ?? this.state.playerState
		this.state.volume      = status.volume   !== undefined ? status.volume  : this.state.volume
		this.state.muted       = status.muted    !== undefined ? status.muted   : this.state.muted
		this.state.position    = status.position ?? this.state.position
		this.state.duration    = status.duration ?? this.state.duration

		this.state.shuffle  = status.shuffle   !== undefined ? !!status.shuffle   : this.state.shuffle
		this.state.repeat   = status.repeat    !== undefined ? !!status.repeat    : this.state.repeat
		this.state.autoJump = status.auto_jump !== undefined ? !!status.auto_jump : this.state.autoJump

		// Playing track
		const pp = status.playing_playlist
		const pt = status.playing_track
		this.state.playingPlaylistId   = pp != null ? String(pp.aimp_id ?? pp.id) : ''
		this.state.playingPlaylistName = pp != null ? (pp.name ?? '') : ''
		this.state.playingTrackId      = pt != null ? (pt.file_path || String(pt.id)) : ''
		this.state.playingTrackTitle   = this.state.playerState === 'stopped' ? 'STOPPED' : (pt?.title ?? '')
		this.state.playingTrackArtist  = this.state.playerState === 'stopped' ? '' : (pt?.artist ?? '')

		// Next track
		const nt = status.next_track
		this.state.nextTrackTitle  = this.state.playerState === 'stopped' ? 'STOPPED' : (nt?.title ?? '')
		this.state.nextTrackArtist = this.state.playerState === 'stopped' ? '' : (nt?.artist ?? '')

		// Focus state
		const fp = status.focus_playlist
		const ft = status.focus_track
		if (fp != null) {
			const newFocusPlId = String(fp.aimp_id ?? fp.id)
			if (newFocusPlId !== this.state.focusPlaylistId) {
				this.state.focusPlaylistId   = newFocusPlId
				this.state.focusPlaylistName = fp.name ?? ''
				if (newFocusPlId) {
					this._ensureTracksLoaded(newFocusPlId).then(() => {
						this.setActionDefinitions(buildActions(this))
						updateVariables(this)
						this.checkFeedbacks(...allFeedbackIds())
					}).catch((err) => {
						this.log('warn', `Failed to load tracks for playlist ${newFocusPlId}: ${err.message}`)
					})
				}
			} else {
				this.state.focusPlaylistName = fp.name ?? this.state.focusPlaylistName
			}
		}
		if (ft != null) {
			const ftId = ft.file_path || String(ft.id)
			this.state.focusTrackId     = ftId
			this.state.focusTrackTitle  = ft.title  ?? ''
			this.state.focusTrackArtist = ft.artist ?? ''
			this.state.focusTrackIndex  = this._trackIndexById(this.state.focusPlaylistId, ftId)
		}

		// Playlists
		const plList = Array.isArray(playlistsData) ? playlistsData : playlistsData?.playlists
		if (Array.isArray(plList)) {
			const newAimpIds = plList.map(p => String(p.aimp_id)).join(',')
			if (newAimpIds !== this.state._playlistAimpIds) {
				const oldAimpIds   = new Set(this.state._playlistAimpIds ? this.state._playlistAimpIds.split(',') : [])
				const newAimpIdSet = new Set(plList.map(p => String(p.aimp_id)))

				this.state._playlistAimpIds = newAimpIds
				this._updatePlaylistsFromApi(plList)

				for (const oldId of oldAimpIds) {
					if (!newAimpIdSet.has(oldId)) {
						delete this.tracksCache[oldId]
						delete this.tracksMap[oldId]
					}
				}

				registerFeedbacks(this)
				Promise.all(plList.map(p => this._ensureTracksLoaded(String(p.aimp_id))))
					.then(() => { this.setActionDefinitions(buildActions(this)) })
					.catch((err) => { this.log('warn', `Failed to preload tracks: ${err.message}`) })
			} else {
				this._updatePlaylistsFromApi(plList)
			}
		}

		updateVariables(this)
		this.checkFeedbacks(...allFeedbackIds())

		this._pollCount++
		if (this._pollCount % 5 === 0) {
			this._refreshAllTracks()
		}
	}

	/** Возвращает 0-based индекс трека в кэше по его API-id */
	_trackIndexById(aimpPlaylistId, trackId) {
		const tracks = this.tracksCache[String(aimpPlaylistId)]
		if (!tracks) return 0
		const idx = tracks.findIndex(t => t.id === String(trackId))
		return idx >= 0 ? idx : 0
	}
}