document.addEventListener('DOMContentLoaded', () => {
    let name = "";
    let currChannel = null;
    let socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    function give_name() {
        name = prompt ("Please type in your name", "");
        
    }
    
    function loadChat(channel) {
        document.getElementById("currChannel").innerHTML = channel;
    }
    
    function loadChannels() {
        socket.emit("get channels")
    }

    function appendMessage(userMessage, currentChannel, name){
        textToAdd = name + ": "+ userMessage
        socket.emit('add message', {'message': textToAdd, 'channel': currentChannel})

        let messageToAdd = document.createElement('div')
        messageToAdd.className = 'chatMessage'
        messageToAdd.innerHTML = textToAdd
        document.querySelector('#messages').append(messageToAdd)  


    }

    give_name();
    
    loadChannels();

    document.getElementById("user_name").innerHTML = name;

    
    document.querySelector ("#submit").onclick = () => {
        socket.emit('submit channel', {'channel': document.getElementById("newChannel").value})
    }
    
    document.addEventListener('keydown', function(event) {
        //console.log("pressed a key")
        if (event.keyCode === 13) {
            let node = document.getElementById("userMessage")
            console.log("node is:" + node)
            text = node.value;
            console.log("text is:" + text)
            containsNonSpace = false;
            console.log("text length is:" + text.length)
            for (let i = 0; i < text.length; i++) {
                console.log("in loop")
                char = text.charAt(i)
                
                if (char != " ") {
                    containsNonSpace = true
                }
            }
            console.log(containsNonSpace)
            if (containsNonSpace && currChannel != null) {
                console.log("appending a message")
                appendMessage(text, currChannel, name)
            }
        }
    })

    socket.on("update channel list", channelList => {
        channels = document.getElementById("channels")
        channels.innerHTML = "";

        for (let i = 0; i < channelList["channelList"].length; i++) {
            iChannel = channelList["channelList"][i];
            let div = document.createElement('div')
            div.className = 'channel'
            div.innerHTML = iChannel

            div.onclick = () => {
                console.log("testing")
                console.log(div.innerHTML)
                currChannel = iChannel
                document.getElementById("currChannel").innerHTML = currChannel
                loadChat(currChannel);
            }
            document.querySelector('#channels').append(div)  
        }
    })
    
    
    
})