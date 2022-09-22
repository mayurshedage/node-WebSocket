const express = require('express');
const WebSocket = require('ws');
const redis = require('redis');

const app = express();

const path = require('path');
app.use('/', express.static(path.resolve(__dirname, '../client')));

const server = app.listen(9876);

const publisher = redis.createClient();
const subscriber = redis.createClient();

(async function () {
    try {
        await publisher.connect();
        await subscriber.connect();
    } catch (error) {
        console.log(error.message);
    }
})();

const wss = new WebSocket.Server({
    noServer: true
});

wss.addListener('connection', (ws) => {
    ws.addListener('open', () => {
        console.log('socket opened');
    });
    ws.addListener('close', () => {
        console.log('socket closed');
    });
    ws.addListener('message', async (data) => {
        data = typeof data === 'object' && JSON.parse(data);
        if (typeof data === 'object') return messageHandler(ws, data);

        ws.send(`Invalid payload`);
    });
});

server.on('upgrade', async function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request)
    });
});

const messageHandler = (ws, data) => {
    switch (data.type) {
        case 'subscribe':
            rSubscribe(ws, data);
            break;
        case 'publish':
            rPublish(data);
            break;
        case 'unsubscribe':
            rUnsubscribe(data);
        default:
            break;
    }
}

const rSubscribe = async (ws, data) => {
    try {
        await subscriber.subscribe(data.channel, (content) => {
            ws.send(content);
        });
    } catch (error) {
        console.error(error.message);
    }
}

const rPublish = async (data) => {
    try {
        await publisher.publish(
            data.channel,
            JSON.stringify(data.message)
        );
    } catch (error) {
        console.error(error.message);
    }
}

const rUnsubscribe = async (data) => {
    try {
        await subscriber.unsubscribe(data.channel);
    } catch (error) {
        console.error(error.message);
    }
}

process.on('warning', e => console.warn(e.stack))
// emitter.setMaxListeners(0)