    const apiKey = 'AIzaSyDc-ursMa0KJ3V6VV9OOnXYdIqAAobps74';
    const maxResults = 100;
    let player = new Plyr('#plyr', {
      controls: ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'fullscreen'],
      settings: ['quality', 'speed'],
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 1,
        modestbranding: 1
      }
    });
    const playlists = [{
        id: 'PL2mmBC4NntuljWb1-Rmipxqg9LjDB_Ioh',
        listId: 'videoList1'
      },
      {
        id: 'PLpPy9e-Nyh3uAgehMbGGP9XehzyCttJhy',
        listId: 'videoList2'
      },
      {
        id: 'PLQJ_3JxLXqMOgmIrnIOkxpS2fka6oTzWP',
        listId: 'videoList3'
      },
      {
        id: 'PL8KEdedRKbyv08Mactrb_WCJ-kugWNcc7',
        listId: 'videoList4'
      },
      {
        id: 'PLrIayymbIXKwQB6_TL9ujt7TWY6zygLNy',
        listId: 'videoList5'
      },
      {
        id: 'PLrIayymbIXKzzsLsZnE1yW6mr06vqpXi7',
        listId: 'videoList6'
      },
      {
        id: 'PL0YQ6haWgmARSc6OTnv22g_Ds1M5pPVKi',
        listId: 'videoList7'
      },
      {
        id: 'PLQR8HbQ7DM0D3rtVbtEdcR1gM8K9J-_xF',
        listId: 'videoList8'
      },
      {
        id: 'PLLnEDlz3w4C2nblyZxAMvJb_uFumE-JuI',
        listId: 'videoList9'
      },
      {
        id: 'PLpIenqgGg0j0BGdpf4WBZr7OA8nNwUSHI',
        listId: 'videoList10'
      }
    ];

    function fetchPlaylistVideos(playlistId, videoListId) {
      const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${apiKey}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const videoListContainer = document.getElementById(videoListId);
          videoListContainer.innerHTML = '';
          data.items.forEach(item => {
            const videoId = item.snippet.resourceId.videoId;
            const title = item.snippet.title;
            const thumbnail = item.snippet.thumbnails.default.url;
            const vid = document.createElement('div');
            vid.classList.add('video-item');
            vid.setAttribute('data-video-id', videoId);
            vid.innerHTML = `
                    <img src="${thumbnail}" alt="${title}">
                    <p>${title}</p>
                `;
            vid.addEventListener('click', () => {
              player.source = {
                type: 'video',
                sources: [{
                  src: videoId,
                  provider: 'youtube',
                }],
              };
              player.play();
            });
            videoListContainer.appendChild(vid);
          });
        })
        .catch(error => console.error('Erreur lors de la récupération des vidéos:', error));
    }
    // Boucle pour récupérer les vidéos de toutes les playlists
    playlists.forEach(playlist => {
      fetchPlaylistVideos(playlist.id, playlist.listId);
    });
    // Fonction pour basculer l'affichage d'une playlist
    function togglePlaylist(videoListId) {
      const videoList = document.getElementById(videoListId);
      videoList.style.display = videoList.style.display === 'none' ? 'block' : 'none';
    }
    const searchBox = document.getElementById('search-box');
    const resultsList = document.getElementById('results');
    searchBox.addEventListener('input', function() {
      const query = searchBox.value;
      if (query !== "") {
       searchVideos(query);
      } else {
     resultsList.style.display = "none";
      }
    });

    function searchVideos(query) {
      resultsList.style.display = "block";
      resultsList.innerHTML = ''; // Réinitialiser les résultats
      playlists.forEach(playlist => {
        searchPlaylistVideos(playlist.id, query);
      });
    }
    async function searchPlaylistVideos(playlistId, query) {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`);
      const data = await response.json();
      const filteredVideos = data.items.filter(video =>
        video.snippet.title.toLowerCase().includes(query.toLowerCase())
      );
      displayResults(filteredVideos);
    }
    async function displayResults(videos) {
      for (let video of videos) {
        const videoId = video.snippet.resourceId.videoId;
        const videoThumbnail = video.snippet.thumbnails.default.url; // URL de la miniature
        const videoTitle = video.snippet.title;
        const duration = await fetchVideoDuration(videoId);
        const li = document.createElement('li');
        const img = document.createElement('img');
        const detailsDiv = document.createElement('div');
        const titleSpan = document.createElement('span');
        const durationSpan = document.createElement('span');
        img.src = videoThumbnail;
        titleSpan.textContent = videoTitle;
        durationSpan.textContent = `Duration: ${duration}`;
        durationSpan.classList.add('video-duration');
        detailsDiv.classList.add('video-details');
        detailsDiv.appendChild(titleSpan);
        detailsDiv.appendChild(durationSpan);
        li.appendChild(img);
        li.appendChild(detailsDiv);
        li.addEventListener('click', function() {
          loadVideo(videoId);
        });
        resultsList.appendChild(li);
      }
    }
    async function fetchVideoDuration(videoId) {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
      const data = await response.json();
      const durationISO = data.items[0].contentDetails.duration;
      return formatDuration(durationISO);
    }

    function formatDuration(durationISO) {
      // Conversion de la durée au format ISO 8601 (ex: PT1H2M3S) en format lisible
      const match = durationISO.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const hours = (match[1] || '0H').slice(0, -1);
      const minutes = (match[2] || '0M').slice(0, -1);
      const seconds = (match[3] || '0S').slice(0, -1);
      return `${hours > 0 ? hours + ':' : ''}${minutes}:${seconds.padStart(2, '0')}`;
    }

    function loadVideo(videoId) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      player.source = {
        type: 'video',
        sources: [{
          src: videoUrl,
          provider: 'youtube'
        }]
      };
    }
  player.on("play", () => {
	player.fullscreen.enter();
	});
