var lines = [
  [[0,1], [1,1], [2,1]],
];

var won = [0, 0, 0, 0, 0, 0, 0]

var lines5 = [
  [[0,0], [1,0], [2,0], [3,0], [4,0]],
  [[0,1], [1,1], [2,1], [3,1], [4,1]],
  [[0,2], [1,2], [2,2], [3,2], [4,2]],
  [[0,0], [1,1], [2,2], [3,1], [4,0]],
  [[0,2], [1,1], [2,0], [3,1], [4,2]],
]

var chancesTable = [
  3,3,1,2,2,2,2
]

function newVals() {
  for (var i = 1; i <= 7; i++) {
    winTable[i-1] = document.getElementById('val' + i).value.split(',')
  }
  
  for (var i = 1; i <= 7; i++) {
    chancesTable[i-1] = parseInt(document.getElementById('p' + i).value)
  }
}

function updateVals() {
  for (var i = 1; i <= 7; i++) {
    document.getElementById('val' + i).value = winTable[i-1].toString()
  }
  
  for (var i = 1; i <= 7; i++) {
    document.getElementById('p' + i).value = chancesTable[i-1].toString()
  }
}

function calcChance(rolled) {
  for (var i = 0; i < chancesTable.length; i++) {
    rolled -= chancesTable[i];
    if (rolled <= 0) {
      return i;
    } 
  }
  return -1;
}







var winTable = [
  [0,0,5],
  [0,0,15], 
  [0,0,150],
  [0,0,50],
  [1,3,10],
  [0,0,30],
  [0,0,100]
];

const SLOTS_PER_REEL = 30;
const REEL_RADIUS = 300;

var fructe = ["", "Cirese", "Prune", "Lamai", "Portocale", "Struguri", "Pepene", "Septar"];

var audios = [];
var audioIds = [
  "changeBet",
  "pornestePacanele",
  "alarma",
  "winLine",
  "collect",
  "winDouble",
  "seInvarte",
  "apasaButonul"
];

var coins = 1000;
var bet = 1;

var backCoins = coins * 2;
var backBet = bet * 2;

var rolling = 0;

var shouldPlayAudio = true;

function playAudio(audioName) {
  if(shouldPlayAudio) {
    for(var i = 0; i < audioIds.length; i++) {
      if(audioIds[i] == audioName) {
        audios[i].play();
        
      }
    }
  }
}

function insertCoin(amount) {
  coins += amount;
  backCoins = coins * 2;
  $('.ownedCoins').empty().append(coins);
}
function setBet(amount) {
  if(amount > 0) {
    if(amount > 50) {
      amount = 1;
    }
    bet = amount;
    backBet = bet * 2;
    $('.ownedBet').empty().append(bet);
    playAudio("changeBet");
  }
}

var tbl1 = [], tbl2 = [], tbl3 = [], tbl4 = [], tbl5 = [];
var crd1 = [], crd2 = [], crd3 = [], crd4 = [], crd5 = [];

function createSlots(ring, id) {
	var slotAngle = 360 / SLOTS_PER_REEL;
	var seed = getSeed();

	for (var i = 0; i < SLOTS_PER_REEL; i ++) {
		var slot = document.createElement('div');
		var transform = 'rotateX(' + (slotAngle * i) + 'deg) translateZ(' + REEL_RADIUS + 'px)';
		slot.style.transform = transform;

    var imgID = (seed + i)% chancesTable.reduce((a,b) => a + b, 0);
    seed = getSeed();

    imgID = calcChance(imgID) + 1;
    console.log("imgID", imgID);

    slot.className = (is5 ? 'slot5' : 'slot') + ' fruit' + imgID;
    slot.id = id + 'id' + i;
		var content = $(slot).empty().append('<p>' + createImage(imgID) + '</p>');

		// add the poster to the row
		ring.append(slot);
	}
}

function createImage(id) {
  var size = (is5 ? 'width=52 height=40' : 'width=72 height=50');
  return '<img src="img/item' + id + '.png" style="border-radius: 20px;" ' + size + '>';
}

function getSeed() {
	return Math.floor(Math.random()*(SLOTS_PER_REEL));
}

function setWinner(cls, level) {
  if(level >= 1) {
    var cl = (level == 1) ? 'winner1' : 'winner2';
    $(cls).addClass(cl);
  }
}

