document.addEventListener('DOMContentLoaded', () => {
    let name = "";
    let currChannel = null;
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    function give_name() {
        name = prompt ("Please type in your name", "");
        
    }
    
    give_name();
    socket.emit("get channels")
    console.log("test")

    document.getElementById("user_name").innerHTML = name;

    function loadChat(channel) {
        document.getElementById("currChannel").innerHTML = channel;
    }

    document.querySelector ("#submit").onclick = () => {

        socket.emit('submit channel', {'channel': document.getElementById("newChannel").value})
    }
    
    document.addEventListener('keydown', function(event) {
        //console.log("pressed a key")
        if (event.keyCode === 13) {
            console.log("pressed enter")
        }
    })



    socket.on("update channel list", channelList => {
        console.log("updating list")
        console.log("channel list is :" + channelList["channelList"])
        
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
                loadChat(currChannel);
            }
            document.querySelector('#channels').append(div)  
        }
    })
    
    
})