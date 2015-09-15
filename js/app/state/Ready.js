/**
 * File: Ready2
 * User: jderouen
 * Date: 5/25/13
 * Time: 9:50 PM
 * To change this template use File | Settings | File Templates.
 */

define(
    'app/state/Ready',
    [
        'app/State',
        'app/etc/Frame',
        'app/input/Button',
        'app/game/StorySprites'
    ]
    ,function
    (
        State,
        Frame,
        Button,
        StorySprites
    )
    {
    // private variables for use by instances of App.Ready
    var _SPRITES = 'Story Sprites';     // used to identify choice of game
    var _frame = null;
    var _spritesBtn = null;
    var _otherBtn = null;

    function Ready(){
        var self = this;    // required to bypass scoping problem with parent superclass

        console.log('App.Ready construct');
        var _game = {
            StorySprites: null
        };

        Object.defineProperty(self,'StorySprites',{
            get: function(){
                if (!(_game.StorySprites instanceof StorySprites)){
                    _game.StorySprites = new StorySprites();
                }
                return _game.StorySprites;
            }
        });

        State.call(self);
        self.name = 'APP.READY';
        self.App.log(self.App.logLevel.INFO,'START App.Ready.construct()');

        _frame = new Frame(
            {
                outerColor: 'SeaShell',
                innerColor: 'SlateGray',
                borderColor: '#47525C',
                width: self.App.canvas.width,
                height: self.App.canvas.height,
                thickness: 0.1 * self.App.canvas.width
            }
        );
        _spritesBtn = new Button(
            {
                x: 0.2 * self.App.canvas.width,
                y: 0.2 * self.App.canvas.width,
                width: self.App.canvas.width * 0.6,
                height: self.App.canvas.width * 0.1,
                text: 'Story Sprites!',
                value: _SPRITES,
                event: self.App.Event.SELECT
            }
         );
        //var $playBtn = new Button;
        _otherBtn = new Button(
            {
                x: 0.2 * self.App.canvas.width,
                y: _spritesBtn.y +  1.2 * _spritesBtn.height,
                width: self.App.canvas.width * 0.6,
                height: self.App.canvas.width * 0.1,
                text: 'Other Game',
                event: self.App.Event.WAIT
            }
        );


        self.App.log(self.App.logLevel.INFO,'END App.Ready.construct()');

    }

    // setup the inheritance chain
    Ready.prototype = Object.create(State.prototype);
    Ready.prototype.constructor = Ready;
    //Ready.prototype.parent = Ready.prototype;

    // overwrite parent process method
    Ready.prototype.process = function(){
        // execute state transition processing, activate new state and deactivate previous as appropriate
        switch(true){
            case (this.App.Event.Last == this.App.Event.INITIALIZE):
                // anything for INITIALIZE?
                if(this.inTransition){
                    // wait for completion of transition
                    this._transition(this.SHOW_IMMEDIATELY);
                }else{
                    this._draw();
                }
                break;
            case (this.App.Event.Last == this.App.Event.WAIT):
                // anything for WAIT?
                this._draw();
                break;
            // The STOP event triggers transition to the READY state
            case (this.App.Event.Last == this.App.Event.STOP):
                if(this.inTransition){
                    this._transition(this.ENTER_FROM_LEFT);
                }else{
                    this._draw();
                }
                break;
            case (this.App.Event.Last == this.App.Event.SELECT):
                if(this.App.Event.Value == _SPRITES){
                    this.App.Game = this.StorySprites;
                    this.App.State = this.App.Game.Setup;
                    this.App.log(this.App.logLevel.DEBUG,'App.Game.id = ' + this.App.Game.Id);
                }
                this.App.Event.Last = this.App.Event.START;
                this._draw();
                break;
            default:
                this._draw();
                break;
        }

        return true;
    };
    Ready.prototype._draw = function(){
        //process();
        this.App.ctx.clearRect(0,0,this.App.canvas.width,this.App.canvas.height);
        _frame.draw();
        _spritesBtn.draw();
        _otherBtn.draw();
        // after everything has processed the current event, set to wait for next event


        };

    return Ready;

});
