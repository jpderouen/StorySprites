/**
 * File: Game
 * User: jderouen
 * Date: 11/21/13
 * Time: 7:16 PM
 * Foundation properties and methods as part of a Game.
 */
define('app/Game', ['app/State','app/Model'],function(State,Model){
    // Class initialization
    // class-wide shared variables and functions can be defined here
    var _idCount = 0;     // track the number of Game instances

    // shared class method that indexes each new Game uniquely
    function nextId(){
        return ++_idCount;
    }

    /*
     All member functions whether public or private have access to the internal (i.e. private) variables.
     The closure of the requirejs module provides the class variables and functions. The closure over the
     constructor function provides the private members and methods.
    */
    function Game(data){
        // private variables
        // local point to application object
        var self = this;

        // define protected variables that can be defined during instantiation */
        var _p = {
            Id: nextId(),
            Name: '',
            State: null        // state of the game, minimally Setup and Play
        };

        Object.defineProperty(self,'Name', {
            get: function() {
                return _p.Name;
            },
            set: function(x){
                _p.Name = x;
            }
        });
        Object.defineProperty(self,'State',{
            get: function() {
                return _p.State;
            },
            set: function(x){
                _p.State = x;
            }
        });
        Object.defineProperty(self,"Id",{
            get: function() {
                return _p.Id;
            }
        });

        // call superclass and data array
        Model.call(this,data);

        self._draw = function(){
            // create a unique draw function for each game
            if(self.App.Event.Last!=self.App.Event.ERROR){
                alert('You forgot to make a "draw" method for Game = '+self.Name);
                self.App.Event.Last = self.App.Event.ERROR;
                self.App.State = self.App.Error;
            }

            return false;
        };


        // return self for chaining after construction
        return self;
    }
    // create skeleton states Setup and Play, expectation is that any Game will have these states
    Object.defineProperty(Game.prototype,"Setup",{
        get: function() {
            // catch attempts to access the game setup state that was not defined in the subclass
            if(this.App.Event.Last!=this.App.Event.ERROR){
                this.App.State.msg = 'You forgot to make a "Setup" state for Game = '+this.Name;
                this.App.Event.Last = this.App.Event.ERROR;
                this.App.State = this.App.Error;
            }
            return null;
        }
    });
    Object.defineProperty(Game.prototype,"Play",{
        get: function() {
            // catch attempts to access the game Play state that was not defined in the subclass
            if(this.App.Event.Last!=this.App.Event.ERROR){
                this.App.State.msg = 'You forgot to make a "Play" state for Game = '+this.Name;
                this.App.Event.Last = this.App.Event.ERROR;
                this.App.State = this.App.Error;
            }
            return null;
        }
    });

    // setup the inheritance chain
    Game.prototype = Object.create(Model.prototype);
    Game.prototype.constructor = Game;

    // return constructor
    return Game;

});