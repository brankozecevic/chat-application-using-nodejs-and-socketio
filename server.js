let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);

let users = [];
let connections = [];


server.listen(3000);
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
io.sockets.on('connection', function(socket){
    connections.push(socket);

    //Disconnect
    socket.on('disconnect', function(data){
        //if(!socket.username)return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
    });

    //send message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //new user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();

    });
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
});