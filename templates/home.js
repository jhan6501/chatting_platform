document.addEventListener('DOMContentLoaded', () => {
    let name = "";
    function give_name() {
        name = prompt ("Please type in your name", "");
        
    }

    give_name();
    console.log(name);
    document.getElementById("user_name").innerHTML = name;

    document.querySelector ("#submit").onclick = () => {
        const channel = document.createElement('div');
        channel.className = 'channel'
        channel.innerHTML = document.getElementById("newChannel").value

        channel.onclick = () => {
            console.log(channel.innerHTML)
        }
        document.querySelector('#channels').append(channel)
    }
    
})