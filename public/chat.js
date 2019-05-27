$(function(){
    var socket = io.connect('http://localhost:8000')
    // buttons and inputs
    var message = $("#message")
    var header = $("header")
    
    // var send_username = $("#send_username")
    var send_message = $("#send_message")
    var chatroom = $("#chatroom")
    var feedback = $("#feedback")
    var container1 = $(".container1")
    var userOnline = $(".user-online")
    // emit message
    send_message.click(function(){
        socket.emit('new_message', {message : message.val()})
    })

  //   // listen on new message
    socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
        chatroom.append(`<p class="message"> ${data.username}  : ${data.message} </p>`)
    })
    
  //   //Emit typing
	message.bind("keypress", (e) => {
    socket.emit('typing')
    // console.log(e.keyCode)
    if(e.keyCode == 13) {
      socket.emit('new_message', {message : message.val()})
    }
	})

	// //Listen on typing
	socket.on('typing', (data) => {
        feedback.html(`<p><i> ${data.username} is typing a message... </i></p>`)
  })
  
  socket.emit('new_user')
  
  socket.on('new_user', (data) => {
    // console.log(data.message)
    let users = [...data.message.split(',')]
    userOnline.innerHTML = ''
    for(let user of users) {
      userOnline.append(`<div class="card card1">${user}</div>`)
    }
  })
})