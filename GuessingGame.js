function generateWinningNumber(){
  return Math.floor(Math.random() * 100) + 1;
}

//Copied function
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
  if (this.playersGuess > this.winningNumber){
    return this.playersGuess - this.winningNumber;
  } else {
    return this.winningNumber - this.playersGuess;
  }
}

Game.prototype.isLower = function(){
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(n){
  if (n < 1 || n > 100 || isNaN(n)){
    throw "That is an invalid guess.";
  }
    this.playersGuess = n;
    return this.checkGuess();
}

  Game.prototype.checkGuess = function(){
    if (this.playersGuess === this.winningNumber){
      $('#hint', '#submit').prop('disabled', true);
      $('#subtitle').text('Press the Reset button to play again.');
      return "You Win!";
    } else {
        if (this.pastGuesses.indexOf(this.playersGuess) > -1){
        return "You have already guessed that number."
        } else {
          this.pastGuesses.push(this.playersGuess);
           $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        }
        if (this.pastGuesses.length === 5){
          $('#hint', '#submit').prop('disabled', true);
          $('#subtitle').text('Press the Reset button to play again.');
          return "You Lose.";
        } else {
          if (this.isLower()){
            $('#subtitle').text('Guess Higher');
          } else {
            $('#subtitle').text('Guess Lower');
          }
          if (this.difference() < 10){
            return "You're burning up!";
          } else if (this.difference() < 25){
            return "You're lukewarm.";
          } else if (this.difference() < 50){
            return "You're a bit chilly.";
          } else if (this.difference() < 100){
            return "You're ice cold!";
          }
        }
      }
  }

  function newGame(){
    return new Game();
  }

  Game.prototype.provideHint = function(){
    var arr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(arr);
  }

  function makeAGuess(game){
    var guess = $('#player-input').val();
    $('#player-input').val('');
    var output = game.playersGuessSubmission(parseInt(guess, 10));
    $('#title').text(output);
  }

  $(document).ready(function(){

    var game = new Game();

    $('#submit').on('click', function(){
      makeAGuess(game);
    });

    $('#player-input').keypress(function(e){
      if (e.which == 13){
        makeAGuess(game);
      }
    })

    $('#hint').on('click', function(){
      $('#title').text('The correct answer is one of these:');
      var hint = game.provideHint();
      $('#subtitle').text(hint);
      $('#hint').prop('disabled', true);
    })

    $('#reset').on('click', function(){
      game = newGame();
      $('#title').text('Guessing Game');
      $('#subtitle').text('Guess a number between 1 and 100');
      $('#guess').text('-');
      $('#hint', '#submit').prop('disabled', false);
    })

  })
