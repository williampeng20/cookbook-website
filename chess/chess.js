function load() {
    myGameArea.start();
}

function restart() {
  myGameArea.board = [
    [new Rook('black', 0, 0), new Knight('black', 0, 1), new Bishop('black', 0, 2), new Queen('black', 0, 3), new King('black', 0, 4), new Bishop('black', 0, 5), new Knight('black', 0, 6), new Rook('black', 0, 7)],
    [new Pawn('black', 1, 0), new Pawn('black', 1, 1), new Pawn('black', 1, 2), new Pawn('black', 1, 3), new Pawn('black', 1, 4), new Pawn('black', 1, 5), new Pawn('black', 1, 6), new Pawn('black', 1, 7)],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [new Pawn('white', 6, 0), new Pawn('white', 6, 1), new Pawn('white', 6, 2), new Pawn('white', 6, 3), new Pawn('white', 6, 4), new Pawn('white', 6, 5), new Pawn('white', 6, 6), new Pawn('white', 6, 7)],
    [new Rook('white', 7, 0), new Knight('white', 7, 1), new Bishop('white', 7, 2), new Queen('white', 7, 3), new King('white', 7, 4), new Bishop('white', 7, 5), new Knight('white', 7, 6), new Rook('white', 7, 7)],
  ];
  myGameArea.turn = 'begin';
  myGameArea.turn_num = 1;
  myGameArea.selected = null;
  myGameArea.options = [];
  //En Passant information
  myGameArea.en_passant = [];
  myGameArea.available_to_en_passant = [null, null];
  // King information
  myGameArea.checkmate = false;
  myGameArea.king_position = {'white' : [7,4], 'black' : [0,4]};
  myGameArea.check_positions = [];

  myGameArea.update();

  //Timer
  setDifficulty();
  myGameArea.timer = white_timer;
}

function setDifficulty() {
  myGameArea.timer.pause();
  var difficulty = document.getElementById('difficulty_select').value;
  if (difficulty == 'easy') {
    white_timer.reset(150);
    black_timer.reset(150);
  } else if (difficulty == 'medium') {
    white_timer.reset(90);
    black_timer.reset(90);
  } else if (difficulty == 'hard') {
    white_timer.reset(30);
    black_timer.reset(30);
  }
}

var debug_col = {
  0 : 'A',
  1 : 'B',
  2 : 'C',
  3 : 'D',
  4 : 'E',
  5 : 'F',
  6 : 'G',
  7 : 'H',
};

var debug_row = {
  0 : 8,
  1 : 7,
  2 : 6,
  3 : 5,
  4 : 4,
  5 : 3,
  6 : 2,
  7 : 1,
};

class ChessPiece {
  constructor(color, r, c) {
    this.color = color;
    this.r = r;
    this.c = c;
  }

  document_move(r_new, c_new) {
    console.log(debug_col[this.c], debug_row[this.r], "->", debug_col[c_new], debug_row[r_new]);
  }
}

class Pawn extends ChessPiece {
  constructor(color, r, c) {
    super(color, r, c);
    this.type = 'pawn';
    this.image;
    if (color == 'white') {
      this.image = document.getElementById('white_pawn');
      this.direction = -1;
    } else {
      this.image = document.getElementById('black_pawn');
      this.direction = 1;
    }
    this.moved = false;
  }

