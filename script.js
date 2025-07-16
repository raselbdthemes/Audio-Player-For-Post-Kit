// Sample playlist array (10 songs, dummy data)
const songs = [
  {
    title: "Faster Than My Dreams",
    artist: "Moon",
    src: "songs/faster-than-my-dreams.mp3",
    cover: "songs/song-cover-photo-01.png",
    duration: 196 // seconds
  },
  {
    title: "EONA - Emotional Ambient Pop",
    artist: "Curtis Cole",
    src: "songs/saturn.mp3",
    cover: "songs/song-cover-photo-02.png",
    duration: 177
  },
  {
    title: "Future Design",
    artist: "Shtriker Big Band",
    src: "songs/lemonade.mp3",
    cover: "songs/song-cover-photo-04.png",
    duration: 142
  },
  {
    title: "Cyberpunk Sci-Fi Trailer Action Intro",
    artist: "Nova",
    src: "songs/dreamscape.mp3",
    cover: "songs/song-cover-photo-05.png",
    duration: 210
  },
  {
    title: "Experimental Cinematic Hip-Hop",
    artist: "Echoes",
    src: "songs/sunset-drive.mp3",
    cover: "songs/song-cover-photo-06.png",
    duration: 188
  },
  {
    title: "Gardens - Stylish Chill",
    artist: "Lights",
    src: "songs/midnight-city.mp3",
    cover: "songs/song-cover-photo-07.png",
    duration: 201
  },
  {
    title: "Kugelsicher by TremoxBeatz",
    artist: "Billie",
    src: "songs/ocean-eyes.mp3",
    cover: "songs/song-cover-photo-08.png",
    duration: 155
  },
  {
    title: "Spinning Head",
    artist: "John Mayer",
    src: "songs/gravity.mp3",
    cover: "songs/song-cover-photo-09.png",
    duration: 230
  },
  {
    title: "Stylish Deep Electronic",
    artist: "Adam Levine",
    src: "songs/lost-stars.mp3",
    cover: "songs/song-cover-photo-10.png",
    duration: 205
  }
];

// DOM elements
const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const muteBtn = document.getElementById('mute');
const playlistToggleBtn = document.getElementById('playlist-toggle');
const playlistDiv = document.getElementById('playlist');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const progressPointer = document.getElementById('progress-pointer');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

let currentSong = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isMuted = false;
let shuffledOrder = [];
let playlistVisible = false;

// Utility: format seconds as mm:ss
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Load song info
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  cover.src = song.cover;
  title.textContent = song.title;
  artist.textContent = song.artist;
  durationEl.textContent = formatTime(song.duration);
  currentTimeEl.textContent = "0:00";
  progressBar.style.width = "0%";
  highlightPlaylistItem(index);
}

// Play/Pause
function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}
function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}
playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});

// Previous/Next
prevBtn.addEventListener('click', () => {
  prevSong();
});
nextBtn.addEventListener('click', () => {
  nextSong();
});

function prevSong() {
  if (isShuffle) {
    currentSong = getPrevShuffledIndex();
  } else {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
  }
  loadSong(currentSong);
  playSong();
}
function nextSong() {
  if (isShuffle) {
    currentSong = getNextShuffledIndex();
  } else {
    currentSong = (currentSong + 1) % songs.length;
  }
  loadSong(currentSong);
  playSong();
}

// Shuffle
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
  if (isShuffle) {
    shuffledOrder = shuffleArray([...Array(songs.length).keys()]);
    currentSong = shuffledOrder[0];
  }
});
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function getNextShuffledIndex() {
  let idx = shuffledOrder.indexOf(currentSong);
  idx = (idx + 1) % shuffledOrder.length;
  return shuffledOrder[idx];
}
function getPrevShuffledIndex() {
  let idx = shuffledOrder.indexOf(currentSong);
  idx = (idx - 1 + shuffledOrder.length) % shuffledOrder.length;
  return shuffledOrder[idx];
}

// Repeat
repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active', isRepeat);
});

// Volume/Mute
muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  muteBtn.innerHTML = isMuted
    ? '<i class="fa-solid fa-volume-xmark"></i>'
    : '<i class="fa-solid fa-volume-up"></i>';
});

// Volume bar control
const volumeControlWrapper = document.querySelector('.volume-control-wrapper');
const volumeBar = document.getElementById('volume-bar');
let volumeBarTimeout;

