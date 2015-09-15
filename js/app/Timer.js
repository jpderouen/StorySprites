/**
 * File: Timer
 * User: jderouen
 * Date: 7/30/13
 * Time: 1:08 PM
 * To change this template use File | Settings | File Templates.
 */
define('app/Timer',['app/Model'], function(Model){

    function Timer(data){
        var self = this;
        // Class initialization

        // class properties
        var _p = {
            now: 0,             // total time since start of timer current incremental
            trip: 0,            // determines time in milliseconds dictating trip of timer, if zero, timer does not trip
            delta: 0,           // value of the timer between tripping points
            isTripped: false    // flags if timer is tripped, resets after read
        };

        // private variables
        var _timeNow = Date.now();   // current date stamp
        var _timeThen = Date.now();  // previous date stamp when timer last accessed
        // error feedback

        //console.log('START Timer construct, arguments = ', $data);

        // define setters and getters
        Object.defineProperty(self,"trip",{
            get: function() {
                return _p.trip;
            },
            set: function(x) {
                if(isNumber(x)){
                    _p.trip = x;
                }else{
                    self.App.State = self.App.Error;
                    self.App.State.msg = 'Attempted to set Timer.trip to a non-numeric value.';
                }

            }
        });
        Object.defineProperty(self,"isTripped",{
            get: function() {
                // always update the Timer
                updateTimer();
                return _p.isTripped;
            },
            set: function(x){
                _p.isTripped = x;
                // update the timer, it may have tripped again
                updateTimer();
            }
        });
        Object.defineProperty(self,"now",{
            get: function() {
                updateTimer();
                return _p.now;
            },
            set: function(x) {
                if(isNumber(x)){
                    _p.delta = x;
                    _p.now = x;
                    _timeThen = Date.now();
                }else{
                    self.App.State = self.App.Error;
                    self.App.State.msg = 'Attempted to set Timer.now to a non-numeric value.';
                }

            }
        });
        Object.defineProperty(self,"delta",{
            get: function() {
                return _p.delta;
            }
        });

        // call superclass and data array
        Model.call(this,data);
        // start constructor logic
        self.App.log(self.App.logLevel.DEBUG,'START App.Timer, data = '+ JSON.stringify(data));

        // public methods
        self.reset = function(){
            _timeNow = Date.now();
            _p.delta = 0;
            _p.now = 0;
            _p.dt = 0;
            _timeThen = Date.now();

            return _p.now;
        };
        self.mark = function(){
            /* Stores timer value into an array.  Array continues to grow
            based on calls to this function.
             */

            return true;
        };

        // private methods
        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        function updateTimer(){
            _timeNow = Date.now();
            var $dt = (_timeNow-_timeThen)%_p.trip;
            _p.delta = _p.delta + $dt;          // accumulate delta time between trips, but not more than trip window
            _p.now = _p.now+_p.delta;           // accumulate total time since start of timer
            _timeThen = _timeNow;

            // determine if timer tripped
            if(_p.delta > _p.trip){
                _p.isTripped = true;
                _timeNow = Date.now();
                // assign current value to the excess amount beyond tripping point,
                // limit accumulation to less than the tripping point
                _p.delta = _p.delta % _p.trip;
                //value = value - _p.trip;
                _timeThen = Date.now();
            }
        }

        //console.log('END Timer construct, timer = ', _p);
    }

    // setup the inheritance chain
    Timer.prototype = Object.create(Model.prototype);
    Timer.prototype.constructor = Timer;

    return Timer;
});


