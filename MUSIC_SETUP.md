# 🎵 How to Add Your Custom Song

## Quick Setup - 3 Easy Options:

### Option 1: Add Your MP3 File (Easiest)
1. **Copy your MP3 file** to this project folder (`jaime-birthday-3d`)
2. **Rename it** to `birthday-song.mp3`
3. That's it! The animation will automatically play your song

### Option 2: Use a Different Filename
1. **Copy your MP3 file** to this project folder
2. **Edit `index.html`** (line 62)
3. **Change** `src="birthday-song.mp3"` to `src="your-song-name.mp3"`
4. Save and refresh the page

### Option 3: Use an Online URL
1. **Upload your song** to any file hosting service (Google Drive, Dropbox, etc.)
2. **Get the direct MP3 link** (must end in .mp3)
3. **Edit `index.html`** (line 62)
4. **Replace** `src="birthday-song.mp3"` with `src="https://your-url-here.mp3"`
5. Save and refresh the page

## Supported Audio Formats:
- **MP3** (recommended) - Works everywhere
- **WAV** - Larger files but high quality
- **OGG** - Good compression, not all browsers

## Tips:
- 🎵 **Best file size**: Keep under 10MB for quick loading
- 🔊 **Volume**: The song will play at normal volume
- 🔁 **Loop**: The song will repeat automatically
- ⏸️ **Control**: Use the Music button to play/pause

## Troubleshooting:
- **Song not playing?** Check the filename matches exactly (case-sensitive)
- **No sound?** Some browsers block autoplay - click the Music button
- **Wrong song?** Clear browser cache (Ctrl+F5)

## Example Services for Hosting:
- **GitHub**: Upload to your repo and use raw.githubusercontent.com link
- **Google Drive**: Use direct download link
- **Dropbox**: Replace `?dl=0` with `?raw=1` in the URL
- **SoundCloud**: Use embedded player URL

---

**Need help?** The animation will fall back to default music if your file isn't found!
