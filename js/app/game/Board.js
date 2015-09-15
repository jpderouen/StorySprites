/**
 * File: Board
 * User: jderouen
 * Date: 5/16/13
 * Time: 7:13 PM
 * To change this template use File | Settings | File Templates.
 */
define('app/game/Board',[
    'app/Model',
    'app/game/Square',
    'app/game/Story'
],function(
    Model,
    Square,
    Story){

        function Board(data){
            console.log("Board.construct(): arguments = ",data);
            // Class constructor
            var self = this;

            // Default board properties
            var $p = {
                rowCount: 10,
                colCount: 8,
                color: 'Black',     // one of the predefined CSS color names (http://www.w3schools.com/cssref/css_colornames.asp)
                pad: 5              // number of pixels to pad left, right, top, and bottom
            };

            // Class setters and getters, setters and getters must be declared first so constructor can utilize them
            Object.defineProperty(self,'rowCount',{
                get: function() {
                    return $p.rowCount;
                },
                set: function(x){
                    $p.rowCount = x;
                }
            });
            Object.defineProperty(self,'colCount',{
                get: function() {
                    return $p.colCount;
                },
                set: function(x){
                    $p.colCount = x;
                }
            });

            // call superclass and data array
            Model.call(this,data);

            var $story = new Story();
            $story.Theme = $story.EMOTIVE;

            // determine the pixel count for a square given the board constraints, account for zone padding
            var $side;
            if((self.width-2*$p.pad)/$p.colCount < (self.height-2*$p.pad)/$p.rowCount){
                // if the width of board and desired column count restrict square size, set accordingly
                $side = Math.floor((self.width-2*$p.pad)/$p.colCount);
            }else{
                // if the height of board and row count restrict square size, set accordingly
                $side = Math.floor((self.height-2*$p.pad)/$p.rowCount);
            }

            // adjust board x,y origin to center board horizontally within originally specified width
            // and apply a padding to the vertical starting spot
            self.x = Math.round(self.x+(self.width-$side*$p.colCount)/2);
            self.y = self.y + $p.pad;

            // set board width and height according to restricted square size
            self.width = $p.colCount * $side;
            self.height = $p.rowCount * $side;

            console.log('colCount = ',$p.colCount,'; rowCount = ',$p.rowCount, '; side = ', $side);
            // array squares, one row
            var $squares = new Array($p.colCount);
            // populate each row element with a column element
            for(var i = 0; i <= $p.colCount-1; i++){
                $squares[i] = new Array($p.rowCount);
            }

            // create the matrix of squares
            var count = 0;
            for(var i= 0; i <= $p.colCount-1; i++){
                for(var j=0;j<=$p.rowCount-1;j++){
                    count = count + 1;

                    $squares[i][j] = new Square(
                        {
                        side:$side,
                        i:i,
                        j:j
                    });

                    if(count<=$story.Words.length){
                        $squares[i][j].word = $story.Words[count-1];
                    }
                }
            }

            // shuffle the board
            shuffle();

            // define class actions and return public $p
            self.draw = function(){
                self.App.ctx.save();
                self.App.ctx.translate(self.x,self.y);
                // draw each square on the board
               for(var i=0; i<=$p.colCount-1; i++){
                    for(var j=0; j<=$p.rowCount-1; j++){
                        $squares[i][j].draw();
                    }
                }
                self.App.ctx.restore();

            };

            // provide public access to shuffle
            self.shuffle = shuffle();

            // private methods
            // randomly shuffle squares
            function shuffle(){
                var $i;             // index shuffle of x position in the board array
                var $j;             // index shuffle of y position in the board array
                var $temp = {};     //

                for(var i=0; i<$p.colCount; i++){
                    for(var j=0; j<$p.rowCount; j++){
                        // pick random numbers for the row and column index to target swap
                        $i = Math.floor(Math.random()*($p.colCount-1));
                        $j = Math.floor(Math.random()*($p.rowCount-1));
                        // hold the current square that is destined for swap
                        $temp = $squares[i][j];
                        // swap the current square with the randomly identified square
                        $squares[i][j] = $squares[$i][$j];
                        $squares[$i][$j] = $temp;
                        // correct the i and j identifiers for the reassigned square
                        $squares[i][j].i = i;
                        $squares[i][j].j = j;
                        $squares[$i][$j].i = $i;
                        $squares[$i][$j].j = $j;
                    }
                }

            }

        }

    // setup the inheritance chain
    Board.prototype = Object.create(Model.prototype);
    Board.prototype.constructor = Board;

    return Board;

});
