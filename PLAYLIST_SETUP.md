# 🎵 Playlist Setup - Add Your 3 Songs!

## Quick Setup Guide

### Step 1: Add Your Music Files
Place your **3 MP3 files** in the project folder with these exact names:
- `song1.mp3` - First birthday song
- `song2.mp3` - Second birthday song  
- `song3.mp3` - Third birthday song

### Step 2: Customize Song Information (Optional)
Edit `playlist.js` (lines 7-31) to customize the titles and artists:

```javascript
const songs = [
    {
        id: 1,
        title: "Your Song Title Here",  // Change this!
        artist: "Artist Name",           // Change this!
        file: "song1.mp3",
        color: "#ff6b6b"  // Red theme
    },
    {
        id: 2,
        title: "Second Song Title",      // Change this!
        artist: "Artist Name",            // Change this!
        file: "song2.mp3",
        color: "#4ecdc4"  // Teal theme
    },
    {
        id: 3,
        title: "Third Song Title",        // Change this!
        artist: "Artist Name",            // Change this!
        file: "song3.mp3",
        color: "#ffe66d"  // Yellow theme
    }
];
```

## 🎮 How Jaime Can Use the Playlist

### With Mouse/Touch:
1. Click **📻 Playlist** button to open the song menu
2. Click the **▶ Play** button next to any song
3. Use control buttons:
   - **⏮ Previous** - Go to previous song
   - **Next ⏭** - Go to next song
   - **🔀 Shuffle** - Play random song

### With Keyboard:
- **P** - Open/close playlist
- **→** Arrow Right - Next song
- **←** Arrow Left - Previous song
- **Space** - Fireworks (still works!)

## 🎨 Features

### For Each Song:
- **Custom title and artist** display
- **Unique background color** that changes with each song
- **Now Playing notification** shows when song starts
- **Auto-play next song** when current ends
- **Visual indicator** for currently playing song

### Visualizer Integration:
- Visualizer **automatically starts** when any song plays
- Each song gets the **same amazing visual effects**
- Background **color theme changes** per song
- All effects **sync to the music** in real-time

## 📁 File Structure
```
jaime-birthday-3d/
├── song1.mp3          ← Add your first song here
├── song2.mp3          ← Add your second song here
├── song3.mp3          ← Add your third song here
├── playlist.js        ← Customize song titles here
└── index.html         ← Main file to open
```

## 🎵 Supported Formats
- **MP3** (recommended) - Works everywhere
- **M4A/AAC** - Good quality, smaller files
- **WAV** - Highest quality but large files
- **OGG** - Good compression

## 💡 Tips
- Keep songs **under 10MB** each for fast loading
- Songs will **loop automatically** after all 3 play
- **Fallback music** plays if your files aren't found
- The **visualizer adapts** to each song's frequencies

## 🚨 Troubleshooting
- **Songs not playing?** Check filenames are exactly `song1.mp3`, `song2.mp3`, `song3.mp3`
- **Wrong order?** Songs play in numerical order (1, 2, 3)
- **Visualizer not working?** It auto-starts 0.5 seconds after music begins

## 🎉 Ready to Party!
Once you add your 3 MP3 files, Jaime can:
1. Choose his favorite song from the playlist
2. Watch everything dance to the music
3. Switch songs anytime he wants
4. Enjoy the birthday celebration with his personalized soundtrack!

---

**Have fun, and Happy Birthday Jaime! 🎂🎈🎊**
