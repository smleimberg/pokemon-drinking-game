var hard = {
    "stop":[
    {   "name":"Pallet Town",
        "space":0
    },{ "name":"Pewter Gym",
        "space":6
    },{ "name":"Cerulean Gym",
        "space":13
    },{ "name":"Vermilion Gym",
        "space":19
    },{ "name":"Celadon Gym",
        "space":32
    },{ "name":"Saffron Gym",
        "space":43
    },{ "name":"Fuchsia Gym",
        "space":52
    },{ "name":"Cinnabar Gym",
        "space":58
    },{ "name":"Viridian Gym",
        "space":63
    },{ "name":"Legendary Birds",
        "space":68
    },{ "name":"The Elite Four",
        "space":69
    },{ "name":"Champion Gary",
        "space":70
    },{ "name":"POKEMON MASTER!",
        "space":71
    }],
    "strong":{
        "squirtle":"charmander",
        "charmander":"bulbasaur",
        "bulbasaur":"squirtle",
        "pikachu":"squirtle"
    },
    "token":{
        "squirtle":"#00BFFF",
        "charmander":"#FF8C00",
        "bulbasaur":"#32CD32",
        "pikachu":"#FFD700"
    },
    "maxPlayers":9,
    "gameStart":false
};



//Startup
for(i=0;i<hard.maxPlayers;i++){
    $('#formTable').append(
        '<tr>'+
            '<td><input type="text" class="pname" id="player_'+i+'" name="player_'+i+'"></input></td>'+
            '<td><select class="pstarter" id="starter_'+i+'" name="starter_'+i+'">'+
                '<option></option>'+
                '<option value="squirtle">Squirtle</option>'+
                '<option value="charmander">Charmander</option>'+
                '<option value="bulbasaur">Bulbasaur</option>'+
            '</select></td>'+
        '</tr>'
    );
}
impress().goto(0);
var json = {
    players:[],
    selectedPlayer:0   
};
var spaceCount = $('.space').length;
var preSpaceCount = 3;
$('#menu').css('display','none');

$("#form").submit(function(event){
    event.preventDefault();
    var count=0;
    for(i=0;i<hard.maxPlayers;i++){
        if($('#player_'+i).val().trim()!=""){
            if($('#starter_'+i).val().trim()!=""){
                json.players[count]={};
                json.players[count].name=$('#player_'+i).val().trim();
                json.players[count].token=$('#starter_'+i).val().trim();
                json.players[count].space=0;
                count++;
            }else{
                alert("You must select a starter Pokemon for "+$('#player_'+i).val().trim());
                return false;
            }
        }
    }
    $('#start').css('display','none');
    $('#menu').css('display','block');
    playerName(0);
    impress().goto(2);
    for(i=0;i<json.players.length;i++){
        placeToken(i,i);
    }
    hard.gameStart=true;
    return false;
});


//Functions
function nextHardStop(num){
    var cspace = parseInt(json.players[num].space, 10);
    for(i=0;i<hard.stop.length;i++){
        var hardStop=parseInt(hard.stop[i].space, 10);
        if(cspace>=hardStop && cspace<parseInt(hard.stop[i+1].space, 10)){
            console.log(parseInt(hard.stop[i+1].space, 10));
            return parseInt(hard.stop[i+1].space, 10);
        }
    }
    return 71;
}

function d6(){
    return 1 + Math.floor(Math.random() * 6);
}

function roll(){
    for(i=1;i<10;i++){
        setTimeout(function() {
            $('#move').val(d6());
        }, (i*50));
    }
    echo("");
}

function checkSpecial(num){
    if(json.players[num].space==4){
        json.players[num].token="pikachu";
        setTimeout(function() {
            placeToken(num,battle(json.selectedPlayer,json.players[json.selectedPlayer].space).length);
        }, 1500);
    }if(json.players[num].space==71){
        alert("Game Over!\n"+json.players[num].name+" wins!");
    }
}

function battle(pl,sp){
    var count=0;
    var trainers = new Array();
    for(i=0;i<json.players.length;i++){
        if(json.players[i].space==sp && sp!=0 && pl!=i){
            trainers[count]=i;
            count++;
        }
    }
    if(count>0){
        return trainers;
    }else{
        return new Array();
    }
}

function go(){
    if($("#move").val()!=""){
        var move = parseInt($("#move").val(), 10);
        var currentSpace = parseInt(json.players[json.selectedPlayer].space, 10);
        var thisHardStop = nextHardStop(json.selectedPlayer);
        if((currentSpace+move)>=thisHardStop){
            json.players[json.selectedPlayer].space=thisHardStop;
        }else{
            if((currentSpace+move)<0){
                json.players[json.selectedPlayer].space=0;
            }else{
                json.players[json.selectedPlayer].space=currentSpace+move;
            }
            
        }
        placeToken(json.selectedPlayer,battle(json.selectedPlayer,json.players[json.selectedPlayer].space).length);
        playerName(json.selectedPlayer);
        checkSpecial(json.selectedPlayer);  
        playerName(json.selectedPlayer);
        if(battle(json.selectedPlayer,json.players[json.selectedPlayer].space).length>0){
            //echo('Battle!');
        }
        $('#move').val('');
    }
}

function echo(out){
    $('#console').html(out);
}

function playerName(num){
    $('#selectedPlayerName').html(json.players[num].name);
    impress().goto(parseInt(json.players[num].space, 10)+preSpaceCount);
}

function placeToken(num,pos){
    $('#token_'+num).remove();
    if(pos==3 || pos==6){
        $('#s'+json.players[num].space).append('<br/>');
    }
    $('#s'+json.players[num].space).append('<div id="token_'+num+'" class="token"><span>'+json.players[num].name+'</span></div>');
    $('#token_'+num).css('background',hard.token[json.players[num].token]);    
}

function selectNextPlayer(shift) {
    var playerNum = ( (json.selectedPlayer + shift) % json.players.length);
    if(playerNum<0){
        playerNum = json.players.length+playerNum;
    }
    playerName(playerNum);
    json.selectedPlayer = playerNum;
}
$(window).keydown(function(e) {
    //81=q 87=w e=69 r=82 a=65 s=83 d=68
    if(hard.gameStart==true){
        switch(e.keyCode){
        case 65: //a=left
            selectNextPlayer(-1);
            break;
        case 68: //d=right
            selectNextPlayer(1); 
            break;
        case 81: //q=overview
            impress().goto(0);
            break;
        case 69: //e=Roll
            roll();
            break;
        case 83: //s=Show Current Player
            playerName(json.selectedPlayer)
            break;
        case 87: //w=go
            go();
            break;
        default:
        }
    }
});

