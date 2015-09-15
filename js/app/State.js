/**
 * File: State
 * User: jderouen
 * Date: 5/23/13
 * Time: 9:33 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * @namespace
 */
define('app/State',['app/Model'],function(Model){
    // Class initialization

    // private variables shared across instances of all State objects
    var _inTransition = false;  // flag marking when state transition complete
    var _x = 0;                 // current x position of the screen in transition
    var _y = 0;                 // current y position of screen in transition

   // var _idCount = 0;           // track the number of Game instances
    var _prev = null;           // stores the previous state across all instances of states
    var _now = null;
    var _msg = new Array();

    // State superclass holds main content of all transition functions, constructor just point back to it.
    // Argument includes draw callback function, which insures that the draw method for the calling state is executed.
    function EnterFromLeft(self){
        var dx = 5;    // number of pixels to shift in during one step

        // translate to left of screen for show transition effect
        self.App.ctx.translate(_x-self.App.canvas.width,0);
        self._draw();
        // translate back to origin
        self.App.ctx.translate(self.App.canvas.width-_x,0);
        _x=_x+dx;
        if(_x>self.App.canvas.width){
            _x = 0;
            self.inTransition = false;
        }
    }
    function SwipeFromTopLeft(self){
        //creates a variables controlling state transition
        var dx = 5;    // number of pixels to shift in during one step
        var dy = dx * self.App.canvas.height / self.App.canvas.width;

        self._draw();
        self.App.ctx.clearRect(_x,0,self.App.canvas.width,self.App.canvas.height);
        self.App.ctx.clearRect(0,_y,self.App.canvas.width,self.App.canvas.height);
        _x=_x+dx;
        _y=_y+dy;

        if(_x>self.App.canvas.width){
            _x = 0;
            self.inTransition = false;
        }
    }
    // Shows state immediately, no transition effect.  Pass self reference in order to run
    // getters, setters, and methods as appropriate for the calling state
    function ShowImmediately(self){
        _x = 0;
        self.inTransition = false;
        self._draw();
    }

    // Class constructor
    /**
     *
     * @class       - State object identifying application state
     */
    function State(){
        var self = this;
        // call superclass
        Model.call(this);
        //self.App.log(self.App.logLevel.INFO,'START '+ self.constructor.name + '.construct()');


        // private variables
        var _name = 'You forgot to name your State';
        //var _id = nextId();     // unique id for this State

        Object.defineProperty(self,"ENTER_FROM_LEFT",{
            get: function() {
                return "ENTER_FROM_LEFT";
            }
        });
        Object.defineProperty(self,"SWIPE_FROM_TOP_LEFT",{
            get: function() {
                return "SWIPE_FROM_TOP_LEFT";
            }
        });
        Object.defineProperty(self,"SHOW_IMMEDIATELY",{
            get: function() {
                return "SHOW_IMMEDIATELY";
            }
        });
        Object.defineProperty(self,"name",{
            get: function() {
                return _name;
            },
            set: function(x){
                _name = x;
            }
        });
        Object.defineProperty(self,'prev',{
            get: function() {
                return _prev;
            }
        });
        Object.defineProperty(self,'now',{
            get: function() {
                return _now;
            },
            set: function(x){
                _prev = _now;
                _now = x;
            }
        });
        Object.defineProperty(self,"inTransition",{
            get: function() {
                return _inTransition;
            },
            set: function(x){
                self.App.log(self.App.logLevel.DEBUG,'set State.inTransition = ' + x);
                _inTransition = x;
                if (_inTransition){
                    _x = 0;
                }
            }
        });
        Object.defineProperty(self,"msg",{
            get: function() {
                var msg = '';
                var i = 0;

                for(i=0;i<_msg.length;++i){
                    msg = _msg[i] + '; ';
                }

                // remove the trailing '; ' from the msg string
                if(msg != ''){
                    msg = msg.substring(0,msg.length - 2);
                }

                return msg;
            },
            set: function(x){
                self.App.log(self.App.logLevel.INFO, 'State.msg pushed = ' + x);
                _msg.push(x);
            }
        });

    }

    // setup the inheritance chain
    State.prototype = Object.create(Model.prototype);
    State.prototype.constructor = State;

    // use prototype extension for all public methods in order to maintain prototype chain
    State.prototype.process = function(){
        // create a unique process function for each state
        this.App.log(this.App.logLevel.ERROR,'You forgot to make a "process" method for State = ' + this.App.State.name);
        this.App.State = this.App.ERROR;

        return false;
    };
    State.prototype.activate = function(){
        // make sure new state is different then old state
        if(_now == null || this.id != _now.id){
            // make sure not in error state (assumes error states named 'Error').  Likely better to create an isError
            // attribute to flag state as an error state in case something different should be done depending on error
            if(_now == null ||_now.name != 'Error'){
                _prev = _now;
                _now = this;
                this.App.log(this.App.logLevel.INFO,'State.activate, State now = ' + _now.name);
                // set transition flag for animating transition of states
                this.inTransition = true;
            }
        }
        return this;
    };
    // allows state to be reset to another after occurrence of an error
    State.prototype.resetTo = function(x){
        var ret = false;

        if(x instanceof(State)){
            _prev = _now;
            _now = x;
            ret = true;
        }

        return ret;
    }
    // really want these methods protected, but JavaScript is limited
    State.prototype._draw = function(){
        this.App.log(this.App.logLevel.ERROR,'You forgot to create a "draw" method for this state = ', this.name);
        this.App.State = this.App.ERROR;
    };

    State.prototype._transition = function($effect){
        switch($effect){
            case this.ENTER_FROM_LEFT:
                EnterFromLeft(this);
                break;
            case this.SWIPE_FROM_TOP_LEFT:
                SwipeFromTopLeft(this);
                break;
            case this.SHOW_IMMEDIATELY:
                ShowImmediately(this);
                break;
            default:
        }
    };

    return State;

});

/*
 // requirejs module
 define('Person', function() {
      // class variable
      var id = 0;
      // class method
      function nextId() {
              return ++id;
          }
      // constructor
      function Person(name) {
              var self = this;
              // private members
               v ar color = 'everything';
               // private methods
               function likes() {
                           return self.name + ' likes ' + color;
                       }
               // public members
               self.id = nextId();
               self.name = name;
               // public methods
               self.setColor = function(c) {
                           color = c;
                   };
               self.print = function() {
                           console.log(likes());
                   };
               }
               // return constructor
               return Person;
       });
*/