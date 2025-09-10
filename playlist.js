// Playlist Manager
let currentSongIndex = 0;
let isPlaying = false;
let playlistOpen = false;

// Song configuration - customize these!
const songs = [
    {
        id: 1,
        title: "Happy Birthday Dude! 🎉",
        artist: "The Classic Jam",
        file: "song1.mp3",
        fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        color: "#ff6b6b"
    },
    {
        id: 2,
        title: "Happy B-Day Jaime! 🎂",
        artist: "Party Remix",
        file: "song2.mp3",
        fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        color: "#4ecdc4"
    },
    {
        id: 3,
        title: "Yo Jaime, It's Your Day! 🎈",
        artist: "Epic Birthday Mix",
        file: "song3.mp3",
        fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        color: "#ffe66d"
    }
];

// Initialize playlist
function initPlaylist() {
    // Update song titles and artists in the UI
    songs.forEach((song, index) => {
        const songItem = document.querySelector(`[data-song="${song.id}"]`);
        if (songItem) {
            songItem.querySelector('.song-title').textContent = song.title;
            songItem.querySelector('.song-artist').textContent = song.artist;
        }
    });
    
    // Set up the main audio element
    loadSong(0);
}

// Load a song into the main audio player
function loadSong(index) {
    const audio = document.getElementById('birthday-music');
    const song = songs[index];
    
    // Clear existing sources
    audio.innerHTML = '';
    
    // Add primary source
    const source1 = document.createElement('source');
    source1.src = song.file;
    source1.type = 'audio/mpeg';
    audio.appendChild(source1);
    
    // Add fallback source
    const source2 = document.createElement('source');
    source2.src = song.fallback;
    source2.type = 'audio/mpeg';
    audio.appendChild(source2);
    
    // Load the new sources
    audio.load();
    
    // Update UI
    updatePlaylistUI(index);
    
    // Update background color with animation
    gsap.to('body', {
        background: `linear-gradient(135deg, ${song.color} 0%, #764ba2 100%)`,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

// Play a specific song
function playSong(songId) {
    const index = songs.findIndex(s => s.id === songId);
    if (index === -1) return;
    
    currentSongIndex = index;
    loadSong(index);
    
    const audio = document.getElementById('birthday-music');
    audio.volume = 0.5;
    
    // Stop visualizer if active
    if (visualizerActive && typeof stopVisualizer !== 'undefined') {
        stopVisualizer();
        visualizerActive = false;
    }
    
    // Play the song
    audio.play().then(() => {
        isPlaying = true;
        musicPlaying = true;
        document.getElementById('music-toggle').textContent = '🔇 Mute';
        
        // Update play buttons
        updatePlayButtons();
        
        // Show now playing notification
        showNowPlaying(songs[index]);
        
        // Auto-enable visualizer after a short delay
        if (!visualizerActive && typeof initVisualizer !== 'undefined') {
            setTimeout(() => {
                if (typeof initVisualizer !== 'undefined') {
                    try {
                        initVisualizer();
                        document.getElementById('visualizer-toggle').textContent = '🎶 Visualizer ON';
                        document.getElementById('visualizer-controls').style.display = 'block';
                        visualizerActive = true;
                    } catch (e) {
                        console.log('Visualizer initialization failed:', e);
                    }
                }
            }, 500);
        }
    }).catch(e => {
        console.error('Failed to play song:', e);
        alert(`Could not load "${song.title}". Please add ${song.file} to the project folder.`);
    });
}

// Play next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(songs[currentSongIndex].id);
}

// Play previous song
function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(songs[currentSongIndex].id);
}

// Shuffle to random song
function shuffleSong() {
    const randomIndex = Math.floor(Math.random() * songs.length);
    currentSongIndex = randomIndex;
    playSong(songs[randomIndex].id);
}

// Update playlist UI
function updatePlaylistUI(activeIndex) {
    // Remove active class from all items
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current song
    const activeSong = document.querySelector(`[data-song="${songs[activeIndex].id}"]`);
    if (activeSong) {
        activeSong.classList.add('active');
    }
}

// Update play/pause buttons
function updatePlayButtons() {
    document.querySelectorAll('.play-btn').forEach((btn, index) => {
        if (index === currentSongIndex && isPlaying) {
            btn.textContent = '⏸';
            btn.classList.add('playing');
        } else {
            btn.textContent = '▶';
            btn.classList.remove('playing');
        }
    });
}

// Show now playing notification
function showNowPlaying(song) {
    // Remove existing notification if any
    const existing = document.querySelector('.now-playing');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'now-playing';
    notification.innerHTML = `
        <div class="now-playing-content">
            <span class="now-playing-icon">🎵</span>
            <div class="now-playing-info">
                <div class="now-playing-title">${song.title}</div>
                <div class="now-playing-artist">${song.artist}</div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Animate in
    gsap.from(notification, {
        x: -300,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        gsap.to(notification, {
            x: -300,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => notification.remove()
        });
    }, 3000);
}

// Set up playlist toggle
document.addEventListener('DOMContentLoaded', () => {
    // Initialize playlist
    initPlaylist();
    
    // Playlist toggle button
    const playlistToggle = document.getElementById('playlist-toggle');
    const playlistPanel = document.getElementById('playlist-panel');
    
    if (playlistToggle && playlistPanel) {
        playlistToggle.addEventListener('click', () => {
            playlistOpen = !playlistOpen;
            
            if (playlistOpen) {
                playlistPanel.style.display = 'block';
                gsap.from(playlistPanel, {
                    y: -20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(playlistPanel, {
                    y: -20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        playlistPanel.style.display = 'none';
                    }
                });
            }
        });
    }
    
    // Auto-play next song when current ends
    const audio = document.getElementById('birthday-music');
    audio.addEventListener('ended', () => {
        nextSong();
    });
    
    // Handle play button clicks
    document.querySelectorAll('.play-btn').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songItem = btn.closest('.song-item');
            const songId = parseInt(songItem.dataset.song);
            
            if (index === currentSongIndex && isPlaying) {
                // Pause if clicking on currently playing song
                audio.pause();
                isPlaying = false;
                musicPlaying = false;
                document.getElementById('music-toggle').textContent = '🎵 Music';
                btn.textContent = '▶';
                btn.classList.remove('playing');
            } else {
                // Play the selected song
                playSong(songId);
            }
        });
    });
    
    // Keyboard shortcuts for playlist
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSong();
        } else if (e.key === 'ArrowLeft') {
            previousSong();
        } else if (e.key === 'p' || e.key === 'P') {
            playlistToggle.click();
        }
    });
});
