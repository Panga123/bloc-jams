
var setSong = function(songNumber) {
  if (currentSoundFile) { //stops concurrent playback
         currentSoundFile.stop();
  }
currentlyPlayingSongNumber = parseInt(songNumber);
currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    // #1
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        // #2
        formats: [ 'mp3' ],
        preload: true
    });
    setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell= function(number) {
    var songCell = $('.song-item-number[data-song-number="' + number + '"]');
    return songCell;
};

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

     var clickHandler = function() {
             var songNumber = parseInt($(this).attr('data-song-number'));

             if (currentlyPlayingSongNumber !== null) {
                 // Revert to song number for currently playing song because user started playing new song.
                  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
                  currentlyPlayingCell.html(currentlyPlayingSongNumber);
             }

              if (currentlyPlayingSongNumber !== songNumber) {
                  // Switch from Play -> Pause button to indicate new song is playing.
                  setSong(songNumber);
                 currentSoundFile.play();

                  $(this).html(pauseButtonTemplate);
                  updatePlayerBarSong();

              } else if (currentlyPlayingSongNumber === songNumber) {
                  if (currentSoundFile.isPaused()) {
                  $(this).html(pauseButtonTemplate);
                  $('.main-controls .play-pause').html(playerBarPauseButton);
                  currentSoundFile.play();

              }   else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
                    }
	     }
};
  var onHover = function(event) {
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));

            if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
            }
            console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
  };
  var offHover = function(event) {
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));

            if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
            }
       console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
  };
    // #1
     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;
  };

 var setCurrentAlbum = function(album) {
    currentAlbum = album;
     // #1
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');


     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

     // #3
     $albumSongList.empty();

     // #4
     for (var i = 0; i < album.songs.length; i++) {
       var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
       $albumSongList.append($newRow);
     }
 };

      var trackIndex = function(album, song) { // still don't get what this does
        return album.songs.indexOf(song);  // what's indexof?
      };

 var updatePlayerBarSong = function() {


     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

     $('.main-controls .play-pause').html(playerBarPauseButton);
 };
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing songs...
 // #1
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $barPlayer = $('.main-controls .play-pause'); // assignment #20; create variable to hold the main control selector

var songNumber = parseInt($(this).attr('data-song-number'));

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);

     $barPlayer.click(togglePlayfromPlayerBar); // assignment #20
     //added a click event with togglePLay as event handler.
//deleted for loop
});

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = setSong(songNumber);

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play(); //when you skip a song, play the next one

    // Update the Player Bar information
    updatePlayerBarSong();
    $('.main-controls .play-pause').html(playerBarPlayButton);
  // is something missing here

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = setSong(songNumber);;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayfromPlayerBar = function () {

   if (currentSoundFile.isPaused()) { //if song is paused
        var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);

        $songNumberCell.html(pauseButtonTemplate); //change HTML of play button to pause button.
        $('.left-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play(); //play the song
   } else {
        var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);

        $songNumberCell.html(playButtonTemplate); //change song number from pause to play button
        $('.left-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();   //pause song
    }
};
