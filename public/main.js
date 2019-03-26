/* ---------opens client-side socket----------*/
let socket = io.connect('http://192.168.1.7:3000');

/* ---------data to recieve from other clients
            then trigger changeColor function----------*/
socket.on('track1', changeColor);

function changeColor(data){
    if (data === 'up'){
        $('.volume_up').css('background-color', 'red');
        console.log('Got it!');
    }
}

/* ---------data to send to other clients----------*/
$('.volume_up').click(function(){
    let data = 'up';
    socket.emit('track1', data);
    console.log(data);
});
