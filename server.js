const express=require('express');
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const {v4:uuidv4}=require('uuid');
const { ExpressPeerServer }=require('peer');
const peerServer=ExpressPeerServer(server,{debug:true});
const path=require('path');

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use('/peerjs',peerServer);

app.get('/',(req,res)=>{
  res.redirect(`/${uuidv4()}`);
});

app.get('/:room',(req,res)=>{
  res.render('room',{roomId:req.params.room});
})

io.on('connection',socket=>{
  socket.on('join-room',(roomId,userId)=>{
    socket.join(roomId);
    socket.broadcast.emit('user-connected',userId);
  });

  socket.on('chatMessage',msg=>{
    io.emit('append',msg);
  });
});

const port=3030;
server.listen(port,()=>{console.log(`${port} is currently running`)})