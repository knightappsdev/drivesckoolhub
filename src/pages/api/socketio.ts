import { NextApiRequest } from 'next';
import { NextApiResponseServerIO, initSocketServer } from '@/lib/socket-server';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket.io server already running');
  } else {
    console.log('Setting up Socket.io server...');
    const io = initSocketServer(res.socket.server);
    res.socket.server.io = io;
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
}