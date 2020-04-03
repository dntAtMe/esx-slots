var lines = [
  [[0,1], [1,1], [2,1]],
];

var chancesTable = [
  7,6,1,4,1,5,3
]

function calcChance(rolled) {
  for (var i = 0; i < chancesTable.length; i++) {
    if (rolled > 0) {
      rolled -= chancesTable[i];
    } else {
      return i;
    }
  }
  return
}

var winTable = [
  [0, 0, 1250],
  [0, 0, 2500], 
  [0, 0, 50000],
  [0, 0, 5000],
  [1000, 2500, 25000],
  [0, 0, 3750],
  [0, 0, 12500]
];

const SLOTS_PER_REEL = 12;
const REEL_RADIUS = 130;

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

    imgID = calcChance(imgID);
    console.log("imgID", imgID);

    slot.className = 'slot' + ' fruit' + imgID;
    slot.id = id + 'id' + i;
		var content = $(slot).empty().append('<p>' + createImage(imgID) + '</p>');

		// add the poster to the row
		ring.append(slot);
	}
}

function createImage(id) {
  return '<img src="img/item' + id + '.png" style="border-radius: 20px;" width=72 height=50>';
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
    for(var j = 1; j <= 5; j++) {
      pSeed += 1;
      if(pSeed == 12) {
        pSeed = 0;
      }
      if(j>=3) {
        var msg = $('#' + i + 'id' + pSeed).attr('class');
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
          case 4:
            tbl4[z] = reverseStr(msg)[0];
            crd4[z] = '#' + i + 'id' + pSeed
            break;
          case 5:
            tbl5[z] = reverseStr(msg)[0];
            crd5[z] = '#' + i + 'id' + pSeed
            break;
        }
        z -= 1;
      }
    }

		$('#ring'+i)
			.css('animation','back-spin 1s, spin-' + seed + ' ' + (timer + i*0.5) + 's')
			.attr('class','ring spin-' + seed);
	}
  var table = [tbl1,tbl2,tbl3];
  var cords = [crd1,crd2,crd3];

  for(var k in lines) {
    var wins = 0, last = "-1", lvl = 0, lasx;
    var diamondPos = -1;

    for(var x = 0 in lines[k]) {
      var current = table[lines[k][x][0]][lines[k][x][1]]
      console.log("current", current);
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
        lvl = 1;
        setTimeout(playAudio, 3950, "winLine");
        
    }

    var pos = diamondPos === -1 ? 0 : diamondPos;
    wins = diamondPos === -1 ? wins : wins - 1;
    console.log("POS", pos);
    console.log("winTable", winTable[table[lines[k][pos][0]][1]-1][wins]);
    console.log("table", table[lines[k][pos][0]][1]);
    if(lvl > 0) {
      winnings = winnings + bet * winTable[table[lines[k][pos][0]][1]-1][wins];
      setTimeout(endWithWin, 4400, winnings, 0);
    }

    var finalPos = parseInt(pos) + wins + 1
    for(var p = pos; p < finalPos; p++) {
      setTimeout(setWinner, 3200 + 0.4 * p * 1000 + 0.3 * 1000, cords[p][1], lvl);
    }
  }
  setTimeout(function(){ rolling = 0; }, 4500);
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

  createSlots($('#ring1'), 1);
  createSlots($('#ring2'), 2);
  createSlots($('#ring3'), 3);
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

$(document).ready(function() {
	allFile = $("#stage");
  createSlots($('#ring1'), 1);
 	createSlots($('#ring2'), 2);
 	createSlots($('#ring3'), 3);
  for(var i = 0; i < audioIds.length; i++) {
    audios[i] = document.createElement('audio');
    audios[i].setAttribute('src', 'audio/' + audioIds[i] + '.wav');
    audios[i].volume = 0.6;
    if(audioIds[i] == "seInvarte") {
      audios[i].volume = 0.09;
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
 });