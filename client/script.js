const url = `ws://localhost:9876/websocket`;
const socket = new WebSocket(url);

let logout = document.getElementById('logout');
let messages = document.getElementById('messages');

let messageElement = document.getElementById('message');
let channelElement = document.getElementById('channel');

const CURRENT_USER = Math.floor(Math.random(10000, 99999) * 10 ** 10);
console.log('' + CURRENT_USER);

socket.addEventListener('error', (event) => {
    console.error('error', event);
});
socket.addEventListener('close', function (event) {
    console.error('close', event);
});
socket.addEventListener('open', function (event) {
    console.log('open', event);
    socket.send(JSON.stringify({
        type: 'subscribe',
        channel: '' + CURRENT_USER,
        payload: {}
    }));
});
socket.addEventListener('message', function (event) {
    const { data } = event;
    content = JSON.parse(data);

    createMessage(content.message, content.name);
});

logout.addEventListener('click', function () {
    console.log('in');
    socket.send(JSON.stringify({
        type: 'unsubscribe',
        channel: '' + CURRENT_USER,
        payload: {}
    }));
    socket.close();
}, false);

messageElement.addEventListener('keydown', function (event) {
    if (event.code === 'Enter') sendMessage();
}, false);

function createMessage(message, type) {
    const newMessage = document.createElement('div');
    newMessage.classList.add('form-control');
    newMessage.innerText = `${type}: ${message}`;
    messages.appendChild(newMessage)
}

function sendMessage() {
    let channel = channelElement.value;
    let message = messageElement.value;

    if (!message || !channel) return;

    socket.send(JSON.stringify({
        type: 'publish',
        channel: channel,
        payload: {
            name: 'Guest-' + CURRENT_USER,
            message: message
        }
    }));
    messageElement.value = '';
    messageElement.focus();
}