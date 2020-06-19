import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channelList = []
Channels = {}

@app.route("/")
def index():
    return render_template("home.html")

@socketio.on("submit channel")
def addChannel(channel):
    
    if (not (channel["channel"] in channelList)):
        channelList.append(channel["channel"])
        Channels[channel["channel"]] = [] 
        print ("this is a really big print statement so I dont miss anytihng")
        print ("added a channel in backend")
        print(channel)
        emit("update channel list", {"channelList": channelList} ,broadcast=True)
    

@socketio.on("get channels")
def giveChannels():
    emit ("update channel list", {"channelList": channelList} ,broadcast=True)

@socketio.on("add message")
def addmessage(data):
    message = data["message"]
    speaker = data["speaker"]
    channelToAdd = data["channel"]
    Channels[channelToAdd].append((message,speaker))
    emit ("display appended message", {"message": message, "speaker": speaker}, broadcast = True)
    
@socketio.on("get messages")
def getMessages(data):
    channel = data["channel"]
    messages = Channels.get(channel)
    name = data["name"]
    emit ("load chat", {"messages": messages, "channel": channel, "name": name})
    