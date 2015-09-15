/**
 * File: StorySprites
 * User: jderouen
 * Date: 11/21/13
 * Time: 8:06 PM
 * To change this template use File | Settings | File Templates.
 */
define(
    'app/game/StorySprites',
    [
        'app/game/storySprites/state/Setup',
        'app/game/storySprites/state/Play',
        'app/game/Tokens',
        'app/game/storySprites/Player',
        'app/Game'
    ],
    function(
        Setup,
        Play,
        Tokens,
        Player,
        Game
    ){

    // protected application state variables
    var _Setup;// = new Ready(self);
    var _Play;// = new Run(self);

    function StorySprites(data){
        var self = this;    // required to bypass scoping problem with parent superclass
        self.Name = 'storySprites';

        var _focus = 0;        // player of focus
        var _p = {
            tokens: null,
            player: null,       // always the player in focus
            players: Array()    // array of all players
        };

        Object.defineProperty(self,'players',{
            get: function() {
                return _p.players;
            },
            set: function(x){
                var _diff = x - _p.players.length;
                var _player;

                if(_diff < 0){
                    for(var i=0;i>_diff;i--){
                        _player = _p.players.pop();
                        // release the token for use by other players
                        _player.token.selected = false;
                    }
                }else if(_diff == 0){
                        // do nothing
                }else{
                    for(var i=0;i<_diff;i++){
                        _p.players.push(new Player({name:'Player '+i}));
                    }
                };
            }
        });
        Object.defineProperty(self, 'focus', {
            get: function(){
                return _focus;
            },
            set: function(x){
                if(x>0 && x<_p.players.length){
                    _focus = x;
                }else{
                    self.App.log(self.App.logLevel.WARN,'StorySprites.focus set out of range and therefore ignored');
                }
            }
        });
        Game.call(self,data);

        self.App.log(self.App.logLevel.INFO,'START Game.StorySprites construct()');


        self.App.log(self.App.logLevel.INFO,'END Game.StorySprites construct()');

        return self;
    }

    /*
     We setup the inheritance chain of the sub class so that instanceof returns true for both superclass and
     subclass and to be good citizens we also setup the constructor property to our constructor function.
    */
    // Extend the Game class
    StorySprites.prototype = Object.create(Game.prototype);
    //StorySprites.prototype = Game.prototype;
    StorySprites.prototype.constructor = StorySprites;

    Object.defineProperty(StorySprites.prototype,"Setup",{
        get: function() {
            if (!(_Setup instanceof Setup)){
                _Setup = new Setup();
            }
            return _Setup;
        }
    });
    Object.defineProperty(StorySprites.prototype,"Play",{
        get: function() {
            if (!(_Play instanceof Play)){
                _Play = new Play();
            }
            return _Play;
        }
    });
    // return the constructor
    return StorySprites;

    });