function reverseStr(str) {
  return str.split("").reverse().join("");
}

var canDouble = 0;
var colorHistory = [-1];

var dubleDate = 0;

function endWithWin(x, sound) {
  $('.info').empty().append('Won $' + x);

  if(sound == 1) { // WinAtDouble
    playAudio("winDouble");
    dubleDate++;
    if(dubleDate >= 4) {
      pressROLL();
    }
  }

  canDouble = x;
  
  if( canDouble ) {
    setTimeout(insertCoin, 200, canDouble);
    playAudio("collect");
    looseDouble();
  }

}

function looseDouble() {
  canDouble = 0;
  dubleDate = 0;
}

function spin(timer) {
  for (var i = 1; i <= 7; i++) {
    $('#won' + i).empty().append(won[i-1]);
  }
  var winnings = 0, backWinnings = 0;
  playAudio("seInvarte");
	for(var i = 1; i < 4; i ++) {
    var z = 2;
		var oldSeed = -1;

		var oldClass = $('#ring'+i).attr('class');
		if(oldClass.length > 4) {
			oldSeed = parseInt(oldClass.slice(10));
		}
		var seed = getSeed();
		while(oldSeed == seed) {
			seed = getSeed();
		}

    var pSeed = seed
    for(var j = 1; j <= 12; j++) {
      console.log("j", j)
      pSeed += 1;
      if(pSeed == 30) {
        pSeed = 0;
      }
      if(j>=9) {
        var msg = $('#' + i + 'id' + pSeed).attr('class');
        console.log(msg)
        console.log('#' + i + 'id' + pSeed)
        switch(i) {
          case 1:
            tbl1[z] = reverseStr(msg)[0];
            crd1[z] = '#' + i + 'id' + pSeed
            break;
          case 2:
            tbl2[z] = reverseStr(msg)[0];
            crd2[z] = '#' + i + 'id' + pSeed
            break;
          case 3:
            tbl3[z] = reverseStr(msg)[0];
            crd3[z] = '#' + i + 'id' + pSeed
            break;
        }
        z -= 1;
      }
    }

		$('#ring'+i)
			.css('animation','back-spin 0s, spin-' + seed + ' ' + (timer - timer + i*0.0) + 's')
			.attr('class','ring spin-' + seed);
	}
  var table = [tbl1,tbl2,tbl3];
  var cords = [crd1,crd2,crd3];

  for(var k in lines) {
    var wins = 0, last = "-1", lvl = 0, lasx;
    var diamondPos = -1;

    for(var x in lines[k]) {
      console.log(table)
      console.log(cords)
      var current = table[lines[k][x][0]][lines[k][x][1]]
      var currentCoords = cords[lines[k][x][0]][lines[k][x][1]]
      console.log("current", current);
      console.log("current", currentCoords);
      console.log("last", last);
      console.log("wins", wins);
      if (current === "5" && diamondPos === -1) {
        wins = 1;
        diamondPos = x;
      }
      if (last === "5" && current !== "5") {
        break;
      }
      if(last == current) {
        wins++;

      }
      last = current;
    }

    if (wins === 2 || diamondPos != -1) {
        won[last-1]++;
        lvl = 1;
        setTimeout(playAudio, 3950, "winLine");
        
    }

    var pos = diamondPos === -1 ? 0 : diamondPos;
    wins = diamondPos === -1 ? wins : wins - 1;
    if(lvl > 0) {
      winnings = winnings + bet * winTable[table[lines[k][pos][0]][1]-1][wins];
      setTimeout(endWithWin, 0, winnings, 0);
    }

    var finalPos = parseInt(pos) + wins + 1
    for(var p = pos; p < finalPos; p++) {
      setTimeout(setWinner, 0, cords[p][1], lvl);
    }
  }
  setTimeout(function(){ rolling = 0; pressROLL();}, 0);
}

function pressROLL() {
  if(rolling == 0) {
    $('.info').empty().append("Good luck!");
    if(backCoins / 2 !== coins) {
      coins = backCoins / 2;
    }
    if(backBet / 2 !== bet) {
      bet = backBet / 2;
    }

    playAudio("apasaButonul");
    $('.slot').removeClass('winner1 winner2');
    if(coins >= bet && coins !== 0) {
      insertCoin(-bet);

      rolling = 1;
      var timer = 2;
      spin(timer);
    } else if(bet != coins && bet != 1) {
      setBet(coins);
    }
    
  }
}

