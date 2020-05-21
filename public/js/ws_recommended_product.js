var socket = io.connect('https://sbec-server.herokuapp.com');
socket.emit('recommend-product');

socket.emit('client-sent-text', {
    name: 'abc'
})

