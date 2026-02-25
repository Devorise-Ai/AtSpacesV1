const io = require('socket.io-client');

console.log("Connecting to WebSocket on port 3001...");
const socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log("Connected successfully! ID: ", socket.id);

    // Test the specific tool: book_room
    const testMessage = "I would like to book a hot desk in Amman for 2 hours please. My email is mostafadamisi@gmail.com";
    console.log(`Sending message: "${testMessage}"`);

    socket.emit('sendMessage', { message: testMessage });
});

socket.on('messageChunk', (data) => {
    process.stdout.write(data.chunk);
});

socket.on('messageComplete', (data) => {
    console.log(`\n\n--- Message Completed [Session: ${data.sessionId}] ---\n`);
    socket.disconnect();
});

socket.on('messageError', (err) => {
    console.error("Agent Error:", err);
    socket.disconnect();
});

socket.on('disconnect', () => {
    console.log("Disconnected.");
});
