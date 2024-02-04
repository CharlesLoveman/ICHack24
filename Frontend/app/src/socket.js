import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'http://34.105.220.197:5000' : 'http://127.0.0.1:5000';

export const socket = io(URL, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});