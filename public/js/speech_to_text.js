function startSpeechToText(recognition) {
  // window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  // const recognition = new SpeechRecognition();
  
  recognition.interimResults = true;

  let text = '';
  
  recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
  
    console.log(transcript);
    text = transcript;
  
    if (e.results[0].isFinal) {
      socket.emit('client-sent-transcript-to-server', text);
      text = '';
    }
  });
  
  recognition.addEventListener('end', recognition.start)
  
  recognition.start();
}

function stopSpeechToText(recognition) {
  recognition.stop();
}


