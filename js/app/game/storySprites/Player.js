/**
 * File: Player
 * User: jderouen
 * Date: 11/11/13
 * Time: 12:11 PM
 * To change this template use File | Settings | File Templates.
 */

define('app/game/storySprites/Player',['app/Model','app/game/Token','app/etc/Frame'],function(Model,Token,Frame){

    var _playerCount = 0;

    // override the private Model array that stores x and y position for each Model
    var _x = new Array();
    var _y = new Array();

    function Player(data){
        // Class constructor
        var self = this;
        // create local pointer to app object for use of global timer and canvas controlled by App

        // define class properties */
        var _p = {
            name: 'PlayerX',
            setup: false,
            myTurn: false
        };

        // protected variables
        var _token = null;
        var _frame = null;      // token demarcation for selection

        // Class setters and getters, setters and getters must be declared first so constructor can utilize them
        Object.defineProperty(self,'token',{
            get: function() {
                return _token;
            },
            set: function(x){
                if (x instanceof Token){
                    _token = x;
                }
            }
        });
        Object.defineProperty(self,'frame',{
            get: function() {
                return _frame;
            },
            set: function(x){
                if (x instanceof Frame){
                    _frame = x;
                }
            }
        });
        Object.defineProperty(self,'name',{
            get: function() {
                return _p.name;
            },
            set: function(x){
                _p.name = x;
            }
        });
        Object.defineProperty(self,'setup',{
            get: function() {
                return _p.setup;
            },
            set: function(x){
                // todo: validate boolean
                _p.setup = x;
            }
        });
        Object.defineProperty(self,'myTurn',{
            get: function() {
                return _p.myTurn;
            },
            set: function(x){
                _p.myTurn = x;
            }
        });
        Object.defineProperty(self,'PlayerCount',{
            get: function() {
                return _playerCount;
            }
        });

        // START constructor logic
        Model.call(self,data);
        self.App.log(self.App.logLevel.INFO,'StorySprites.Player constructor, data = ' + JSON.stringify(data));

        _playerCount = _playerCount++;

        // create player token, set position same as player position
        _token = new Token({x:self.x,y:self.y});

        _frame = new Frame(
            {
                outerColor: 'Blue',
                innerColor: 'Yellow',
                backColor: 'Yellow',
                borderColor: 'Black',
                thickness: Math.round(0.2 * _token.height),
                height: _token.height + 2 * Math.round(0.2 * _token.height),
                width: _token.width + 2 * Math.round(0.2 * _token.height)
            }
        );

        // set frame origin in order to center token within frame
        _frame.x = self.x - (_frame.width - _token.width)/2;
        _frame.y = self.y - (_frame.height - _token.height)/2;

        // public methods
        self.draw = function(){

            if(self.setup){
                _frame.draw();
            }

            _token.draw();

        };

    }

    // setup the inheritance chain
    Player.prototype = Object.create(Model.prototype);
    Player.prototype.constructor = Player;

    // override x and y properties setters and getters
    Object.defineProperty(Player.prototype,'x',{
        get: function() {
            return _x[this.id];
        },
        set: function(x){
            // todo: this backfills array with null values when indexes are skipped, need to fix this with associative array
            _x[this.id] = x;
            this.token.x = x;
            this.frame.x = this.x - (this.frame.width - this.token.width)/2;
            console.log('Player.frame.x = ',this.frame.x);
        }
    });
    Object.defineProperty(Player.prototype,'y',{
        get: function() {
            return _y[this.id];
        },
        set: function(y){
            _y[this.id] = y;
            this.token.y = y;
            this.frame.y = this.y - (this.frame.height - this.token.height)/2;
            console.log('Player.frame.y = ',this.frame.y);
        }
    });

    return Player;

});