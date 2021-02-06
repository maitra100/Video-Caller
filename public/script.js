const name=prompt("what is your name");

const socket = io('/');
const chatmessage=document.getElementById('message_area');
const chatwindow=document.getElementsByClassName('main_chat_window');

const microphone=document.querySelector(".mute");
const myVideoGrid=document.getElementById('video-grid');
const myVideo=document.createElement('video');
myVideo.muted=true;

microphone.addEventListener("mouseover",()=>{
  myVideo.muted=true;
})

var peer = new Peer(undefined,{
  path:'/peerjs',
  host:'/',
  port:'3030',
}); 

let myVideoStream;

navigator.mediaDevices.getUserMedia({
 video:true,
 audio:true
}).then(stream=>{
  myVideoStream=stream;
   addVideoStream(myVideo,stream);

   socket.on('user-connected',(userId)=>{
  ConnectToNewUser(userId,stream);


});
}).catch(error=>console.log("something wrong"));

peer.on('call',call=>{
    call.answer(myVideoStream);
    const video=document.createElement('video');
    call.on('stream', userVideoStream=>{
      addVideoStream(video,userVideoStream);
    });
  });

peer.on('open',id=>{
 socket.emit('join-room',ROOM_ID,id);
});

chatmessage.addEventListener('submit',e=>{
  e.preventDefault();
  const msg=e.target.elements.msg.value;
  socket.emit('chatMessage',msg);
  e.target.elements.msg.value='';
  e.target.elements.msg.focus();
});

socket.on('append',msg=>{
  appendmessage(msg);
})

function ConnectToNewUser(userId,stream){
   const call=peer.call(userId,stream);
   const video=document.createElement('video');
   call.on('stream',userVideoStream=>{
     addVideoStream(video,userVideoStream);
   })
}; 

function addVideoStream(video,stream){
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
      video.play();
    });
    myVideoGrid.append(video);
}

function appendmessage(msg){
  const div=document.createElement('div');
  div.classList.add('message');
  div.classList.add('p');
  div.innerHTML=`<p>${name}-${msg}</p>`;
  chatwindow.append(div);
}