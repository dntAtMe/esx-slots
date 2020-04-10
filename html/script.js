var isBig = parseInt( document.currentScript.getAttribute("isBig") );

var shouldAutomate = false;
var won = [0, 0, 0, 0, 0, 0, 0]
var settings = null;

function reloadSettings() {
  if (isBig)
    settings = {
      "rows": 3,
      "cols": 5,
      "lines": [
        [[0,0], [1,0], [2,0], [3,0], [4,0]],
        [[0,1], [1,1], [2,1], [3,1], [4,1]],
        [[0,2], [1,2], [2,2], [3,2], [4,2]],
        [[0,0], [1,1], [2,2], [3,1], [4,0]],
        [[0,2], [1,1], [2,0], [3,1], [4,2]]
      ],
      "chancesTable": [
        3,3,1,2,1,2,2
      ],
      "winTable": [
        [0, 0, 3, 4, 5],
        [0, 0, 3, 4, 5],
        [0, 0, 3, 4, 5],
        [0, 0, 3, 4, 5],
        [0, 2, 3, 4, 5],
        [0, 0, 3, 4, 5],
        [0, 0, 3, 4, 5]
      ],
      "headerClass": "header-big",
      "ringClass": "ring-big",
      "slotClass": "slot-big",
      "slotStyle": "width=72 height=72",   
      "blockTimer":300 
    }
  else
    settings = {
      "rows": 3,
      "cols": 3,
      "lines": [
          [[0,1], [1,1], [2,1]],
      ],
      "chancesTable": [
          3,3,1,2,1,2,2
      ],
      "winTable": [
          [0, 0, 5],
          [0, 0, 15], 
          [0, 0, 150],
          [0, 0, 50],
          [1, 3, 10],
          [0, 0, 30],
          [0, 0, 100]
      ],
      "headerClass": "header",
      "ringClass": "ring",
      "slotClass": "slot",
      "slotStyle": "width=72 height=50",
      "blockTimer":300  
    }

  $('#header').attr('class', settings.headerClass);
}

function newVals() {
  shouldAutomate = !shouldAutomate
  shouldPlayAudio = false;
  for (var i = 1; i <= 7; i++) {
    settings.winTable[i-1] = document.getElementById('val' + i).value.split(',')
  }
  
  for (var i = 1; i <= 7; i++) {
    settings.chancesTable[i-1] = parseInt(document.getElementById('p' + i).value)
  }
  togglePacanele(true, 1000)
}

function updateVals() {
  for (var i = 1; i <= 7; i++) {
    document.getElementById('val' + i).value = settings.winTable[i-1].toString()
  }
  
  for (var i = 1; i <= 7; i++) {
    document.getElementById('p' + i).value = settings.chancesTable[i-1].toString()
  }
}


function calcChance(rolled) {
  for (var i = 0; i < settings.chancesTable.length; i++) {
    rolled -= settings.chancesTable[i];
    if (rolled <= 0) {
      return i;
    } 
  }
  return -1;
}


const SLOTS_PER_REEL = 12;
const REEL_RADIUS = 180 ;

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

    var imgID = (seed + i)% settings.chancesTable.reduce((a,b) => a + b, 0);
    seed = getSeed();

    imgID = calcChance(imgID) + 1;
    console.log("imgID", imgID);

    slot.className = settings.slotClass + ' fruit' + imgID;
    slot.id = id + 'id' + i;
		var content = $(slot).empty().append('<p>' + createImage(imgID) + '</p>');

		ring.append(slot);
	}
}

function swapSlots(ring, id) {
	var slotAngle = 360 / SLOTS_PER_REEL;
	var seed = getSeed();

	for (var i = 0; i < SLOTS_PER_REEL; i ++) {
		var slot = document.getElementById(id+'id'+i);

    var imgID = (seed + i)% settings.chancesTable.reduce((a,b) => a + b, 0);
    seed = getSeed();

    imgID = calcChance(imgID) + 1;
    console.log("imgID", imgID);

    $(slot).attr('class', settings.slotClass + ' fruit' + imgID);
		$(slot).empty().append('<p>' + createImage(imgID) + '</p>');

	}
}

