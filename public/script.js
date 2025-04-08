//const port = 3000;
//const ws = new WebSocket(`ws://localhost:${port}`);
const roomId = 'test_123';
const qDiv = document.getElementById('question')
const leadDiv = document.getElementById('leaderboard');
let qno = 0;
let isConnect = false;
let answerable = true;
const buttonA = document.getElementById("option-a");
const buttonB = document.getElementById("option-b");
const buttonC = document.getElementById("option-c");
const buttonD = document.getElementById("option-d");

const buttonArr = [buttonA,buttonB,buttonC,buttonD];

var socket = io('http://localhost:5000');
socket.on('connect', function() {
    //just connected with websocket
    //socket.emit('my event', {data: 'I\'m connected!'});
    isConnect = true;
});



socket.on('new-question',function(data){
    if(isConnect){
        answerable = true;
        qDiv.innerText = data['q'];
        qno = parseInt(data['qn'],10);
        //display options
        const len = data['o'].length;
        console.log(data['o']);
        for(let i = 0;i < len;i++){
            buttonArr[i].innerText = data['o'][i];
        }
    } 
})

socket.on('quiz-end',function(data){
    leadDiv.innerText = data.toString();
})

//socket.on('questionTime',function(){
    //questionTime
//})
//const roomId = document.getElementByIddisplayText("roomID");
const login = document.getElementById("user");

const joinRoom = ()=>{
    console.log("FUCK ME IN THE ASS")
    socket.emit('join',{'username':login.value,'room':'test_123'})
}

const sendAnswer = (answer) => {
    console.log("sex");
    console.log(login.value);
    socket.emit('answer_receive',{'roomId':roomId,'answer':answer,'qn':qno.toString(),'user':login.value})
    answerable = false;
    
}

//send correct answer and questions to device which is then decided from server
//then send back to server a hashed value of string answer selected which will be
//compared to the hash value there and a correct or not response will be generated based on user

buttonA.addEventListener("click", ()=>{sendAnswer(buttonA.innerText)});
buttonB.addEventListener("click", ()=>{sendAnswer(buttonB.innerText)});
buttonC.addEventListener("click", ()=>{sendAnswer(buttonC.innerText)});
buttonD.addEventListener("click", ()=>{sendAnswer(buttonD.innerText)}); 
