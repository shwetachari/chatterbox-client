// YOUR CODE HERE:
var app = {};

app.init = function() {
  app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function(friends, room) {
  var dataQuery = room === undefined ? { "order": "-createdAt" } : { "order": "-createdAt", "where": {'roomname' : room}};
  $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: jQuery.param(dataQuery),
    success: function(data) {
      console.log('data', data);
      app.clearMessages();
      var rooms = {};
      for (let i = data.results.length - 1; i >= 0; i--) {
        if (data.results[i].username !== null && data.results[i].username !== '' && data.results[i].username !== undefined) {
          app.renderMessage(data.results[i]);
          if (!rooms.hasOwnProperty(data.results[i].roomname) && data.results[i].roomname !== '' && data.results[i].roomname !== null && data.results[i].roomname !== undefined) {
            rooms[data.results[i].roomname] = data.results[i].roomname;
            app.renderRoom(data.results[i].roomname);
          }
        }
      }
      app.handleUsernameClick(friends);
    },
    error: function(data) {
      console.log('error in fetch');
    }
  });
};

app.clearMessages = function() {
  $('#roomSelect ul').html('');
  $('#chats').html('');
};

app.renderMessage = function(obj) {
  var $username = $('<h3 class="username"></h3>');
  $username.text(obj.username);
  var $text = $('<div class="text"><div>');
  $text.text(obj.text);
  var $time = $('<div class="timestamp"></div>');
  var formattedTime = (obj.createdAt.split('').slice(11, 16).join(''));
  $time.text(formattedTime);
  var $chat = $('<div class="chat"></div>');
  $chat.append($username, $text, $time);
  $chat.addClass(obj.roomname);
  $('#chats').prepend($chat);
};

app.renderRoom = function(roomName) {
  var $room = $('<li></li>');
  $room.text(roomName);
  $('#roomSelect ul').append($room);
};

app.handleUsernameClick = function(array) {
  $('.chat .username').each(function(index, user) {
    for (var i = 0; i < array.length; i++) {
      if ($(user).text() === array[i]) {
        $(user).css('color', 'black');
      }
    }
  });
};

app.handleSubmit = function(room) {
  var obj = {
    username: $('#inputUsername').val(),
    text: $('#inputMessage').val(),
    roomname: room || 'lobby'
  };
  app.send(obj);
  $('#inputUsername').val('');
  $('#inputMessage').val('');
  app.fetch(friends, room);
};

$(document).ready(function() {
  app.init();
  
  var friends = [];
  var globalRoom = 'lobby';
  var $roomName = $('<div></div>');
  
  $roomName.text('You are currently in "' + globalRoom + '"');
  $('#main').append($roomName);
  app.fetch(friends, globalRoom);
  
  var intervalOn = true;
  var interval = setInterval(() => {
    if (intervalOn) {
      app.fetch(friends);
    }
  }, 10000);
  
  $('#roomSelect ul').on('click', 'li', function() {
    var selectedRoom = $(this).text();
    globalRoom = selectedRoom;
    $roomName.text('You are currently in "' + globalRoom + '"');
    app.fetch(friends, globalRoom);
    intervalOn = false;
  });
  
  $('#roomSelect button').click(function() {
    app.fetch(friends);
    intervalOn = true;
  });

  $('#submitMessage').click(function() {
    app.handleSubmit(globalRoom);
  });
  
  $('#chats').on('click', '.chat .username', function() {
    var friend = $(this).text();
    friends.push(friend);
    app.handleUsernameClick(friends);
  });
});