function createImage(id) {
  return '<img src="img/item' + id + '.png" ' + settings.slotStyle + '>';
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

var time = 0;

function spin(timer) {
  for (var i = 1; i <= 7; i++) {
    $('#won' + i).empty().append(won[i-1]);
  }
  playAudio("seInvarte");
	for(var i = 1; i <= settings.cols; i++) {
    var z = settings.cols - 1;
		var oldSeed = -1;

    var oldClass = $('#ring'+i).attr('class');
		if(oldClass.length > settings.ringClass.length) {
      oldSeed = parseInt(oldClass.slice(6+ settings.ringClass.length));
		}
		var seed = getSeed();
		while(oldSeed == seed) {
			seed = getSeed();
		}

    var pSeed = seed
    for(var j = 1; j <= 5; j++) {
      pSeed += 1;
      if(pSeed === SLOTS_PER_REEL) {
        pSeed = 0;
      }
      // stupid hack, don't mind it
      if(j>=6-settings.cols) {
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
			.css('animation','back-spin 1s, spin-' + seed + ' ' + (timer + i*0.3) * (shouldAutomate ? 0 : 1) + 's')
      .attr('class',settings.ringClass + ' spin-' + seed);
    
  }
  var table = [tbl1,tbl2,tbl3,tbl4,tbl5];
  var cords = [crd1,crd2,crd3,crd4,crd5];
  var totalSum = 0;
  var lines = settings.lines;
  for(var k in lines) {
    var last = table[lines[k][0][0]][lines[k][0][1]], lvl = 0, lasx;
    var hitAmount= 0, hitNumber = parseInt(last);
    var hitPos = 0;
    for(var x = 1; x < lines[k].length; x++) {
      var current = table[lines[k][x][0]][lines[k][x][1]]

      if(last === current) {
        hitAmount++;
      } else if (settings.cols === 3 && current == '5') {
        hitNumber = 5;
        hitPos = x;
      }
        else {
        break;
      }
      last = current;
    }
 var doesCount = false;
    if (settings.winTable[hitNumber-1][hitAmount]) {
      won[hitNumber - 1]++;
      doesCount = true;
      totalSum += bet * parseInt(settings.winTable[hitNumber-1][hitAmount]);
    }
      


    if (doesCount) {
        lvl = 1;
        setTimeout(playAudio, 3950, "winLine");
    }

    if(lvl > 0) {    
      hitAmount = (hitPos ? hitAmount + 1 : hitAmount);
      for(var p = hitPos; p <= hitAmount; p++) {
      setTimeout(setWinner, 3200 + 0.4 * p * 1000 + 0.3 * k * 1000, cords[lines[k][p][0]][lines[k][p][1]], lvl);
      }
    }


  }
  if (totalSum > 0) {
    setTimeout(endWithWin, 2400 + settings.blockTimer * settings.cols, totalSum, 0);
  }

  setTimeout(function(){ if (shouldAutomate) pressROLL(); else rolling = 0; }, 2500 * (shouldAutomate ? 0 : 1) + settings.blockTimer * settings.cols * (shouldAutomate ? 0 : 1) + (shouldAutomate ? 10 : 0));
}

function pressROLL() {
  if(rolling == 0 || shouldAutomate) {
    if (++time % 3 === 0 ) {
      time = 0;
      swapRings();
    }
    $('.info').empty().append("Good luck!");
    if(backCoins / 2 !== coins) {
      coins = backCoins / 2;
    }
    if(backBet / 2 !== bet) {
      bet = backBet / 2;
    }

    playAudio("apasaButonul");
    $('.' + settings.slotClass).removeClass('winner1 winner2');
    if(coins >= bet && coins !== 0) {
      insertCoin(-bet);
      setTimeout(function() {
      rolling = 1;
      var timer = 2;
      spin(timer);
    }, 1)
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
  for (var i = 1; i <= settings.cols; i++) {
    var ring = $('#ring' + i);
    ring.attr('style', '');
    ring.empty();
    ring.attr('class', settings.ringClass);
    console.log("IMG ", i)
    createSlots(ring, i);
  }

  for (var i = 6; i > settings.cols; i--) {
    var ring = $('#ring' + i);
    ring.attr('style', 'opacity: 0%;');
    ring.attr('class', '');
  }
}

function swapRings() {
  for (var i = 1; i <= settings.cols; i++) {
    var ring = $('#ring' + i);
    ring.attr('class', settings.ringClass);
    swapSlots(ring, i);
  }
}

function togglePacanele(start, banuti) {
  if(start == true) {

    allFile.css("display", "block");
    playAudio("pornestePacanele");
    coins = 0;
    insertCoin(banuti);
    $('#betUp').attr('class', 'betUp ' + (settings.cols === 5 ? 'move' : '') )
    console.log("sadSDSADSADSAD")
    resetRings();
    console.log("sadSDSADSADSAD")

    rolling = 1;
    setTimeout(function(){ rolling = 0; }, 10);
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
  reloadSettings();
  allFile = $("#stage");
  
  for (var i = 1; i <= settings.cols+1; i++) {
    var ring = $('#ring' + i);

    createSlots(ring, i);
  }
  updateVals()

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
 });

  $('#update').on('click', function() {
    newVals();
  });

  $('#switch').on('click', function() {
    isBig = !isBig;
    console.log("isBig", isBig)
    reloadSettings();
    togglePacanele(true, coins)
    updateVals()

  });