  getLegalMoves() {
    var options = [];
    var en_passant = [];
    // Travel Move
    if (myGameArea.onBoard(this.r+this.direction, this.c) && myGameArea.board[this.r+this.direction][this.c] == null) {
      options.push([this.r+this.direction, this.c]);
    }
    if (!this.moved && myGameArea.board[this.r+(2*this.direction)][this.c] == null && myGameArea.board[this.r+this.direction][this.c] == null) {
      options.push([this.r+(2*this.direction), this.c]);
    }
    // Attach Move
    if (myGameArea.onBoard(this.r+this.direction, this.c - 1) && myGameArea.board[this.r+this.direction][this.c - 1] != null
     && myGameArea.board[this.r+this.direction][this.c - 1].color != this.color) {
      options.push([this.r+this.direction, this.c - 1]);
    }
    if (myGameArea.onBoard(this.r+this.direction, this.c + 1) && myGameArea.board[this.r+this.direction][this.c + 1] != null
     && myGameArea.board[this.r+this.direction][this.c + 1].color != this.color) {
      options.push([this.r+this.direction, this.c + 1]);
    }
    // En Passant Move
    if (myGameArea.available_to_en_passant[0] == this.r && myGameArea.available_to_en_passant[1] == this.c-1
     && myGameArea.onBoard(this.r+this.direction, this.c - 1) && myGameArea.board[this.r+this.direction][this.c - 1] == null
     && myGameArea.board[this.r][this.c - 1] != null && myGameArea.board[this.r][this.c - 1].color != this.color) {
      options.push([this.r+this.direction, this.c - 1]);
      en_passant.push([this.r+this.direction, this.c - 1]);
    }
    if (myGameArea.available_to_en_passant[0] == this.r && myGameArea.available_to_en_passant[1] == this.c+1
     &&myGameArea.onBoard(this.r+this.direction, this.c + 1) && myGameArea.board[this.r+this.direction][this.c + 1] == null
     && myGameArea.board[this.r][this.c + 1] != null && myGameArea.board[this.r][this.c + 1].color != this.color) {
      options.push([this.r+this.direction, this.c + 1]);
      en_passant.push([this.r+this.direction, this.c + 1]);
    }
    myGameArea.options = options;
    myGameArea.en_passant = en_passant;
  }

  move(r_new, c_new) {
    this.document_move(r_new, c_new);
    this.moved = true;
    var enemy_color = this.color == 'white' ? 'black' : 'white';
    if (r_new == myGameArea.king_position[enemy_color][0] && c_new == myGameArea.king_position[enemy_color][1]) {
      myGameArea.checkmate = true;
    }
    myGameArea.board[r_new][c_new] = myGameArea.board[this.r][this.c];
    myGameArea.board[this.r][this.c] = null;

    if (myGameArea.inEnPassant([r_new, c_new])) {
      myGameArea.board[r_new - this.direction][c_new] = null;
    }

    if (Math.abs(r_new - this.r) == 2) {
      myGameArea.available_to_en_passant = [r_new, c_new];
    }


    this.r = r_new;
    this.c = c_new;
    // Pawn Promotion
    if ((this.color == 'white' && this.r == 0) || (this.color == 'black' && this.r == 7)) {
      var promoted_piece = prompt('Pawn Promotion!\nChoose your new piece (Queen, Knight, Bishop, Rook):', "Queen");
      if (promoted_piece == null || promoted_piece == "" || promoted_piece == "Queen" || promoted_piece == "queen") {
        myGameArea.board[this.r][this.c] = new Queen(this.color, this.r, this.c);
      } else if (promoted_piece == "Knight" || promoted_piece == "knight") {
        myGameArea.board[this.r][this.c] = new Knight(this.color, this.r, this.c);
      } else if (promoted_piece == "Bishop" || promoted_piece == "bishop") {
        myGameArea.board[this.r][this.c] = new Bishop(this.color, this.r, this.c);
      } else if (promoted_piece == "Rook" || promoted_piece == "Rook") {
        myGameArea.board[this.r][this.c] = new Rook(this.color, this.r, this.c);
      }
    }

    if (!myGameArea.checkmate) {
      myGameArea.check(this.color);
    }
    myGameArea.newTurn();
  }
}

class Rook extends ChessPiece {
  constructor(color, r, c) {
    super(color, r, c);
    this.type = 'rook';
    this.image;
    if (color == 'white') {
      this.image = document.getElementById('white_rook');
    } else {
      this.image = document.getElementById('black_rook');
    }
    this.moved = false;
  }

