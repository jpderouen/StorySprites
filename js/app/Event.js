/**
 * File: Event
 * User: jderouen
 * Date: 6/22/13
 * Time: 6:00 AM
 * To change this template use File | Settings | File Templates.
 */

define('app/Event',['app/Model'], function(Model){
    function Event(){
        //console.log("Event.construct()");
        var self = this;

        // private application constants
        var _KEYS = {        // keyboard constants for keys
            LEFT: 37,
            RIGHT: 39,
            UP: 38,
            DOWN: 40
        };
        // protected event map constants
        var $Events = {
            START:          'START',
            STOP:           'STOP',
            PAUSE:          'PAUSE',
            PLAY:           'PLAY',
            WAIT:           'WAIT',
            INITIALIZE:     'INITIALIZE',
            ERROR:          'ERROR',
            CLICK:          'CLICK',
            SPIN:           'SPIN',
            SELECT:         'SELECT',
            UNDEFINED:      'UNDEFINED'
        };
        // protected class properties
        var $p = {
            Last:       $Events.UNDEFINED,
            Prev:       $Events.UNDEFINED,
            Clicked:    {x:0,y:0},           // store relative x,y position of mouse click on canvas
            Value:      null
        };

        // Setters and Getters
        Object.defineProperty(self,"Last",{
            get: function() {
                // returns the key of the Event versus the value
                for(var me in $Events){
                    if($Events[me]==$p.Last)return me;
                }

                return $Events.UNDEFINED;
            },
            set: function(x) {
                if (x in $Events){

                    if($Events[x] != $p.Last){
                        $p.Prev = $p.Last;
                        $p.Last = $Events[x];
                        if($p.Last == $Events.SELECT){
                            self.App.log(self.App.logLevel.INFO,'set Event = ' + $p.Last + "; Value = " + $p.Value);
                        }else{
                            self.App.log(self.App.logLevel.INFO,'set Event = ' + $p.Last);
                        }
                    }

                }
            }
        });
        // return the key name for the Event constants, not the value
        Object.defineProperty(self,"START",{
            get: function(){
                return 'START';
            }
        });
        Object.defineProperty(self,"STOP",{
            get: function(){
                return 'STOP';
            }
        });
        Object.defineProperty(self,"PAUSE",{
            get: function(){
                return 'PAUSE';
            }
        });
        Object.defineProperty(self,"PLAY",{
            get: function(){
                return 'PLAY';
            }
        });
        Object.defineProperty(self,"INITIALIZE",{
            get: function(){
                return 'INITIALIZE';
            }
        });
        Object.defineProperty(self,"WAIT",{
            get: function(){
                return 'WAIT';
            }
        });
        Object.defineProperty(self,"ERROR",{
            get: function(){
                return 'ERROR';
            }
        });
        Object.defineProperty(self,"UNDEFINED",{
            get: function(){
                return 'UNDEFINED';
            }
        });
        Object.defineProperty(self,"CLICK",{
            get: function(){
                return 'CLICK';
            }
        });
        Object.defineProperty(self,"SPIN",{
            get: function(){
                return 'SPIN';
            }
        });
        Object.defineProperty(self,"SELECT",{
            get: function(){
                return $Events.SELECT;
            }
        });
        // return last clicked coordinates when requested
        Object.defineProperty(self,"Clicked",{
            get: function(){
                return $p.Clicked
            }
        });
        Object.defineProperty(self,"Value",{
            get: function(){
                return $p.Value
            },
            set: function(x){
                $p.Value = x;
            }
        });

        // call superclass and data array
        Model.call(this);
        self.App.log(self.App.logLevel.DEBUG,'START Event.construct()');

        self.ParseKeyboard = function(KeyPressed){
            var me;

            // check for valid key press, ignore others
            for(me in _KEYS){
                if(_KEYS[me]==KeyPressed){
                    $p.Prev = $p.Last;
                    $p.Last = KeyPressed;
                }
            }

            return $p.Last;
        };
        self.ClickedCanvas = function(e,canvas){
            var rect = canvas.getBoundingClientRect();
            // get mouse position relative to canvas
            self.Prev = self.Last;
            self.Last = $Events.CLICK;
            self.Clicked.x = e.clientX - rect.left;
            self.Clicked.y = e.clientY - rect.top;

            return self.Last;
        };

        self.App.log(self.App.logLevel.DEBUG,'END Event.construct()');
    }

    // setup the inheritance chain
    Event.prototype = Object.create(Model.prototype);
    Event.prototype.constructor = Event;

    // return Event class
    return Event;

});
