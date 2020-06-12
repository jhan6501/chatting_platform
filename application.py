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
    print (channel["channel"])
    channelList.append(channel["channel"])
    print ("after append")
    print(channelList)
    emit("update channel list", {"channelList": channelList} ,broadcast=True)
