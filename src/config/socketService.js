import socketIOClient from 'socket.io-client';
import { ENV_GERMANY_ENDPOINT, ENV_API_ENDPOINT } from '../env/local';

let socket;

const initSocket = () => {
  socket = socketIOClient(ENV_API_ENDPOINT.slice(0, -4), {
    transports: [
      // 'websocket',
      'polling',
    ],
  });
};

const listenEvent = (eventName, callback) => {
  socket &&
    socket.on(eventName, (data) => {
      callback(data);
    });
};

const emitEvent = (eventName, data) => {
  socket.emit(eventName, data);
};

const disconnectSocket = () => {
  socket.disconnect();
};

export default {
  initSocket,
  listenEvent,
  emitEvent,
  disconnectSocket,
};
