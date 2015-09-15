/**
 * File: Setup
 * User: jderouen
 * Date: 11/20/13
 * Time: 12:58 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 *
 */
define(
    'app/game/storySprites/state/Setup',
    [
        'app/State',
        'app/etc/Frame',
        'app/input/Button',
        'app/input/Select',
        'app/input/Label'
    ]
    ,function
        (
            State,
            Frame,
            Button,
            Select,
            Label
        )
    {

        // declare private variables for all instances of Game.StorySprites.Setup for access by prototype methods
        var _line = 0,                  // subdivision of canvas height into lines
            _frame = null,              // framing around display
            _playBtn = null,            // the play button
            _playerSelect = null,       // player selection box
            _playerSelectLabel = null,  // player selection box label
            _playerCfgLabel = null,     // guidance for configuring players
            _titleLabel = null;         // title of display

        var _flag = {
            PlayerSelected: false
        }

        function Setup(){
            //console.log('Ready construct');
            var self = this;    // required to bypass scoping problem with parent superclass
            State.call(this);
            self.name = 'GAME.STORYSPRITES.SETUP';
            self.App.log(self.App.logLevel.INFO,'START Game.StorySprites.Setup.Construct()');

            // divide canvas height into ten lines for display of content
            _line = 0.1 * self.App.canvas.width;

            // state private variables
            /**
             *
             * @type {app.etc.Frame}
             * @private
             */
            _frame = new Frame(
                {
                    outerColor: 'SeaShell',
                    innerColor: 'SlateGray',
                    borderColor: '#47525C',
                    width: self.App.canvas.width,
                    height: self.App.canvas.height,
                    thickness: _line                    // this leaves 8 interior lines for content
                }
            );
            _titleLabel = new Label(
                {
                    x: _frame.thickness,
                    y: _frame.thickness,
                    width: self.App.canvas.width - 2*_frame.thickness,
                    height: _line,
                    textColor:'White',
                    font:'bold 16px Cooper Black',      // size and style as specified for context object, e.g. bold 6px Cooper Black
                    align:'center',
                    text:   'STORY SPRITES SETUP'
                }
            );
            _playerSelectLabel = new Label(
                {
                x: _frame.thickness,
                y: _titleLabel.y + _line,
                width: self.App.canvas.width - 2*_frame.thickness,
                height: _line,
                textColor:'White',
                font:'bold 14px Cooper Black',      // size and style as specified for context object, e.g. bold 6px Cooper Black
                align:'center',
                text:'Select the number of players:'
                }
            );
            _playerSelect = new Select(
                {
                x: (self.App.canvas.width - 5*_line)/2,     // center select box
                y: 0.2 * self.App.canvas.height,
                width: 5*_line,
                height: _line,
                event: self.App.Event.SELECT,
                selection: new Array
                    (
                    {key:1,text:'Two Players',value:2},
                    {key:2,text:'Three Players',value:3},
                    {key:4,text:'Four Players',value:4}
                    )
                }
            );
            _playerCfgLabel = new Label(
                {
                    x: 2*_line,
                    y: _playerSelect.y + _line,
                    width: self.App.canvas.width - 4*_line,
                    height: _line,
                    textColor:'White',
                    font:'bold 14px Cooper Black',      // size and style as specified for context object, e.g. bold 6px Cooper Black
                    align:'center',
                    text:'Change player names and pick your tokens'
                }
            );
            _playBtn = new Button(
                {
                    x: (self.App.canvas.width - 5*_line)/2,
                    y: self.App.canvas.height - 2*_line,
                    width: 5*_line,
                    height: _line,
                    text: 'PLAY GAME!',
                    event: self.App.Event.PLAY
                }
            );
            var _2PLAYERS = _playerSelect.selection[0];
            var _3PLAYERS = _playerSelect.selection[1];
            var _4PLAYERS = _playerSelect.selection[2];


            self.App.log(self.App.logLevel.INFO,'END Game.StorySprites.Setup.Construct()');

            return self;
        }

        // setup the inheritance chain
        Setup.prototype = Object.create(State.prototype);
        Setup.prototype.constructor = Setup;

        // overwrite default process and _draw methods
        Setup.prototype.process = function(){
            // execute state transition processing, activate new state and deactivate previous as appropriate
            switch(true){
                case (this.App.Event.Last == this.App.Event.INITIALIZE):
                    this._draw();
                    break;
                case (this.App.Event.Last == this.App.Event.WAIT):
                    this._draw();
                    break;
                // user pressed "PLAY" button, start game;
                case (this.App.Event.Last == this.App.Event.PLAY):
                    this.App.log(this.App.logLevel.DEBUG,'Transition from Game.Setup to Game.PLAY');
                    // activate Game.Setup state
                    this.App.State = this.App.Game.Play;
                    break;
                // user selected StorySprites, complete transition to Setup state and then wait
                case (this.App.Event.Last == this.App.Event.START):
                    console.log('Transition Game.Setup');
                    if(this.inTransition){
                        this._transition(this.SHOW_IMMEDIATELY);
                    }else{
                        this._draw();
                        this.App.Event.Last = this.App.Event.WAIT;
                    }
                    break;
                // The STOP event triggers transition to the READY state
                case (this.App.Event.Last == this.App.Event.STOP):
                    if(this.inTransition){
                        this._transition(this.SHOW_IMMEDIATELY);
                    }else{
                        this._draw();
                    }
                    break;
                case (this.App.Event.Last == this.App.Event.SELECT):
                    // TODO:  likely need to instantiate players here in order to set token position
                    this.App.Game.players = _playerSelect.selected.value;
                    // place each player under the player configuration label
                    for(var i=0; i<_playerSelect.selected.value; i++){
                        var _player = this.App.Game.players[i];
                        _player.setup = true;
                        switch(i){
                            // left justify first player with player Select box
                            case 0:
                                _player.x = _playerSelect.x;
                                _player.y = _playerCfgLabel.y + _playerCfgLabel.height + _line;
                                break;
                            case 1:
                                _player.x = _playerSelect.x + _playerSelect.width - _player.token.width;
                                _player.y = _playerCfgLabel.y + _playerCfgLabel.height + _line;
                                break;
                            case 2:
                                _player.x = _playerSelect.x;
                                _player.y = this.App.Game.players[0].y + this.App.Game.players[0].token.height + _line;
                                break;
                            case 3:
                                _player.x = _playerSelect.x + _playerSelect.width - _player.token.width;
                                _player.y = this.App.Game.players[0].y + this.App.Game.players[0].token.height + _line;
                                break;
                        }

                    }
                    this.App.Event.Last = this.App.Event.WAIT;
                    break;
                default:
                    this._draw();
                    break;
            }

            return true;
        };

        Setup.prototype._draw = function(){
            this.App.ctx.clearRect(0,0,this.App.canvas.width,this.App.canvas.height);
            this.App.ctx.font="bold 16px Cooper Black";
            //this.App.ctx.textBaseline = 'middle';
            //this.App.ctx.textAlign = 'center';
            this.App.ctx.fillStyle='White';

            _frame.draw();
            _titleLabel.draw();
            _playerSelectLabel.draw();

            if(_playerSelect.selected.value != 0){
                _playerCfgLabel.draw();
                for (var i=0; i<this.App.Game.players.length; i++){
                    this.App.Game.players[i].draw();
                }
                _playBtn.draw();
            }

            _playerSelect.draw();

        }

        return Setup;

    });