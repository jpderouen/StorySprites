/**
 * File: Square
 * User: jderouen
 * Date: 8/1/13
 * Time: 7:32 PM
 * To change this template use File | Settings | File Templates.
 */
define('app/game/Square',['app/Model'],function(Model){

    function Square(data){
        //console.log("Square.construct(): arguments = ",$data,'this =',this);
        // Class constructor
        var self = this;

        /* private variables */
        var $error = false;
        var $msg;
        var $wordIcon = "img/game/WordIcon.png";    // location of icon indicating a square containing a word
        var $pulse = 0;                             // square pulse to control animation such as pulsing or color changes

        // define class properties */
        var $p = {
            word:       null,             // holds word if square associates to one
            side:       20,             // the side dimension of square in pixels
            fillColor:  'LightSteelBlue',      // LightSteelBlue, one of the predefined CSS color names (http://www.w3schools.com/cssref/css_colornames.asp)
            border:     1,              // pixel size for the border
            borderColor: 'DarkSlateGray',
            i: 1,                       // the x position in the grid of squares, this with x-origin supports drawing
            j: 1,                       // the y position in the grid of squares, this with y-origin supports drawing
            icon: null,                 // icon representing information about this square
            pad: 1                      // buffer for each square, allows background color to show through
        };

        // Class setters and getters, setters and getters must be declared first so constructor can utilize them
        Object.defineProperty(self,"word",{
            get: function() {
                return $p.word;
            },
            set: function(x) {
                var xType = typeof x;
                if(xType == 'object'){
                    $p.fillColor = 'Brown';     //'LightCoral';
                    $p.borderColor = 'Magenta';
                    // todo: check to make sure assignment is a word object
                    $p.word = x;
                    if($p.icon == null){
                        $p.icon = new Image();
                    }
                    $p.icon.src = $wordIcon;
                }else{
                    $error = true;
                    $msg = 'Attempted to set Square.word to a non-object value.'
                }

            }
        });

        Object.defineProperty(self,"side",{
            get: function() {
                return $p.side;
            },
            set: function(x) {
                $p.side = x;
                // set border and padding to 5% of side
                $p.border = Math.round(x *.05);
                $p.pad = Math.round(x *.05);
            }
        });

        Object.defineProperty(self,"borderColor",{
            get: function() {
                return $p.borderColor;
            },
            set: function(x) {
                $p.borderColor = x;
            }
        });

        Object.defineProperty(self,"i",{
            get: function() {
                return $p.i;
            },
            set: function(x) {
                $p.i = x;
            }
        });

        Object.defineProperty(self,"j",{
            get: function() {
                return $p.j;
            },
            set: function(x) {
                $p.j = x;
            }
        });

        Object.defineProperty(self,"pad",{
            get: function() {
                return $p.pad;
            },
            set: function(x) {
                $p.pad = x;
            }
        });

        Object.defineProperty(self,"border",{
            get: function() {
                return $p.border;
            },
            set: function(x) {
                if (isNumber(x)){
                    if(x < $p.side/3) {
                        $p.border = x;
                    }else{
                        $error = true;
                        $msg = 'Error, attempted to set border of square too big, value = ' + x;
                    }
                }else{
                    $error = true;
                    $msg = 'Attempted to set square border size to non-numeric value = ' + x;
                }

            }
        });

        Object.defineProperty(self,"fillColor",{
            get: function() {
                return $p.fillColor;
            },
            set: function(x) {
                // check to see if setting to color name
                var xType = typeof x;

                if(xType == 'string'){
                    $p.fillColor = x;
                }else{
                    // check for valid hex color code
                    if(/^#[0-9A-F]{6}$/i.test(x)){
                        $p.fillColor = x;
                    }else{
                        $error = true;
                        $msg = 'Attempted to set square fillColor to unrecognized value = ' + x;
                    }
                }
            }
        });

        // START constructor logic
        // set properties per argument passed during construction
        /*var $key;
        for($key in $data){
            if($p.hasOwnProperty($key)){
                // use self reference in order to execute setter method, call using bracket notation within object scope
                self[$key] = $data[$key];
            }
        }*/

        // call superclass and data array
        Model.call(this,data);
        self.App.log(self.App.logLevel.INFO,'START Game.Square construct');

        // public methods
        self.draw = function(){
            var $x;    // x-coordinate for drawing and translating
            var $y;    // y-coordinate for drawing and translating

            // increment the squares pulse
            $pulse = $pulse + 0.1;

            self.App.ctx.save();
            // create a gradient across the square
            //var $grad = $App.ctx.createLinearGradient($xo,-$yo,$xo,$yo);
            //$grad.addColorStop(0,$p.fillColor);
            //$grad.addColorStop(1,$p.borderColor);

            self.App.ctx.fillStyle=$p.fillColor;
            self.App.ctx.lineWidth=$p.border;
            self.App.ctx.strokeStyle=$p.borderColor;
            self.App.ctx.lineJoin = 'round';

            // square will draw itself around origin, move origin to center of square
            $x = Math.round($p.side/2);
            $y = $x;

            // move each square according to its location in the matrix
            $x = $x + $p.i*$p.side+$p.pad;
            $y = $y + $p.j*$p.side+$p.pad;
            self.App.ctx.translate($x,$y);

            // set the moveto coordinates to create the square
            $x = Math.round($p.side/2-$p.pad);
            $y = $x;

            // draw square
            self.App.ctx.beginPath();
            self.App.ctx.moveTo(-$x,$y);
            self.App.ctx.lineTo($x,$y);
            self.App.ctx.lineTo($x,-$y);
            self.App.ctx.lineTo(-$x,-$y);
            self.App.ctx.closePath();
            self.App.ctx.fill();
            self.App.ctx.stroke();


            // draw 'W' representing presence of a word
            if ($p.word != null){
                // draw 'W' in center of square, size it according to the square size
                self.App.ctx.fillStyle='white';
                switch(true){
                    case $p.side<10:
                        self.App.ctx.font="bold 8px Cooper Black";
                        break;
                    case $p.side<20:
                        self.App.ctx.font="bold 14px Cooper Black";
                        break;
                    case $p.side<40:
                        self.App.ctx.font="bold 24px Cooper Black";
                        break;
                    default:
                        self.App.ctx.font="bold 36px Cooper Black";
                        break;
                }
                self.App.ctx.textBaseline = 'middle';
                self.App.ctx.textAlign = 'center';
                self.App.ctx.fillText('W',0,0);
            }

            self.App.ctx.restore();


        };

        // private methods
        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

    }

    // setup the inheritance chain
    Square.prototype = Object.create(Model.prototype);
    Square.prototype.constructor = Square;


    return Square;

});