  getLegalMoves() {
    var options = [];
    var ints = [-1, 0, 1];

    for (var a = 0; a < ints.length; a++) {
      var i = ints[a];
      for (var b = 0; b < ints.length; b++) {
        var j = ints[b];
        if ((i == 0 || j == 0) && i != j) {
          for (var k = 1; k < 8; k++) {
            if (myGameArea.onBoard(this.r+i*k, this.c+j*k) && myGameArea.board[this.r+i*k][this.c+j*k] == null) {
              options.push([this.r+i*k, this.c+j*k]);
            } else if (myGameArea.onBoard(this.r+i*k, this.c+j*k) && myGameArea.board[this.r+i*k][this.c+j*k] != null
             && myGameArea.board[this.r+i*k][this.c+j*k].color != this.color) {
              options.push([this.r+i*k, this.c+j*k]);
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    myGameArea.options = options;
  }

  move(r_new, c_new) {
    this.document_move(r_new, c_new);
    this.moved = true;
    var enemy_color = this.color == 'white' ? 'black' : 'white';
    if (r_new == myGameArea.king_position[enemy_color][0] && c_new == myGameArea.king_position[enemy_color][1]) {
      myGameArea.checkmate = true;
    }
    myGameArea.board[r_new][c_new] = myGameArea.board[this.r][this.c];
    myGameArea.board[this.r][this.c] = null;

    this.r = r_new;
    this.c = c_new;

    if (!myGameArea.checkmate) {
      myGameArea.check(this.color);
    }
    myGameArea.newTurn();
  }
}

class Knight extends ChessPiece {
  constructor(color, r, c) {
    super(color, r, c);
    this.type = 'knight';
    this.image;
    if (color == 'white') {
      this.image = document.getElementById('white_knight');
    } else {
      this.image = document.getElementById('black_knight');
    }
  }

  getLegalMoves() {
    var options = [];
    var moves = [
      [2,1],
      [2,-1],
      [-2,1],
      [-2,-1],
      [1,2],
      [1,-2],
      [-1,2],
      [-1,-2],
    ];

    for (var i = 0; i < moves.length; i++) {
      if (myGameArea.onBoard(this.r+moves[i][0], this.c+moves[i][1]) &&
       (myGameArea.board[this.r+moves[i][0]][this.c+moves[i][1]] == null || myGameArea.board[this.r+moves[i][0]][this.c+moves[i][1]].color != this.color)) {
        options.push([this.r+moves[i][0], this.c+moves[i][1]]);
      }
    }

    myGameArea.options = options;
  }

  move(r_new, c_new) {
    this.document_move(r_new, c_new);
    var enemy_color = this.color == 'white' ? 'black' : 'white';
    if (r_new == myGameArea.king_position[enemy_color][0] && c_new == myGameArea.king_position[enemy_color][1]) {
      myGameArea.checkmate = true;
    }
    myGameArea.board[r_new][c_new] = myGameArea.board[this.r][this.c];
    myGameArea.board[this.r][this.c] = null;

    this.r = r_new;
    this.c = c_new;

    if (!myGameArea.checkmate) {
      myGameArea.check(this.color);
    }
    myGameArea.newTurn();
  }
}

class Bishop extends ChessPiece {
  constructor(color, r, c) {
    super(color, r, c);
    this.type = 'bishop';
    this.image;
    if (color == 'white') {
      this.image = document.getElementById('white_bishop');
    } else {
      this.image = document.getElementById('black_bishop');
    }
  }

  getLegalMoves() {
    var options = [];
    var ints = [-1, 1];

    for (var a = 0; a < ints.length; a++) {
      var i = ints[a];
      for (var b = 0; b < ints.length; b++) {
        var j = ints[b];
        for (var k = 1; k < 8; k++) {
          if (myGameArea.onBoard(this.r+i*k, this.c+j*k) && myGameArea.board[this.r+i*k][this.c+j*k] == null) {
            options.push([this.r+i*k, this.c+j*k]);
          } else if (myGameArea.onBoard(this.r+i*k, this.c+j*k) && myGameArea.board[this.r+i*k][this.c+j*k] != null
           && myGameArea.board[this.r+i*k][this.c+j*k].color != this.color) {
            options.push([this.r+i*k, this.c+j*k]);
            break;
          } else {
            break;
          }
        }
      }
    }
    myGameArea.options = options;
  }

  move(r_new, c_new) {
    this.document_move(r_new, c_new);
    var enemy_color = this.color == 'white' ? 'black' : 'white';
    if (r_new == myGameArea.king_position[enemy_color][0] && c_new == myGameArea.king_position[enemy_color][1]) {
      myGameArea.checkmate = true;
    }
    myGameArea.board[r_new][c_new] = myGameArea.board[this.r][this.c];
    myGameArea.board[this.r][this.c] = null;

    this.r = r_new;
    this.c = c_new;

    if (!myGameArea.checkmate) {
      myGameArea.check(this.color);
    }
    myGameArea.newTurn();
  }
}

class Queen extends ChessPiece {
  constructor(color, r, c) {
    super(color, r, c);
    this.type = 'queen';
    this.image;
    if (color == 'white') {
      this.image = document.getElementById('white_queen');
    } else {
      this.image = document.getElementById('black_queen');
    }
  }

  getLegalMoves() {
    var options = [];
    var ints = [-1, 0, 1];

    for (var a = 0; a < ints.length; a++) {
      var i = ints[a];
      for (var b = 0; b < ints.length; b++) {
        var j = ints[b];
        for (var k = 1; k < 8; k++) {
          if (myGameArea.onBoard(this.r+i*k, this.c+j*k) && myGameArea.board[this.r+i*k][this.c+j*k] == null) {
            options.push([this.r+i*k, this.c+j*k]);
          } else if (myGameArea.onBoard(this.r+i*k, this.c+j*k) && myGameArea.board[this.r+i*k][this.c+j*k] != null
           && myGameArea.board[this.r+i*k][this.c+j*k].color != this.color) {
            options.push([this.r+i*k, this.c+j*k]);
            break;
          } else {
            break;
          }
        }
      }
    }
    myGameArea.options = options;
  }

  move(r_new, c_new) {
    this.document_move(r_new, c_new);
    var enemy_color = this.color == 'white' ? 'black' : 'white';
    if (r_new == myGameArea.king_position[enemy_color][0] && c_new == myGameArea.king_position[enemy_color][1]) {
      myGameArea.checkmate = true;
    }
    myGameArea.board[r_new][c_new] = myGameArea.board[this.r][this.c];
    myGameArea.board[this.r][this.c] = null;

    this.r = r_new;
    this.c = c_new;

    if (!myGameArea.checkmate) {
      myGameArea.check(this.color);
    }
    myGameArea.newTurn();
  }
}

class King extends ChessPiece {
  constructor(color, r, c) {
    super(color, r, c);
    this.type = 'king';
    this.image;
    if (color == 'white') {
      this.image = document.getElementById('white_king');
    } else {
      this.image = document.getElementById('black_king');
    }
    this.moved = false;
  }

  getLegalMoves() {
    var options = [];
    var ints = [-1, 0, 1];
    for (var a = 0; a < ints.length; a++) {
      var i = ints[a];
      for (var b = 0; b < ints.length; b++) {
        var j = ints[b];
        if ((i != 0 || j != 0) && myGameArea.onBoard(this.r+i, this.c+j) &&
         (myGameArea.board[this.r+i][this.c+j] == null || myGameArea.board[this.r+i][this.c+j].color != this.color)) {
          options.push([this.r+i, this.c+j]);
        }
      }
    }

    // Castling
    if (myGameArea.check_positions.length == 0 && !this.moved &&
      ((myGameArea.board[this.r][0] != null && myGameArea.board[this.r][0].type == 'rook' && !myGameArea.board[this.r][0].moved) ||
      (myGameArea.board[this.r][7] != null && myGameArea.board[this.r][7].type == 'rook' && !myGameArea.board[this.r][7].moved))) {
      var rooks = [];
      if (myGameArea.board[this.r][0] != null && myGameArea.board[this.r][0].type == 'rook' && !myGameArea.board[this.r][0].moved) {
        rooks.push([this.r, 0]);
      }
      if (myGameArea.board[this.r][7] != null && myGameArea.board[this.r][7].type == 'rook' && !myGameArea.board[this.r][7].moved) {
        rooks.push([this.r, 7]);
      }
      for (var j = 0; j < rooks.length; j++) {
        var empty_between = true;
        var dir;
        var spaces;
        if (rooks[j][1] > this.c) {
          dir = 1;
          spaces = 2;
        } else {
          dir = -1;
          spaces = 3;
        }
        for (var i = 1; i <= spaces; i++) {
          if (myGameArea.board[this.r][this.c+i*dir] != null) {
            empty_between = false;
          }
        }
        if (empty_between) {
          options.push([this.r, this.c + 2*dir]);
        }
      }
    }

    myGameArea.options = options;
  }

  move(r_new, c_new) {
    this.document_move(r_new, c_new);
    this.moved = true;
    var enemy_color = this.color == 'white' ? 'black' : 'white';
    if (r_new == myGameArea.king_position[enemy_color][0] && c_new == myGameArea.king_position[enemy_color][1]) {
      myGameArea.checkmate = true;
    }
    myGameArea.board[r_new][c_new] = myGameArea.board[this.r][this.c];
    myGameArea.board[this.r][this.c] = null;

    // Castling
    if (this.c - c_new == -2) {
      myGameArea.board[r_new][c_new - 1] = myGameArea.board[r_new][7];
      myGameArea.board[r_new][7] = null;
      myGameArea.board[r_new][c_new - 1].moved = true;
      myGameArea.board[r_new][c_new - 1].c = c_new - 1;
    } else if (this.c - c_new == 2) {
      myGameArea.board[r_new][c_new + 1] = myGameArea.board[r_new][0];
      myGameArea.board[r_new][0] = null;
      myGameArea.board[r_new][c_new + 1].moved = true;
      myGameArea.board[r_new][c_new + 1].c = c_new + 1;
    }

    this.r = r_new;
    this.c = c_new;

    myGameArea.king_position[this.color] = [r_new, c_new];

    if (!myGameArea.checkmate) {
      myGameArea.check(this.color);
    }
    myGameArea.newTurn();
  }
}

var myGameArea = {
    canvas : document.createElement("canvas"),

    start : function() {
        this.canvas.width = 576;
        this.canvas.height = 576;
        this.canvas.id = 'canvas';
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        document.addEventListener('click', this.getClickCoordinates);

        //Chess Timing
        this.timer = white_timer;

        // Coordinates in [Row, Column]
        this.board = [
          [new Rook('black', 0, 0), new Knight('black', 0, 1), new Bishop('black', 0, 2), new Queen('black', 0, 3), new King('black', 0, 4), new Bishop('black', 0, 5), new Knight('black', 0, 6), new Rook('black', 0, 7)],
          [new Pawn('black', 1, 0), new Pawn('black', 1, 1), new Pawn('black', 1, 2), new Pawn('black', 1, 3), new Pawn('black', 1, 4), new Pawn('black', 1, 5), new Pawn('black', 1, 6), new Pawn('black', 1, 7)],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [new Pawn('white', 6, 0), new Pawn('white', 6, 1), new Pawn('white', 6, 2), new Pawn('white', 6, 3), new Pawn('white', 6, 4), new Pawn('white', 6, 5), new Pawn('white', 6, 6), new Pawn('white', 6, 7)],
          [new Rook('white', 7, 0), new Knight('white', 7, 1), new Bishop('white', 7, 2), new Queen('white', 7, 3), new King('white', 7, 4), new Bishop('white', 7, 5), new Knight('white', 7, 6), new Rook('white', 7, 7)],
        ];
        this.turn = 'begin';
        this.turn_num = 1;
        this.selected = null;
        this.options = [];
        //En Passant information
        this.en_passant = [];
        this.available_to_en_passant = [null, null];
        // King information
        this.checkmate = false;
        this.king_position = {'white' : [7,4], 'black' : [0,4]};
        this.check_positions = [];

        // score
        this.white_score = 0;
        this.black_score = 0;

        this.update();
    },

    update : function() {
      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j+=2) {
          this.context.fillStyle = i%2==0 ? "#BFADA3" : "#504746";
          this.context.fillRect(j*72, i*72, 72, 72);
          if (this.board[i][j] != null) {
            this.context.drawImage(this.board[i][j].image, j*72, i*72, 72, 72);
          }
          this.context.fillStyle = i%2==0 ? "#504746" : "#BFADA3";
          this.context.fillRect((j+1)*72, i*72, 72, 72);
          if (this.board[i][j+1] != null) {
            this.context.drawImage(this.board[i][j+1].image, (j+1)*72, i*72, 72, 72);
          }
        }
      }

      if (this.check_positions.length > 0) {
        alert(this.turn + " king is in check!");
        var attack_im = document.getElementById('attack');
        for (var i = 0; i < this.check_positions.length; i++) {
          this.context.drawImage(attack_im, this.check_positions[i][1]*72, this.check_positions[i][0]*72);
        }
      }
    },

    getClickCoordinates : function(event) {
      var x = event.clientX;
      var y = event.clientY;
      var r = Math.floor((y - 3) / 72);
      var c = Math.floor((x - 3) / 72);
      if (r >= 8 || c >= 8 || r < 0 || c < 0) {
        myGameArea.selected = null;
        myGameArea.options = [];
        myGameArea.update();
      } else if (myGameArea.selected != null && myGameArea.inOptions([r,c])) {
        myGameArea.moveChessPiece(myGameArea.selected[0], myGameArea.selected[1], r, c);
        myGameArea.selected = null;
        myGameArea.options = [];
        myGameArea.update();
      } else if (myGameArea.selected != null && !myGameArea.inOptions([r,c])) {
        myGameArea.selected = null;
        myGameArea.options = [];
        myGameArea.update();
      } else if (myGameArea.board[r][c] != null && myGameArea.board[r][c].color == myGameArea.turn) {
        myGameArea.board[r][c].getLegalMoves();
        myGameArea.drawOptions();
        myGameArea.selected = [r,c];

        var select_im = document.getElementById('select');
        myGameArea.context.drawImage(select_im, c*72, r*72, 72, 72);
      }
    },

    drawOptions : function() {
      var option_im = document.getElementById('option');
      var attack_im = document.getElementById('attack');
      for (var i = 0; i < this.options.length; i++) {
        if (this.board[this.options[i][0]][this.options[i][1]] == null && !this.inEnPassant(this.options[i])) {
          this.context.drawImage(option_im, this.options[i][1]*72, this.options[i][0]*72);
        } else {
          this.context.drawImage(attack_im, this.options[i][1]*72, this.options[i][0]*72);
        }
      }
    },

    moveChessPiece : function(r_old, c_old, r_new, c_new) {
      this.board[r_old][c_old].move(r_new, c_new);
    },

    inOptions : function(coords) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i][0] == coords[0] && this.options[i][1] == coords[1]) {
          return true;
        }
      }
      return false;
    },

    inEnPassant : function(coords) {
      for (var i = 0; i < this.en_passant.length; i++) {
        if (this.en_passant[i][0] == coords[0] && this.en_passant[i][1] == coords[1]) {
          return true;
        }
      }
      return false;
    },

    onBoard : function(r, c) {
      return (r >= 0 && r < 8 && c >= 0 && c < 8);
    },

    newTurn : function() {
      this.timer.pause();
      this.timer.addTime(2);
      if (this.checkmate) {
        window.confirm(this.turn + " has won the game!");
        //Update scoreline
        if (this.turn == 'white') {
          this.white_score += 1;
          document.getElementById('white_score').innerHTML = this.white_score;
        } else if (this.turn == 'black') {
          this.black_score += 1;
          document.getElementById('black_score').innerHTML = this.black_score;
        }
        this.turn = 'game over';
        this.check_positions = [];
      } else {
        this.turn = this.turn == 'white' ? 'black' : 'white';
        this.turn_num += 1;
        this.selected = null;
        this.options = [];
        //En Passant information
        this.en_passant = [];

        // Switch Timers
        if (this.timer.color == 'white') {
          this.timer = black_timer;
        } else {
          this.timer = white_timer;
        }
        this.timer.start();
      }
    },

    forfeit : function() {
      if (this.turn == 'black') {
        this.white_score += 1;
        document.getElementById('white_score').innerHTML = this.white_score;
      } else if (this.turn == 'white') {
        this.black_score += 1;
        document.getElementById('black_score').innerHTML = this.black_score;
      }
      this.turn = 'game over';
      this.check_positions = [];
    },

    check : function(self_color) {
      // Checking if new options check enemy king
      var enemy_color = self_color == 'white' ? 'black' : 'white';
      var enemy_king_position = this.king_position[enemy_color];
      var dummy_pieces = [
        new Pawn(enemy_color, enemy_king_position[0], enemy_king_position[1]),
        new Rook(enemy_color, enemy_king_position[0], enemy_king_position[1]),
        new Knight(enemy_color, enemy_king_position[0], enemy_king_position[1]),
        new Bishop(enemy_color, enemy_king_position[0], enemy_king_position[1]),
        new King(enemy_color, enemy_king_position[0], enemy_king_position[1]),
        new Queen(enemy_color, enemy_king_position[0], enemy_king_position[1]),
      ];

      var attack_positions = [];

      for (var i = 0; i < dummy_pieces.length; i++) {
        dummy_pieces[i].getLegalMoves();
        for (var j = 0; j < this.options.length; j++) {
          if (this.board[this.options[j][0]][this.options[j][1]] != null && this.board[this.options[j][0]][this.options[j][1]].color == self_color
           && this.board[this.options[j][0]][this.options[j][1]].type == dummy_pieces[i].type) {
            attack_positions.push(this.options[j]);
          }
        }
      }
      this.check_positions = attack_positions;
    },

    begin : function() {
      this.turn = 'white';
      this.timer.start();
    },

    pause : function() {
      if (this.turn == 'white' || this.turn == 'black') {
        this.timer.pause();
        this.last_turn = this.turn;
        this.turn = 'pause';
      }
    },

    resume : function() {
      this.timer.start();
      this.turn = this.last_turn;
    }
}

var black_timer_element = document.getElementById('black_timer');
var black_timer = new Timer('black', black_interval);
function black_interval () {
  if (black_timer.time_left > 0) {
    black_timer.time_left -= 1;
    black_timer.update_time();
    if (black_timer.time_left == 0) {
        clearInterval(black_timer.timer);
        black_timer.timeout();
    }
  }
}

var white_timer_element = document.getElementById('white_timer');
var white_timer = new Timer('white', white_interval);
function white_interval () {
  if (white_timer.time_left > 0) {
    white_timer.time_left -= 1;
    white_timer.update_time();
    if (white_timer.time_left == 0) {
        clearInterval(white_timer.timer);
        white_timer.timeout();
    }
  }
}

function timer_start() {
  if (myGameArea.turn == 'begin') {
    myGameArea.begin();
  } else if (myGameArea.turn == 'pause') {
    myGameArea.resume();
  }
}

function timer_pause() {
  myGameArea.pause();
}
