// ─────────────────────────────────────────────
//  Config fields
// ─────────────────────────────────────────────

export function getConfigFields() {
	return [
		{
			type: 'static-text',
			id: 'info',
			label: 'Information',
			width: 12,
			value:
				'Specify the AIMP Host and player port (the default is 19122). You can adjust the refresh time if needed; 80 ms is optimal. The port and interface can also be changed in the AIMP HTTP Remote Control plugin settings in the player itself.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'AIMP API Host',
			default: '127.0.0.1',
			width: 6,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port',
			default: 19122,
			min: 1,
			max: 65535,
			width: 3,
		},
		{
			type: 'number',
			id: 'pollInterval',
			label: 'Poll interval (ms, 0 = off)',
			default: 80,
			min: 0,
			max: 60000,
			width: 3,
		},
	]
}