function pressAUDIO() {
  shouldPlayAudio = !shouldPlayAudio;
  $('#sounds').removeAttr('class');
  $('#sounds').attr('class', shouldPlayAudio ? 'soundsOn' : 'soundsOff');
}

function pressALL() {
    setBet((coins > 50 ? 50 : coins));
}

function pressBLACK() {
    setBet(bet - 1);
}

function pressRED() {
    setBet(bet + 1);
}

var allFile;

function resetRings() {
  var rng1 = $("#ring1"),
      rng2 = $("#ring2"),
      rng3 = $("#ring3")
      rng3 = $("#ring4")

  rng1.empty() 
    .removeClass()
    .addClass("ring")
    .removeAttr('id')
    .attr('id', 'ring1');

  rng2.empty()
    .removeClass()
    .addClass("ring")
    .removeAttr('id')
    .attr('id', 'ring2');

    rng3.empty()
    .removeClass()
    .addClass("ring")
    .removeAttr('id')
    .attr('id', 'ring3');

    rng4.empty()
    .removeClass()
    .addClass("ring")
    .removeAttr('id')
    .attr('id', 'ring4');

  createSlots($('#ring1'), 1);
  createSlots($('#ring2'), 2);
  createSlots($('#ring3'), 3);
  createSlots($('#ring4'), 4);
}

function togglePacanele(start, banuti) {
  if(start == true) {
    allFile.css("display", "block");
    playAudio("pornestePacanele");
    coins = 0;
    insertCoin(banuti);

    resetRings();

    rolling = 1;
    setTimeout(function(){ rolling = 0; }, 4000);
  } else {
    allFile.css("display", "none");
    $.post("http://esx_slots/exitWith", JSON.stringify({
      coinAmount: backCoins / 2
    }));
    insertCoin(-coins); // Scoate toti banii din aparat
  }
}

window.addEventListener('message', function(event) {
  if(event.data.showPacanele == "open") {
    var introdusi = event.data.coinAmount;
    togglePacanele(true, introdusi);
  }
});

var is5 = false;

$(document).ready(function() {
  is5 = false;
  shouldPlayAudio = false;
  updateVals()
	allFile = $("#stage");
  createSlots($('#ring1'), 1);
 	createSlots($('#ring2'), 2);
 	createSlots($('#ring3'), 3);
   createSlots($('#ring4'), 4);
   if (is5) {
    createSlots($('#ring5'), 5);
    createSlots($('#ring6'), 6);
  }
  for(var i = 0; i < audioIds.length; i++) {
    audios[i] = document.createElement('audio');
    audios[i].setAttribute('src', 'audio/' + audioIds[i] + '.wav');
    audios[i].volume = 0.6;
    if(audioIds[i] == "seInvarte") {
      audios[i].id = 'rollingAudio';
      audios[i].volume = 0.09;
      audios[i].addEventListener("timeupdate", function () {
        if (this.currentTime >= 3.5) { this.pause();  this.currentTime = 0; }
      }); 
    }
  }
  
  $('.dblOrNothing').hide();

  $('.ownedCoins').empty().append(coins);
  $('.ownedBet').empty().append(bet);

  $('body').keyup(function(e){
    $(':focus').blur();
    switch (e.keyCode) {
      case 32: pressROLL(); // space
        break;
      case 13: pressROLL(); // enter
        break;
      case 39: pressALL(); // right-arrow
        break;
      case 38: setBet(bet + 1); // creste BET
        break;
      case 40: setBet(bet - 1); // scade BET
        break;
      case 27: togglePacanele(false, 0); // ESC
        break;
      case 80: togglePacanele(false, 0); // P - Pause Menu
        break;
    }
  });

  $('#betUp').on('click', function(){ // RED
    pressRED();
  })

  $('#sounds').on('click', function(){ // BLACK
    pressAUDIO();
  }) 
  
  $('.allIn').on('click', function(){ // BLACK
    pressALL();
  })

 	$('.go').on('click',function(){ // COLLECT
    pressROLL();
   })
   
   $('#update').on('click', function() {
     newVals();
   })
 });