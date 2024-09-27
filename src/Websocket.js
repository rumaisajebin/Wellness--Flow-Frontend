const roomName = "room1"; // dynamically generate or retrieve room name
const chatSocket = new WebSocket(
    'ws://' + window.location.host + '/ws/chat/' + roomName + '/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log('Message received: ', data.message);
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

function sendMessage(message) {
    chatSocket.send(JSON.stringify({ 'message': message }));
}