function showVolumeBar() {
  const bar = volumeControlWrapper.querySelector('.volume-bar-container');
  bar.style.opacity = '1';
  bar.style.pointerEvents = 'auto';
  bar.style.transform = 'translateX(-50%) translateY(-10px)';
}
function hideVolumeBar() {
  const bar = volumeControlWrapper.querySelector('.volume-bar-container');
  bar.style.opacity = '0';
  bar.style.pointerEvents = 'none';
  bar.style.transform = 'translateX(-50%) translateY(0)';
}

volumeControlWrapper.addEventListener('mouseenter', () => {
  clearTimeout(volumeBarTimeout);
  showVolumeBar();
});
volumeControlWrapper.addEventListener('mouseleave', () => {
  volumeBarTimeout = setTimeout(hideVolumeBar, 200); // 200ms delay before hiding
});

if (volumeBar) {
  // Set initial volume to 50%
  audio.volume = 0.5;
  volumeBar.value = 1 - 0.5; // Because visually top is high volume

  volumeBar.addEventListener('input', (e) => {
    const reversedValue = 1 - e.target.value; // Invert input value
    audio.volume = reversedValue;

    isMuted = audio.volume === 0;
    audio.muted = isMuted;
    muteBtn.innerHTML = isMuted
      ? '<i class="fa-solid fa-volume-xmark"></i>'
      : '<i class="fa-solid fa-volume-up"></i>';
  });
}

// Playlist toggle
// Playlist toggle: open by default, clicking hides
playlistDiv.classList.add('show'); // Ensure playlist is open by default
playlistToggleBtn.addEventListener('click', () => {
  if (playlistDiv.classList.contains('show')) {
    playlistDiv.classList.remove('show');
  } else {
    playlistDiv.classList.add('show');
  }
});

// Progress bar update
let isDraggingProgress = false;
audio.addEventListener('timeupdate', () => {
  if (isDraggingProgress) return;
  const song = songs[currentSong];
  const percent = (audio.currentTime / song.duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  // Update pointer position
  if (progressPointer) {
    const barBg = progressBar.parentElement;
    const barWidth = barBg.offsetWidth;
    const pointerLeft = (percent / 100) * barWidth;
    progressPointer.style.left = `${pointerLeft}px`;
  }
});
audio.addEventListener('ended', () => {
  // Only go to next song if truly at end (not just near end due to drag)
  const song = songs[currentSong];
  // Use a small epsilon to avoid floating point issues
  if (audio.currentTime < song.duration - 0.5) {
    // If ended event fired but not at end, just pause
    audio.pause();
    return;
  }
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

// Seek on progress bar click
progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.querySelector('.progress-bar-bg').getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = x / rect.width;
  const song = songs[currentSong];
  audio.currentTime = percent * song.duration;
});

// Dragging logic for progress pointer
if (progressPointer) {
  progressPointer.addEventListener('mousedown', (e) => {
    isDraggingProgress = true;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingProgress) return;
    const rect = progressBar.parentElement.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = x / rect.width;
    const song = songs[currentSong];
    // Update bar visually instantly
    progressBar.style.width = `${percent * 100}%`;
    // Update pointer position instantly
    progressPointer.style.left = `${x}px`;
    // Update current time visually
    currentTimeEl.textContent = formatTime(percent * song.duration);
  });

  document.addEventListener('mouseup', (e) => {
    if (isDraggingProgress) {
      const rect = progressBar.parentElement.getBoundingClientRect();
      let x = e.clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = x / rect.width;
      const song = songs[currentSong];
      audio.currentTime = percent * song.duration;
      isDraggingProgress = false;
      document.body.style.userSelect = '';
    }
  });
}

// Playlist rendering
function renderPlaylist() {
  playlistDiv.innerHTML = '';
  songs.forEach((song, idx) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `
      <div class="playlist-cover-wrapper">
        <img src="${song.cover}" class="playlist-cover" alt="cover">
        <span class="playlist-play-btn"><i class="fa-solid fa-play"></i></span>
      </div>
      <div class="playlist-info">
        <span class="playlist-title">${song.title}</span>
        <span class="playlist-artist">${song.artist}</span>
      </div>
      <span class="playlist-duration">${formatTime(song.duration)}</span>
    `;
    item.addEventListener('click', () => {
      currentSong = idx;
      loadSong(currentSong);
      playSong();
    });
    // Play button click also plays the song
    item.querySelector('.playlist-play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      currentSong = idx;
      loadSong(currentSong);
      playSong();
    });
    playlistDiv.appendChild(item);
  });
  highlightPlaylistItem(currentSong);
}

// Highlight currently playing song
function highlightPlaylistItem(index) {
  const items = playlistDiv.querySelectorAll('.playlist-item');
  items.forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}

// Initial setup

// Initial setup
loadSong(currentSong);
renderPlaylist();
