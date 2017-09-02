// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
};
app.init = function() {

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

app.fetch = function() {
  $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: {"order": "-createdAt"},
    success: function(data) {
      var rooms = {};
      for(let i = data.results.length - 1; i > 0; i--) {
        if(data.results[i].username !== null && data.results[i].username !== '' && data.results[i].username !== undefined) {
          app.renderMessage(data.results[i]);
          if(!rooms.hasOwnProperty(data.results[i].roomname)) {
            rooms[data.results[i].roomname] = data.results[i].roomname;
            app.renderRoom(data.results[i].roomname);
          }
        }
      }
    },
    error: function(data) {
      console.log('error');
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(obj) {
  var $username = $('<h3 class="username"></h3>');
  $username.text(obj.username);
  var $text = $('<div class="text"><div>');
  $text.text(obj.text);
  var $chat = $('<div class="chat"></div>');
  $chat.append($username, $text);
  $chat.addClass(obj.roomname);
  $('#chats').prepend($chat);
};

app.renderRoom = function(roomName) {
  var $room = $('<li></li>');
  // $room.html("<a href='#'>" + roomName + "</a>");
  $room.text(roomName);
  $('#roomSelect ul').append($room);
};
2
app.handleUsernameClick = function() {
};

app.handleSubmit = function() {
};

$(document).ready(function() {
  app.clearMessages();
  app.fetch();
  setInterval(() => {
    $('#roomSelect ul').html('');
    app.clearMessages();
    app.fetch();
  }, 30000);
  $('#roomSelect ul').on('click', 'li', function(){
    var selectedRoom = $(this).text();
    $('.chat').each((i, child) => {
      if(!child.className.includes(selectedRoom)) {
        $(child).toggle();
      }
    });
  });
  $('#roomSelect button').click(function() {
    $('#roomSelect ul').html('');
    app.clearMessages();
    app.fetch();
  });

  $('#submitMessage').click(function() {
    var obj = {
      username: $('#inputUsername').val(),
      text: $('#inputMessage').val(),
      roomname: 'lobby'
    };
    app.send(obj);
    $('#inputUsername').val('');
    $('#inputMessage').val('');
    $('#roomSelect ul').html('');
    app.clearMessages();
    app.fetch();
   });
});
