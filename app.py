from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from flask_socketio import SocketIO, emit, join_room, leave_room,send
from flask_cors import CORS
import json
import threading

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app,debug=True,cors_allowed_origins='*')

roomIds = []
leaderBoard = {}
#@app.route('/home')
#def main():
#        return render_template('index.Shtml')

qSets = {}

def handle_questions(event,questions,roomId):
    for i in questions:
        socketio.emit('new-question',i,to=roomId)
        print(i)
        event.wait(int(i['t']))
    print("QUESTION SENT")
    #send over the leaderboard in the form of a dict
    socketio.emit('quiz-end',leaderBoard,to=roomId)
    print(leaderBoard)


#add to qSets, stringified json of questions, answers  
@socketio.on('send-question-admin')
def handle_admin_question(data):
    qSets[data['roomId']] = data['questions']
    print(f"Obtained questions for roomid: ${data['roomId']}")

@socketio.on('start-quiz')
def handle_start_quiz(data):
    if str(data['roomId']) in qSets:
        #we start a repeated process that calls a function that cycles thru the questions
        leaderBoard[data['roomId']] = {}

        event = threading.Event()
        thread = threading.Thread(target=handle_questions,args=(event,qSets[data['roomId']],data['roomId']))
        thread.start()

    else:
        #print(qSets)
        #print("============")
        #print((data['roomId']))
        pass

        

@socketio.on('answer_receive')
def giveQuestion(data):
    print("banchod answer aagaya")
    print(data['roomId'])
    #check answer and then send right or wrong
    #to client
    print(qSets)
    if(data['answer'] == qSets[data['roomId']][int(data['qn'])]['a']):
        print(f'correct: {data['user']} in {data['qn']}')
        #update leaderboard with correct answer
        if(data['user'] in leaderBoard[data['roomId']]):
            leaderBoard[data['roomId']][data['user']]['score'] = str(1+int(leaderBoard[data['roomId']][data['user']]['score']))
        else:
            leaderBoard[data['roomId']][data['user']] = {'score':'1'}
    else:
        print(f'wrong: {data['user']} in {data['qn']}')
        if(data['user'] in leaderBoard[data['roomId']]):
            leaderBoard[data['roomId']][data['user']]['score'] = str(int(leaderBoard[data['roomId']][data['user']]['score'])-1)
        else:
            leaderBoard[data['roomId']][data['user']] = {'score':'-1'}

@socketio.on('join-admin')
def on_join_admin(data):
    username = data['username']
    room = data['room']+"_admin"
    join_room(room)
    #print("admin entry")
    #print(room)
    if room not in roomIds:
         roomIds.append(room)
    send(username + '(admin) has entered the room.', to=room)


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    if room not in roomIds:
         roomIds.append(room)
    
    send(username + ' has entered the room.', to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    if room in roomIds:
        leave_room(room)
        send(username + ' has left the room.', to=room)
