# AIMP Remote Control

[English](#english) | [Русский](#русский)

---

## English

This module allows you to control the **AIMP music player** remotely via HTTP from Bitfocus Companion.

### Description

This module expands the player's capabilities for live events. You can assign buttons to play a specific track or playlist, navigate between tracks and playlists, and display track and playlist information on your Companion surface.

Command-based navigation mirrors the player's graphical interface — just as navigation actions on a PC are reflected in feedback showing the selected track and playlist.

There is also a toggle for **Auto Jump** (automatic playback of the next track), which lets you pause automatic progression — useful when transitioning from background music to a specific cued track for the main event.

Working with this module allows you to partially replicate QLab-style cueing functionality for amateur use, even on Windows.

### Setup

To use the module, you need to install the **AIMP HTTP Remote Control** plugin in your AIMP player. The plugin works with player version **5.40.2716 and later**.

Download it from the [AIMP add-ons catalog](https://www.aimp.ru/) or directly from the [GitHub repository](https://github.com/slv-tech/AIMP-HTTP-Remote-Control).

### Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| Host | `127.0.0.1` | IP address of the machine running AIMP |
| Port | `19122` | HTTP port (must match plugin settings) |
| Poll interval | `80 ms` | How often Companion reads player state. 80 ms is recommended |

> The port and network interface can also be changed inside AIMP: **Settings → Plugins → AIMP HTTP Remote Control**

### Actions

- **Play / Pause / Stop** — basic playback controls
- **Next / Previous Track** — skip tracks
- **Volume Up / Down / Set** — adjust volume by step or to an absolute value
- **Mute Toggle** — toggle mute on/off
- **Shuffle / Repeat / Auto Jump Toggle** — toggle playback modes
- **Seek** — jump to a position in seconds or by percentage
- **Playlist: Play / Select** — start a playlist or bring it into focus
- **Playlist: Next/Prev Track** — navigate tracks within a specific playlist
- **Track: Play or Focus (browse list)** — pick a track from a dropdown and play or focus it
- **Focus navigation** — move focus between playlists and tracks in the AIMP UI

### Feedbacks

- **Is Playing / Paused / Stopped** — reflects current playback state
- **Is Muted** — mute state indicator
- **Volume ≥ X%** — lights up when volume is at or above a threshold
- **Playing Playlist / Track matches** — highlights buttons tied to the currently playing playlist or track
- **Focus Playlist / Track matches** — highlights buttons tied to the currently focused item
- **Is Shuffled / Repeat On / Auto Jump On** — playback mode indicators

### Variables

| Variable | Description |
|----------|-------------|
| `$(aimp:player_state)` | `playing`, `paused`, or `stopped` |
| `$(aimp:volume_pct)` | Volume 0–100 |
| `$(aimp:muted)` | `true` / `false` |
| `$(aimp:shuffle)` | `true` / `false` |
| `$(aimp:repeat)` | `true` / `false` |
| `$(aimp:auto_jump)` | `true` / `false` |
| `$(aimp:position_fmt)` | Current position as `mm:ss` |
| `$(aimp:duration_fmt)` | Track duration as `mm:ss` |
| `$(aimp:remaining_fmt)` | Remaining time as `mm:ss` |
| `$(aimp:progress_pct)` | Playback progress 0–100% |
| `$(aimp:playing_track_title)` | Title of the currently playing track |
| `$(aimp:playing_track_artist)` | Artist of the currently playing track |
| `$(aimp:playing_playlist_name)` | Name of the currently playing playlist |
| `$(aimp:next_track_title)` | Title of the next track |
| `$(aimp:focus_track_title)` | Title of the focused track |
| `$(aimp:focus_playlist_name)` | Name of the focused playlist |

---

## Русский

Модуль для удалённого управления плеером **AIMP** через HTTP из Bitfocus Companion.

### Описание

Модуль расширяет возможности плеера для работы на мероприятиях. Можно назначить кнопки для воспроизведения конкретного трека или плейлиста, навигации между треками и плейлистами, а также отображения информации о треке и плейлисте на поверхности Companion.

Навигация командами дублирует графический интерфейс плеера — так же, как навигационные действия на ПК дублируются в фидбэке с информацией о выбранном треке и плейлисте.

Есть переключатель **Auto Jump** (автоматическое воспроизведение следующего трека), позволяющий отключить автоматический переход — удобно при смене фоновой музыки на основное мероприятие с воспроизведением конкретных треков.

Работа с модулем позволяет частично воспроизвести функциональность QLab для любительского использования, в том числе на Windows.

### Настройка

Для работы модуля необходимо установить плагин **AIMP HTTP Remote Control** в сам плеер. Плагин работает с версией плеера **5.40.2716 и выше**.

Скачать можно из [каталога дополнений AIMP](https://www.aimp.ru/) или напрямую из [репозитория на GitHub](https://github.com/slv-tech/AIMP-HTTP-Remote-Control).

### Конфигурация

| Параметр | По умолчанию | Описание |
|----------|-------------|----------|
| Host | `127.0.0.1` | IP-адрес устройства, на котором запущен AIMP |
| Port | `19122` | HTTP-порт (должен совпадать с настройками плагина) |
| Poll interval | `80 мс` | Как часто Companion опрашивает состояние плеера. Рекомендуется 80 мс |

> Порт и сетевой интерфейс можно изменить в самом AIMP: **Настройки → Плагины → AIMP HTTP Remote Control**

### Действия (Actions)

- **Play / Pause / Stop** — базовое управление воспроизведением
- **Next / Previous Track** — переключение треков
- **Volume Up / Down / Set** — регулировка громкости по шагу или до абсолютного значения
- **Mute Toggle** — переключение отключения звука
- **Shuffle / Repeat / Auto Jump Toggle** — переключение режимов воспроизведения
- **Seek** — перемотка на позицию в секундах или процентах
- **Playlist: Play / Select** — запуск плейлиста или перевод в фокус
- **Playlist: Next/Prev Track** — навигация по трекам внутри конкретного плейлиста
- **Track: Play or Focus (browse list)** — выбор трека из списка и его воспроизведение или фокусировка
- **Focus navigation** — перемещение фокуса между плейлистами и треками в интерфейсе AIMP

### Фидбэки (Feedbacks)

- **Is Playing / Paused / Stopped** — текущее состояние воспроизведения
- **Is Muted** — индикатор отключения звука
- **Volume ≥ X%** — срабатывает, когда громкость достигает заданного порога
- **Playing Playlist / Track matches** — подсвечивает кнопки, привязанные к текущему плейлисту или треку
- **Focus Playlist / Track matches** — подсвечивает кнопки, привязанные к элементу в фокусе
- **Is Shuffled / Repeat On / Auto Jump On** — индикаторы режимов воспроизведения

### Переменные (Variables)

| Переменная | Описание |
|------------|----------|
| `$(aimp:player_state)` | `playing`, `paused` или `stopped` |
| `$(aimp:volume_pct)` | Громкость 0–100 |
| `$(aimp:muted)` | `true` / `false` |
| `$(aimp:shuffle)` | `true` / `false` |
| `$(aimp:repeat)` | `true` / `false` |
| `$(aimp:auto_jump)` | `true` / `false` |
| `$(aimp:position_fmt)` | Текущая позиция в формате `мм:сс` |
| `$(aimp:duration_fmt)` | Длительность трека в формате `мм:сс` |
| `$(aimp:remaining_fmt)` | Оставшееся время в формате `мм:сс` |
| `$(aimp:progress_pct)` | Прогресс воспроизведения 0–100% |
| `$(aimp:playing_track_title)` | Название текущего трека |
| `$(aimp:playing_track_artist)` | Исполнитель текущего трека |
| `$(aimp:playing_playlist_name)` | Название текущего плейлиста |
| `$(aimp:next_track_title)` | Название следующего трека |
| `$(aimp:focus_track_title)` | Название трека в фокусе |
| `$(aimp:focus_playlist_name)` | Название плейлиста в фокусе |