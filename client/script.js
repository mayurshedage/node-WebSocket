const url = `ws://localhost:9876/websocket`;
const server = new WebSocket(url);

let logout = document.getElementById('logout');
let messages = document.getElementById('messages');
let messageElement = document.getElementById('message');
let channelElement = document.getElementById('channel');

const CURRENT_USER = Math.floor(Math.random(10000, 99999) * 10 ** 10);
console.log('' + CURRENT_USER);

logout.addEventListener('click', function () {
    server.close();
}, false);

messageElement.addEventListener('keydown', function (event) {
    if (event.code === 'Enter') sendMessage();
}, false)

server.onopen = function () {
    server.send(JSON.stringify({
        type: 'subscribe',
        channel: '' + CURRENT_USER,
        payload: {}
    }));
}

server.onmessage = function (event) {
    const { data } = event;
    content = JSON.parse(data);

    createMessage(content.message, content.name);
}

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

    server.send(JSON.stringify({
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