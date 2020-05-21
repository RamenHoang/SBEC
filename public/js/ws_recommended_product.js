var socket = io.connect('http://localhost:1300');
socket.emit('recommend-product');

socket.emit('client-sent-text', {
    name: 'abc'
})

