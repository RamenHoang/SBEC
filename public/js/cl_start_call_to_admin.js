const peer = new Peer();

peer.on('open', function(){
  var clientId = peer.id;
});

$('#btn-call-to-admin').on('click', function() {
  
  socket.emit('client-request-call-to-server');
  $(this).fadeToggle();
  $('#audio_client').fadeToggle();
  $('#status-call-to-admin').fadeToggle();
});

socket.on('server-sent-accept-call-from-admin', function(adminId) {
  $('#btn-call-to-admin').css('display', 'none');

  socket.emit('client-admin-calling-request');

  const getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

  getUserMedia({ video: false, audio: true }, function(stream) {
    const call = peer.call(adminId, stream);

    call.on('stream', function(remoteStream) {
      playStream('audio_client', remoteStream);
    })
  });
  $('#status-call-to-admin').text('Accepted. Start conversation now');
  $('#btn-stop-call-to-admin').fadeToggle();
});

function playStream(audioId, stream) {
  var audio = document.getElementById(audioId);
  // window.stream = stream; // make variable available to browser console
  audio.srcObject = stream;
}