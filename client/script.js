const url = `ws://localhost:9876/websocket`;
const server = new WebSocket(url);

const messages = document.getElementById('messages');
const input = document.getElementById('message');
const button = document.getElementById('send');

const CURRENT_USER = Math.floor(Math.random(9, 99999) * 1000);

button.disabled = true;
button.addEventListener('click', sendMessage, false)

server.onopen = function () {
    button.disabled = false;
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
    const text = input.value;
    server.send(JSON.stringify({
        name: 'Guest-' + CURRENT_USER,
        message: text
    }));
    input.value = '';
    input.focus()
}