/**
 * File: Button
 * User: jderouen
 * Date: 10/23/13
 * Time: 12:03 PM
 * To change this template use File | Settings | File Templates.
 */

define('app/etc/Button',['app/Model'],function(Model){

    function Button(data){
        console.log("Button.construct(): arguments = ",data);
        // Class constructor
        var self = this;

        /* private properties */
        var $error = false;
        var $msg;

        // define class properties */
        var $p = {
            fillColors: new Array(          // array input for fill allows for creation of gradient fill
                'LightSteelBlue',
                'Thistle'
            ),
            borderColor:'Black',
            x: 0,                       // x-coordinate identifying origin of button
            y: 0,                       // y-coordinate of button origin
            width: 20,
            height: 10,
            text: '',                   // text on button
            line: 2,                    // Width of drawing line
            value: null,                // On button click, set Event.value to this value
            event: ''                   // maps button to event
        };
        // other protected properties
        var $isPressed = false;

        // Class setters and getters, setters and getters must be declared first so constructor can utilize them
        Object.defineProperty(self,"fillColors",{
            get: function() {
                return $p.fillColors;
            },
            set: function(x) {
                // check to see if setting to color name
                var xType = typeof x;

               if(xType != 'object'){
                   self.App.log(self.App.logLevel.WARN,'Button.fillColors must be an array of colors, instead it is type = ' + xType);
                }else{
                    for(var i=0; i< x.length; i++){
                        xType = typeof x[i];
                        if(xType != 'string'){
                            // check for valid hex color code
                            if(!/^#[0-9A-F]{6}$/i.test(x)){
                                $error = true;
                                self.App.log(self.App.logLevel.WARN,'Attempted to set square fillColor to unrecognized value = ' + x);
                            }
                        }
                    }
                    if(!$error){
                        $p.fillColors = x;
                    }
                }
            }
        });
        Object.defineProperty(self,'borderColor',{
            get: function() {
                return $p.borderColor;
            },
            set: function(x){
                // check to see if setting to color name
                var xType = typeof x;

                if(xType == 'string'){
                    $p.borderColor = x;
                }else{
                    // check for valid hex color code
                    if(/^#[0-9A-F]{6}$/i.test(x)){
                        $p.borderColor = x;
                    }else{
                        self.App.log(self.App.logLevel.WARN,'Attempted to set button borderColor to unrecognized value = ' + x);
                    }
                }
            }
        });

        Object.defineProperty(self,'line',{
            get: function() {
                return $p.line;
            },
            set: function(x){
                $p.line = x;
            }
        });
        Object.defineProperty(self,'x',{
            get: function() {
                return $p.x;
            },
            set: function(x){
                $p.x = x;
            }
        });
        Object.defineProperty(self,'y',{
            get: function() {
                return $p.y;
            },
            set: function(y){
                $p.y = y;
            }
        });
        Object.defineProperty(self,'width',{
            get: function() {
                return $p.width;
            },
            set: function(x){
                $p.width = x;
            }
        });
        Object.defineProperty(self,'height',{
            get: function() {
                return $p.height;
            },
            set: function(x){
                $p.height = x;
            }
        });
        Object.defineProperty(self,'text',{
            get: function() {
                return $p.text;
            },
            set: function(x){
                $p.text = x;
            }
        });
        Object.defineProperty(self,'event',{
            get: function() {
                return $p.event;
            },
            set: function(x){
                $p.event = x;
            }
        });
        Object.defineProperty(self,'value',{
            get: function() {
                return $p.value;
            },
            set: function(x){
                $p.value = x;
            }
        });
        Object.defineProperty(self,'isPressed',{
            get: function() {
                return $isPressed;
            }
        });
        Object.defineProperty(self,'msg',{
            get: function() {
                return $msg;
            }
        });

        Object.defineProperty(self,'error',{
            get: function() {
                return $error;
            }
        });

        // call superclass and data array
        Model.call(this,data);

        // public methods
        self.draw = function(){
            process();
            self.App.ctx.save();
            // translate context to origin of button
            self.App.ctx.translate($p.x,$p.y);

            self.App.ctx.lineJoin = 'round';

            // draw the shadow if not pressed, make shadow 10% of height
            if(!$isPressed){
                self.App.ctx.fillStyle = 'rgba(0,0,0,0.7)';
                self.App.ctx.fillRect(
                    Math.round($p.height *.1),
                    Math.round($p.height *.1),
                    $p.width,
                    $p.height
                );
            }else{
                // translate origin to cover vacated shadow and simulate button press
                self.App.ctx.translate($p.height *.1,$p.height *.1);
            }

            var $grad = self.App.ctx.createLinearGradient(0,0,0,$p.height);

            for(var i=0;i<$p.fillColors.length;i++){
                var $step = i/($p.fillColors.length-1);
                $grad.addColorStop($step,$p.fillColors[i]);
            }

            self.App.ctx.fillStyle=$grad;
            self.App.ctx.lineWidth=$p.line;
            self.App.ctx.strokeStyle=$p.borderColor;
            self.App.ctx.fillRect(0,0,$p.width,$p.height);
            // draw just the bottom edges of button adjacent to the shadow
            self.App.ctx.beginPath();
            self.App.ctx.moveTo($p.width,0);
            self.App.ctx.lineTo($p.width,$p.height);
            self.App.ctx.lineTo(0,$p.height);
            self.App.ctx.stroke();

            // draw top edges of button as illuminated by light source
            self.App.ctx.strokeStyle='rgba(255,255,255,0.8)';
            self.App.ctx.beginPath();
            self.App.ctx.moveTo($p.width,0);
            self.App.ctx.lineTo(0,0);
            self.App.ctx.lineTo(0,$p.height);
            self.App.ctx.stroke();

            // determine text size based on size of button
            switch(true){
                case $p.width<10:
                    self.App.ctx.font="bold 6px Cooper Black";
                    break;
                case $p.width<20:
                    self.App.ctx.font="bold 8px Cooper Black";
                    break;
                case $p.width<40:
                    self.App.ctx.font="bold 12px Cooper Black";
                    break;
                default:
                    self.App.ctx.font="bold 14px Cooper Black";
                    break;
            }
            // set positioning and color
            self.App.ctx.textBaseline = 'middle';
            self.App.ctx.textAlign = 'center';
            self.App.ctx.fillStyle='Black';
            // draw coordinates
            self.App.ctx.fillText($p.text,$p.width/2,$p.height/2);

            self.App.ctx.restore();

        };

        // private methods
        function process(){
            if(self.App.Event.Last == self.App.Event.CLICK && !$isPressed){
                if  (
                    self.App.Event.Clicked.x > $p.x
                        &&
                    self.App.Event.Clicked.x < $p.x + $p.width
                        &&
                    self.App.Event.Clicked.y > $p.y
                        &&
                    self.App.Event.Clicked.y < $p.y + $p.height
                    ){
                    $isPressed = true;
                    self.App.Event.Value = $p.value;
                }
            // set the event after button animation completes
            }else if(self.App.Event.Last == self.App.Event.CLICK && $isPressed){
                self.App.Event.Last = $p.event;
                $isPressed = false;
            }
        }
    }

    // setup the inheritance chain
    Button.prototype = Object.create(Model.prototype);
    Button.prototype.constructor = Button;

    return Button;

});