//const port = 3000;
//const ws = new WebSocket(`ws://localhost:${port}`);
const roomId = 'test_123';
const sampleQuestions = [{'q':"Who is the president of the USA",'o':['elon','leon','trump','musk'],'a':'musk','t':'10','qn':'0'},
                        {'q':"Central Cee or Aitch",'o':['aitch','central cee'],'a':'aitch','t':'10','qn':'1'}]

//connect with socket
var socket = io('http://localhost:5000');
socket.on('connect', function() {
    //just connected with websocket
    console.log("CONNECTION SUCCESSFUL")
});

//get userName
const login = document.getElementById("user");

const joinRoom = ()=>{
    socket.emit('join-admin',{'username':login.value,'room':roomId})
    console.log("Emiited")
}

const sendQuestion = () => {
    //console.log(roomId.value);
    //console.log(login.value);
    //send the username for validation
    socket.emit('send-question-admin',{'roomId':roomId,'username':login.value,'questions':sampleQuestions})
    console.log("Questions sent")
}

const startQuiz = (roomId)=>{
    socket.emit('start-quiz',{'roomId':roomId})
    console.log({'roomId':roomId})
    console.log("QUIZ STARTED")
}

document.getElementById("join-room").addEventListener("click",joinRoom)
document.getElementById("send-questions").addEventListener("click",sendQuestion)
document.getElementById("start-quiz").addEventListener("click",()=>{startQuiz(roomId)})