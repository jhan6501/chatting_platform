document.addEventListener('DOMContentLoaded', () => {
    let currChannel = null;
    let socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    let name = ""
    function give_name() {
        name = prompt ("Please type in your name", "");
        
    }

    function clearMessageBoard(channel, name) {
        console.log("clearing")
        document.getElementById("messages").innerHTML = "";
    }

    function loadChat(channel, name) {
        console.log("trying to load a channel")
        console.log("input name is:" + name)
        console.log("the text name is: " + document.getElementById("user_name").innerHTML)
        console.log("loading the chat")
        socket.emit("get messages", {"channel": channel, "name": name})
        
    }
    
    function loadChannels() {
        socket.emit("get channels")
    }

    function appendMessage(userMessage, currentChannel, speaker){
        
        console.log("appending a message")
        
        textToAdd = document.getElementById("user_name").innerHTML + ": "+ userMessage
        socket.emit('add message', {'message': textToAdd, 'channel': currentChannel, 'speaker': speaker})
    }

    give_name();
    
    loadChannels();

    document.getElementById("user_name").innerHTML = name;

    
    document.querySelector ("#submit").onclick = () => {
        console.log("adding a channel")
        socket.emit('submit channel', {'channel': document.getElementById("newChannel").value})
    }
    
    document.addEventListener('keydown', function(event) {
        //console.log("pressed a key")
        if (event.keyCode === 13) {
            let node = document.getElementById("userMessage")
            text = node.value;
            containsNonSpace = false;
            for (let i = 0; i < text.length; i++) {
                console.log("in loop")
                char = text.charAt(i)
                
                if (char != " ") {
                    containsNonSpace = true
                }
            }

            console.log("the person who tried to puta message is:" + document.getElementById("user_name").innerHTML)

            if (containsNonSpace && currChannel != null) {
                appendMessage(text, currChannel, document.getElementById("user_name").innerHTML)
            }
        }
    })

    socket.on("update channel list", channelList => {
        channels = document.getElementById("channels")
        channels.innerHTML = "";

        for (let i = 0; i < channelList["channelList"].length; i++) {
            let iChannel = channelList["channelList"][i];
            let div = document.createElement('div')
            div.className = 'channel'
            div.innerHTML = iChannel

            div.onclick = () => {
                currChannel = iChannel
                console.log("iChannel is:" + iChannel)
                clearMessageBoard(currChannel, document.getElementById("user_name").innerHTML)
                document.getElementById("currChannel").innerHTML = currChannel
                loadChat(currChannel, document.getElementById("user_name").innerHTML)
            }
            document.querySelector('#channels').append(div)  
        }
    })

    socket.on("load chat", data => {
        channel = data["channel"]
        message = data["messages"]
        name = data["name"]
        console.log("name is: " + name)
        console.log("displayed name is:" + document.getElementById("user_name").innerHTML)
            
        console.log(message)
        for (let i = 0; i < message.length; i++) {
            currMessage = message[i][0];
            speaker = message[i][1]
            let lineBox = document.createElement('div')
            lineBox.className = 'line'
            let div = document.createElement('div')
            if (speaker === document.getElementById("user_name").innerHTML) {
                div.className = 'chatMessageUser'
            } else {
                div.className = 'chatMessageOther'
            }
            div.innerHTML = currMessage
            lineBox.append(div)
            document.querySelector('#messages').append(lineBox)
        }
    })

    socket.on("display appended message", data => {
        console.log("displaying")
        textToAdd = data["message"]
        speaker = data["speaker"]
        if (currChannel === document.getElementById("currChannel").innerHTML) {
            let lineBox = document.createElement('div')
            lineBox.className = 'line'
            let messageToAdd = document.createElement('div')
            if (speaker === document.getElementById("user_name").innerHTML) {
                messageToAdd.className = 'chatMessageUser'
                console.log("user message")
            } else {
                messageToAdd.className = 'chatMessageOther'
                console.log("other message")
            }
            messageToAdd.innerHTML = textToAdd
            lineBox.append(messageToAdd)
            document.querySelector('#messages').append(lineBox)  
        }
    })
    
})