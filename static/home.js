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

    function appendMessage(userMessage, currentChannel){
        
        console.log("appending a message")
        
        textToAdd = document.getElementById("user_name").innerHTML + ": "+ userMessage
        socket.emit('add message', {'message': textToAdd, 'channel': currentChannel})
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
                appendMessage(text, currChannel)
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
            currMessage = message[i];
            let div = document.createElement('div')
            div.className = 'chatMessage'
            div.innerHTML = currMessage

            document.querySelector('#messages').append(div)
        }
    })

    socket.on("display appended message", data => {
        console.log("displaying")
        textToAdd = data["message"]
        if (currChannel === document.getElementById("currChannel").innerHTML) {
            let messageToAdd = document.createElement('div')
            messageToAdd.className = 'chatMessage'
            messageToAdd.innerHTML = textToAdd
            document.querySelector('#messages').append(messageToAdd)  
        }
    })
    
})