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
    channelList.append(channel["channel"])
    Channels[channel["channel"]] = [] 
    emit("update channel list", {"channelList": channelList} ,broadcast=True)

@socketio.on("get channels")
def giveChannels():
    emit ("update channel list", {"channelList": channelList} ,broadcast=True)

@socketio.on("add message")
def addmessage(data):
    message = data["message"]
    channelToAdd = data["channel"]
    Channels[channelToAdd].append(message)
    
    