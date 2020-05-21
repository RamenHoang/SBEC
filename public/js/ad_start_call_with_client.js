$('#btn-accept-call').on('click', function () {
  const peer = new Peer();

  peer.on('open', function () {
    var adminId = peer.id;
    socket.emit('admin-accept-call-request-to-server', adminId);

    socket.on('client-admin-calling-response', function () {
      const getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

      peer.on('call', function (call) {
        getUserMedia({ video: false, audio: true }, function (stream) {

          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', function (remoteStream) {
            // Show stream in some video/canvas element.
            
            playStream('audio_admin',remoteStream);
          });
        }, function (err) {
          console.log('Failed to get local stream', err);
        });
      });
    })
  });
});

function playStream(audioId, stream) {
  var audio = document.getElementById(audioId);
  // window.stream = stream; // make variable available to browser console
  audio.srcObject = stream;
}



