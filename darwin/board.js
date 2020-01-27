////////////////////////////////////////////////////////////////////////////
//                                                                        //
//                          SERVER ENDPOINT                               //
const SERVER_ENDPOINT = "http://localhost:8080"                           //
//                                                                        //
//                                                                        //
////////////////////////////////////////////////////////////////////////////

const BOARD_WIDTH_PX = 576;
const BOARD_HEIGHT_PX = 576;
const BOARD_COLOR = "#109648"; // spanish green
const BOARD_OFFSET_PX = 3;

const LINE_COLOR = "#000000";
const LINE_WIDTH_PX = 1;

const SPACE_WIDTH_PX = 72;
const NUM_BOARD_SPACES_WIDTH = 8;
const PIECE_RADIUS = 28;
const LIGHT_PIECE_COLOR = "#FFFFFF";
const LIGHT_PIECE_OPTION_COLOR = "#FFFFFF99";
const DARK_PIECE_COLOR = "#000000";
const DARK_PIECE_OPTION_COLOR = "#00000099";
const LIGHT_ID = 1;
const DARK_ID = 0;
const EMPTY_ID = -1;

const PLAYER = 'Player';
const DARWIN = 'Darwin'
var LIGHT_PLAYER = PLAYER;
var DARK_PLAYER = DARWIN;
var PLAYER_ID = 1;

if ( Math.random() < 0.5 ) {
    LIGHT_PLAYER = DARWIN;
    DARK_PLAYER = PLAYER;
    PLAYER_ID = 0;
}

var myGameArea = {
    canvas : document.createElement( "canvas" ),

    start : function() {
        this.canvas.width = BOARD_WIDTH_PX;
        this.canvas.height = BOARD_HEIGHT_PX;
        this.canvas.id = 'canvas';
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore( this.canvas, document.body.childNodes[0] );
        document.addEventListener( 'click', this.getClickCoordinates );
        
        $.get( SERVER_ENDPOINT + "/newGame", function( data ) {
            myGameArea.board = data.Board;
            myGameArea.darwinId = data.DarwinId;
            myGameArea.update();
        });
    },

    update : function() {
        this.context.fillStyle = BOARD_COLOR;
        this.context.fillRect( 0, 0, BOARD_WIDTH_PX, BOARD_HEIGHT_PX );

        for ( var i = 1; i < 8; i++ ) {
            this.context.fillStyle = LINE_COLOR;
            this.context.fillRect( i * SPACE_WIDTH_PX, 0, LINE_WIDTH_PX, BOARD_HEIGHT_PX );
            this.context.fillRect( 0, i * SPACE_WIDTH_PX, BOARD_WIDTH_PX, LINE_WIDTH_PX );
        }

        for ( var i = 0; i < this.board.length; i++ ) {
            if ( this.board[i] != -1 ) {
                var y = Math.floor( i / NUM_BOARD_SPACES_WIDTH ) * SPACE_WIDTH_PX + SPACE_WIDTH_PX / 2;
                var x = ( i % NUM_BOARD_SPACES_WIDTH ) * SPACE_WIDTH_PX + SPACE_WIDTH_PX / 2;
                this.context.fillStyle = this.board[i] == LIGHT_ID ? LIGHT_PIECE_COLOR : DARK_PIECE_COLOR;
                this.context.beginPath();
                this.context.arc( x, y, PIECE_RADIUS, 0, 2 * Math.PI );
                this.context.closePath();
                this.context.fill();
            }
        }
    },

    drawOptions : function() {
        for ( var i = 0; i < this.options.length; i++ ) {
            if ( this.options[i] != -1 ) {
                var y = Math.floor( i / NUM_BOARD_SPACES_WIDTH ) * SPACE_WIDTH_PX + SPACE_WIDTH_PX / 2;
                var x = ( i % NUM_BOARD_SPACES_WIDTH ) * SPACE_WIDTH_PX + SPACE_WIDTH_PX / 2;
                this.context.fillStyle = this.options[i] == LIGHT_ID ? LIGHT_PIECE_OPTION_COLOR : DARK_PIECE_OPTION_COLOR;
                this.context.beginPath();
                this.context.arc( x, y, PIECE_RADIUS, 0, 2 * Math.PI );
                this.context.closePath();
                this.context.fill();
            }
        }
    },

    getClickCoordinates : function() {
        var x = event.clientX;
        var y = event.clientY;
        var r = Math.floor( ( y - BOARD_OFFSET_PX ) / SPACE_WIDTH_PX );
        var c = Math.floor( ( x - BOARD_OFFSET_PX ) / SPACE_WIDTH_PX );
        if ( r >= 0 && r < NUM_BOARD_SPACES_WIDTH && c >= 0 && c < NUM_BOARD_SPACES_WIDTH ) {
            var boardIndex = getBoardIndex( r, c );
            if ( myGameArea.options[boardIndex] != EMPTY_ID ) {
                var endpoint = prepareEndpointParameters( "/playerCaptured" ) + "&move=" +  boardIndex;
                $.get( endpoint, function( data ) {
                    myGameArea.board = data.Board;
                    myGameArea.update();
                });
            }
        }
    },

    getPlayerOptions : function() {
        var endpoint = prepareEndpointParameters( "/playerOptions" );
        $.get( endpoint, function( data ) {
            myGameArea.options = data.OptionBoard;
            myGameArea.drawOptions();
        });
    },

    getDarwinMove : function() {
        var endpoint = prepareEndpointParameters( "/darwinMove" );
        $.get( endpoint, function( data ) {
            if ( myGameArea.darwinId == data.DarwinId ) {
                myGameArea.board = data.Board;
                myGameArea.update();
            }
        });
    }
}

function prepareEndpointParameters( handlerRoot ) {
    var endpoint = SERVER_ENDPOINT + handlerRoot + "?";
    endpoint += "playerId=" + PLAYER_ID;
    endpoint += "&darwinId=" + myGameArea.darwinId;
    for ( var i = 0; i < myGameArea.board.length; i++ ) {
        endpoint += "&board=" + myGameArea.board[i];
    }
    return endpoint;
}

function getBoardIndex( r, c ) {
    return r * NUM_BOARD_SPACES_WIDTH + c;
}

function load() {
    myGameArea.start();
}