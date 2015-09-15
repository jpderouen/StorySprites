/**
 * File: Compass
 * User: jderouen
 * Date: 10/13/13
 * Time: 9:40 AM
 * To change this template use File | Settings | File Templates.
 */
define('app/game/Compass', ['app/Model'],function(Model){

    function Compass(data){
        //console.log("Square.construct(): arguments = ",$data,'this =',this);
        // Class constructor
        var self = this;

        // private variables
        var _theta = 0;             // current angular position of compass arrow
        var _theta_i = 0;           // angular position at last delta t
        var _theta_ii = 0;          // angular position two delta t time periods ago
        var _omega = 0;             // current angular speed of compass arrow
        var _omega_i = 0;           // angular speed at last delta t
        var _omega_max = 720;       // maximum angular speed limit
        var _alpha = 0;             // current angular acceleration
        var _torque = 0;            // torque applied to spin compass
        var _isSpinning = false;    // flags when compass is spinning
        var _isPressed = false;     // flags when compass is pressed

        // protected variables
        var $isSet = true;        // flags when compass has been spun, only allowed once
        var $vector = {       // the heading and distance to move (distance*<heading.x,heading.y>)
            d: 0,
            x: 0,
            y: 0
        };

        // define public class properties */
        var $p = {
            x: 0,                       // origin of drawing operation
            y: 0,
            r: 100,                     // compass radius in pixels
            pColor: 'DarkGoldenRod',    // LightSteelBlue, one of the predefined CSS color names (http://www.w3schools.com/cssref/css_colornames.asp)
            sColor:'SaddleBrown',
            borderColor:'#381C08',      // color for lettering and outlining
            maxTravel: 10,                    // maximum distance of travel directed by compass
            line: 2                     // Width of drawing line
        };

        // Class setters and getters, setters and getters must be declared first so constructor can utilize them
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
        Object.defineProperty(self,'r',{
            get: function() {
                return $p.r;
            },
            set: function(y){
                $p.r = y;
            }
        });
        Object.defineProperty(self,'isSet',{
            get: function() {
                return $isSet;
            },
            set: function(y){
                $isSet = y;
            }
        });
        Object.defineProperty(self,'maxTravel',{
            get: function() {
                return $p.maxTravel;
            },
            set: function(y){
                $p.maxTravel = y;
            }
        });
        Object.defineProperty(self,"vector",{
            get: function() {
                switch(true){
                    // north
                    case _theta < 22.5:
                        $vector.x = 0;
                        $vector.y = -1;
                        break;
                    // northeast
                    case _theta < 67.5:
                        $vector.x = 1;
                        $vector.y = -1;
                        break;
                    // east
                    case _theta < 112.5:
                        $vector.x = 1;
                        $vector.y = 0;
                        break;
                    // southeast
                    case _theta < 157.5:
                        $vector.x = 1;
                        $vector.y = 1;
                        break;
                    // south
                    case _theta < 202.5:
                        $vector.x = 0;
                        $vector.y = 1;
                        break;
                    // southwest
                    case _theta < 247.5:
                        $vector.x = -1;
                        $vector.y = -1;
                        break;
                    // west
                    case _theta < 292.5:
                        $vector.x = 0;
                        $vector.y = -1;
                        break;
                    // northwest
                    case _theta < 337.5:
                        $vector.x = -1;
                        $vector.y = -1;
                        break;
                    // remaining section is last half of north
                    default:
                        $vector.x = 0;
                        $vector.y = -1;
                }
                return $vector;
            }
        });

        // START constructor logic
        // set properties per argument passed during construction
        /*var $key;
        for($key in $data){
            if($p.hasOwnProperty($key)){
                $p[$key] = $data[$key];
            }
        }*/
        // call superclass and data array
        Model.call(this,data);

        // public methods
        self.draw = function(){
            process();
            // save context then draw thereafter
            self.App.ctx.save();
            self.App.ctx.translate($p.x,$p.y);

            // draw the shadow if not pressed, make shadow 5% of radius
            if(!_isPressed){
                self.App.ctx.fillStyle = 'rgba(0,0,0,0.7)';
                self.App.ctx.strokeStyle = 'Black';
                self.App.ctx.beginPath();
                self.App.ctx.arc(0.05*$p.r,0.05*$p.r,$p.r,0,2*Math.PI,true);
                self.App.ctx.closePath();
                self.App.ctx.fill();
            }else{
                // translate origin to cover vacated shadow and simulate button press
                self.App.ctx.translate($p.r *.05,$p.r *.05);
            }

            // draw compass face
            var $grad = self.App.ctx.createRadialGradient(0,0,$p.r*0.75,0,0,$p.r);
            $grad.addColorStop(0,$p.pColor);
            $grad.addColorStop(.9,$p.sColor);
            self.App.ctx.fillStyle=$grad;
            self.App.ctx.beginPath();
            self.App.ctx.arc(0,0,$p.r,0,2*Math.PI,true);
            self.App.ctx.closePath();
            self.App.ctx.fill();

            // draw compass edge
            self.App.ctx.strokeStyle=$p.borderColor;
            self.App.ctx.lineWidth=Math.round(.05*$p.r);
            self.App.ctx.beginPath();
            self.App.ctx.arc(0,0,$p.r,0,2*Math.PI,true);
            self.App.ctx.stroke();

            // Determine font size of coordinates on compass
            switch(true){
                case $p.r<10:
                    self.App.ctx.font="bold 6px Cooper Black";
                    break;
                case $p.r<20:
                    self.App.ctx.font="bold 8px Cooper Black";
                    break;
                case $p.r<40:
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
            self.App.ctx.fillText('N',0,-0.8*$p.r);
            self.App.ctx.fillText('NE',0.7*$p.r*Math.sin(Math.PI/4),-0.7*$p.r*Math.sin(Math.PI/4));
            self.App.ctx.fillText('E',0.8*$p.r,0);
            self.App.ctx.fillText('SE',0.7*$p.r*Math.sin(Math.PI/4),0.7*$p.r*Math.sin(Math.PI/4));
            self.App.ctx.fillText('S',0,0.8*$p.r);
            self.App.ctx.fillText('SW',-0.7*$p.r*Math.sin(Math.PI/4),0.7*$p.r*Math.sin(Math.PI/4));
            self.App.ctx.fillText('W',-0.8*$p.r,0);
            self.App.ctx.fillText('NW',-0.7*$p.r*Math.sin(Math.PI/4),-0.7*$p.r*Math.sin(Math.PI/4));

            // draw arrow
            nextTheta();
            self.App.ctx.fillStyle=$p.borderColor;
            self.App.ctx.rotate(_theta*Math.PI/180);
            self.App.ctx.beginPath();
            self.App.ctx.lineTo(self.App.ctx.lineWidth/2,0);
            self.App.ctx.lineTo(self.App.ctx.lineWidth/2,-Math.round(0.5*$p.r));
            self.App.ctx.lineTo(2*self.App.ctx.lineWidth,-Math.round(0.5*$p.r));
            self.App.ctx.lineTo(0,-0.7*$p.r);
            self.App.ctx.lineTo(-2*self.App.ctx.lineWidth,-Math.round(0.5*$p.r));
            self.App.ctx.lineTo(-self.App.ctx.lineWidth/2,-Math.round(0.5*$p.r));
            self.App.ctx.lineTo(-self.App.ctx.lineWidth/2,0);
            self.App.ctx.closePath();
            self.App.ctx.fill();
            self.App.ctx.stroke();
            self.App.ctx.beginPath();
            self.App.ctx.arc(0,0,Math.round(0.1*$p.r),0,2*Math.PI,true);
            self.App.ctx.fill();

            // todo: stopped here, create getter/setter to retrieve vector info
            // rotate back and show allowed distance
            self.App.ctx.rotate(-_theta*Math.PI/180);
            getDistance();
            self.App.ctx.beginPath();
            self.App.ctx.fillStyle='Khaki';
            self.App.ctx.arc(0,0,Math.round(0.25*$p.r),0,2*Math.PI,true);
            self.App.ctx.fill();
            self.App.ctx.stroke();
            self.App.ctx.textBaseline = 'middle';
            self.App.ctx.textAlign = 'center';
            self.App.ctx.fillStyle='Black';
            self.App.ctx.fillText($vector.d.toString(),0,0);

            // draw cartesian coordinates for directions

            self.App.ctx.restore();
        };

        // private methods
        function process(){
            switch(self.App.Event.Last){
                case self.App.Event.CLICK:
                    // TODO: update Button to return isPressed property, no need to determine if pressed twice
                    if($isSet && !_isPressed && !_isSpinning){
                        // checked to see if user pressed compass
                        if(Math.pow(self.App.Event.Clicked.x - $p.x,2) + Math.pow(self.App.Event.Clicked.y - $p.y,2) < Math.pow($p.r,2)){
                            _isPressed = true;
                        }
                    }else if($isSet && !_isSpinning){
                            // apply torque
                            _torque = 1000;
                            //apply random limit to angular speed between one rev to 2 revs per second
                            _omega_max = Math.floor((Math.random()*360)+360);
                            console.log('omega_max = ',_omega_max);
                            _isSpinning = true;
                            _isPressed = false;
                    }else{
                        // round omega to nearest tens place and decide if spinning is complete
                        if(_torque == 0 && Math.round(_omega/10) == 0){
                            // set speed to zero since it is near enough
                            _omega = 0;
                            _omega_i = 0;
                            // reduce theta to confines of one circle
                            _theta = _theta % 360;
                            _theta_i = _theta;
                            _theta_ii = _theta;
                            _isSpinning = false;
                            $isSet = false;
                        }
                    }
                    break;
                default:
                    // nothing
            }
        }

        // todo: update all class to prefix private variables with '_', public variables with '$'
        function nextTheta(){
            // the App only updates each time the timer trips, the delta time is nominally always the trip time
            var $dt = self.App.timer.trip/1000;

            // limit angular speed to maximum randomly set by spin action
            if(_omega > _omega_max){
                _torque = 0;
            }

            // only calculate if in motion
            if(_isSpinning){
                // chop delta t into smaller division to solve differential equation
                $dt = $dt/100;
                for(var i= 1;i<=100;i++){
                    // new angular position calculation, kinematics assumes unity values for damping and inertia
                    _theta_ii = _theta_i;
                    _theta_i = _theta;
                    _theta = (_torque * $dt*$dt + _theta_i * (2 + $dt) - _theta_ii) / (1 + $dt);

                    // new angular speed calculation
                    _omega_i = _omega;
                    _omega = (_torque*$dt + _omega_i) / (1 + $dt);
                }
            }
        }

        function getDistance(){
            if(_isSpinning){
                // set distance as 1 to the maximum allowed
                $vector.d = Math.floor((Math.random()*$p.maxTravel)+1);
            }
        }
    }

    // setup the inheritance chain
    Compass.prototype = Object.create(Model.prototype);
    Compass.prototype.constructor = Compass;

    return Compass;

});