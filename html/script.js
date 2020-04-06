var isBig = true;

var rows, cols;

var lines;
var chancesTable;
var winTable;

var ringClass;
var slotClass;
var slotStyle;

if (isBig) {
  rows = 3;
  cols = 5;

  lines = [
    [[0,0], [1,0], [2,0], [3,0], [4,0]],
    [[0,1], [1,1], [2,1], [3,1], [4,1]],
    [[0,2], [1,2], [2,2], [3,2], [4,2]],
    [[0,0], [1,1], [2,2], [3,1], [4,0]],
    [[0,2], [1,1], [2,0], [3,1], [4,2]],
  ];  

  chancesTable = [
    3,3,1,2,1,2,2
  ]

  winTable = [
    [0, 0, 3, 4, 5],
    [0, 0, 3, 4, 5],
    [0, 0, 3, 4, 5],
    [0, 0, 3, 4, 5],
    [0, 2, 3, 4, 5],
    [0, 0, 3, 4, 5],
    [0, 0, 3, 4, 5],
  ];
    
  ringClass = 'ring-big';
  slotClass = 'slot-big';
  slotStyle = 'width=72 height=72';

}

else {
  lines = [
    [[0,1], [1,1], [2,1]],
  ];  

  chancesTable = [
    3,3,1,2,1,2,2
  ]

  winTable = [
    [0, 0, 125],
    [0, 0, 250], 
    [0, 0, 1000],
    [0, 0, 500],
    [1, 5, 25],
    [0, 0, 375],
    [0, 0, 750]
  ];

  ringClass = 'ring';
  slotClass = 'slot'
  slotStyle = 'width=72 height=50'
  rows = 3;
  cols = 3;

}

var shouldAutomate = false;
var won = [0, 0, 0, 0, 0, 0, 0]

function newVals() {
  shouldAutomate = true;
  shouldPlayAudio = false;
  for (var i = 1; i <= 7; i++) {
    winTable[i-1] = document.getElementById('val' + i).value.split(',')
  }
  
  for (var i = 1; i <= 7; i++) {
    chancesTable[i-1] = parseInt(document.getElementById('p' + i).value)
  }
  togglePacanele(true, 1000)
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

    var imgID = (seed + i)% chancesTable.reduce((a,b) => a + b, 0);
    seed = getSeed();

    imgID = calcChance(imgID) + 1;
    console.log("imgID", imgID);

    slot.className = slotClass + ' fruit' + imgID;
    slot.id = id + 'id' + i;
		var content = $(slot).empty().append('<p>' + createImage(imgID) + '</p>');

		// add the poster to the row
		ring.append(slot);
	}
}

function createImage(id) {
  return '<img src="img/item' + id + '.png" ' + slotStyle + '>';
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
  console.log('REDECORATING THIS SHITHOLE', time)

  if (++time % 10 === 0 ) {
    time = 0;
    console.log('REDECORATING THIS SHITHOLE X')
    togglePacanele(true, coins)
  }
  for (var i = 1; i <= 7; i++) {
    $('#won' + i).empty().append(won[i-1]);
  }
  playAudio("seInvarte");
	for(var i = 1; i <= cols; i++) {
    var z = cols - 1;
		var oldSeed = -1;

    var oldClass = $('#ring'+i).attr('class');
		if(oldClass.length > ringClass.length) {
      oldSeed = parseInt(oldClass.slice(6+ ringClass.length));
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
      if(j>=1) {
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
			.css('animation','back-spin 0s, spin-' + seed + ' ' + (timer + i*0.3) * 0 + 's')
			.attr('class',ringClass + ' spin-' + seed);
	}
  var table = [tbl1,tbl2,tbl3,tbl4,tbl5];
  var cords = [crd1,crd2,crd3,crd4,crd5];
  var totalSum = 0;
    
  for(var k in lines) {
    var wins = 0, last = "-1", lvl = 0, lasx;
    var hitsInRow = [0, 0, 0, 0, 0, 0, 0];
    var hitPositions = [];
    var didHitLast = false;
    for(var x = 0 in lines[k]) {
      var current = table[lines[k][x][0]][lines[k][x][1]]
      console.log("current", current);
      
      if(last == current) {
        won[current - 1]++;
        hitsInRow[current - 1]++;
        if (winTable[current - 1][hitsInRow[current - 1]])
          didHitLast = true;
          hitPositions.push(x-1);
          if (hitsInRow[current-1]== 2) {
            hitPositions.push(x-2);
          }
      } else if (hitsInRow[current-1] == 1) {
        hitsInRow[current-1] += cols;
        if (didHitLast) {
          hitPositions.push(x-1);
          didHitLast = false;
        }
      } else {
        if (didHitLast) {
          hitPositions.push(x-1);
          didHitLast = false;
        }
      }
      last = current;
    }
    
    if (didHitLast) {
      hitPositions.push(cols-1);
      didHitLast = false;
    }

    console.log(hitsInRow)
    console.log(hitPositions)
    for (var c = 0; c < 7; c++) {
      if (hitsInRow[c] > cols) {
        var newVal = parseInt(hitsInRow[c] - cols);
        totalSum += parseInt(newVal * winTable[c][1]);
      } else if (hitsInRow[c]) {
        totalSum += parseInt((hitsInRow[c] ? winTable[c][hitsInRow[c]] : 0));
      }
      
    }

    if (totalSum) {
      console.log('SUM', totalSum)
        lvl = 1;
        setTimeout(playAudio, 3950, "winLine");
    }

    if(lvl > 0) {    
      for(var p in hitPositions) {
        var currentPos = hitPositions[p];
        console.log('pos', currentPos,k,cords[lines[k][currentPos][0]][lines[k][currentPos][1]])
        console.log('pos', cords)
        console.log('pos', hitPositions)
        setTimeout(setWinner, 0, cords[lines[k][currentPos][0]][lines[k][currentPos][1]], lvl);
      }
    }


  }
  if (totalSum > 0) {
    setTimeout(endWithWin, 0, totalSum, 0);
  }

  setTimeout(function(){ rolling = 0; if (shouldAutomate) pressROLL(); }, 1);
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
    $('.' + slotClass).removeClass('winner1 winner2');
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
  for (var i = 1; i <= cols; i++) {
    var ring = $('#ring' + i);
    ring.empty() 
    .removeClass()
    .addClass(ringClass)
    .removeAttr('id')
    .attr('id', 'ring' + i);
    createSlots(ring, i);
  }
  
}

function togglePacanele(start, banuti) {
  if(start == true) {
    allFile.css("display", "block");
    playAudio("pornestePacanele");
    coins = 0;
    insertCoin(banuti);

    resetRings();

    rolling = 1;
    setTimeout(function(){ rolling = 0; }, 0);
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
  for (var i = 1; i <= cols+1; i++) {
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