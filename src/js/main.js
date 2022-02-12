const swiper = new Swiper('.swiper-container', {
  slidesPerView: 3,
  spaceBetween: 30,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

jQuery(function ($) {
  'use strict'
  var supportsAudio = !!document.createElement('audio').canPlayType;
  if (supportsAudio) {
    // initialize plyr
    var player = new Plyr('#audio1', {
      controls: [
        'restart',
        'play',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'download'
      ]
    });
    // initialize playlist and controls
    var index = 0,
        playing = false,
        mediaPath = '../audio/',
        extension = '',
        tracks = [{
          "track": 1,
          "name": "Владимир Коун - Улири (prod. АУДИОПАМЯТЬ)",
          "duration": "2:08",
          "file": "koun"
        }, {
          "track": 2,
          "name": "Corte Amor - Dieci (prod. АУДИОПАМЯТЬ)",
          "duration": "3:13",
          "file": "dieci"
        }, {
          "track": 3,
          "name": "Константин Ив - Записки неудобного пациента (prod. АУДИОПАМЯТЬ)",
          "duration": "1:03",
          "file": "iv"
        }, {
          "track": 4,
          "name": "Максим Волжский - Я счастливчик (prod. АУДИОПАМЯТЬ)",
          "duration": "2:30",
          "file": "voljskii"
        }],
        buildPlaylist = $.each(tracks, function(key, value) {
          var trackNumber = value.track,
              trackName = value.name,
              trackDuration = value.duration;

          if (trackNumber.toString().length === 1) {
            trackNumber = '0' + trackNumber;
          }

          $('#plList').append('<li> \
                    <div class="plItem"> \
                        <span class="plNum">' + trackNumber + '.</span> \
                        <span class="plTitle">' + trackName + '</span> \
                        <span class="plLength">' + trackDuration + '</span> \
                    </div> \
                </li>');
        }),
        trackCount = tracks.length,
        npAction = $('#npAction'),
        npTitle = $('#npTitle'),
        audio = $('#audio1').on('play', function () {
          playing = true;
          npAction.text('Воспроизведение...');
        }).on('pause', function () {
          playing = false;
          npAction.text('Пауза...');
        }).on('ended', function () {
          npAction.text('Пауза...');
          if ((index + 1) < trackCount) {
            index++;
            loadTrack(index);
            audio.play();
          } else {
            audio.pause();
            index = 0;
            loadTrack(index);
          }
        }).get(0),
        btnPrev = $('#btnPrev').on('click', function () {
          if ((index - 1) > -1) {
            index--;
            loadTrack(index);
            if (playing) {
              audio.play();
            }
          } else {
            audio.pause();
            index = 0;
            loadTrack(index);
          }
        }),
        btnNext = $('#btnNext').on('click', function () {
          if ((index + 1) < trackCount) {
            index++;
            loadTrack(index);
            if (playing) {
              audio.play();
            }
          } else {
            audio.pause();
            index = 0;
            loadTrack(index);
          }
        }),
        li = $('#plList li').on('click', function () {
          var id = parseInt($(this).index());
          if (id !== index) {
            playTrack(id);
          }
        }),
        loadTrack = function (id) {
          $('.plSel').removeClass('plSel');
          $('#plList li:eq(' + id + ')').addClass('plSel');
          npTitle.text(tracks[id].name);
          index = id;
          audio.src = mediaPath + tracks[id].file + extension;
          updateDownload(id, audio.src);
        },
        updateDownload = function (id, source) {
          player.on('loadedmetadata', function () {
            $('a[data-plyr="download"]').attr('href', source);
          });
        },
        playTrack = function (id) {
          loadTrack(id);
          audio.play();
        };
    extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
    loadTrack(index);
  } else {
    // no audio support
    $('.column').addClass('hidden');
    var noSupport = $('#audio1').text();
    $('.container').append('<p class="no-support">' + noSupport + '</p>');
  }
});
