/**
 * File: Play
 * User: jderouen
 * Date: 12/12/13
 * Time: 1:03 PM
 * To change this template use File | Settings | File Templates.
 */
define(
    'app/game/storySprites/state/Play',
    [
        'app/State',
        'app/etc/Anime',
        'app/game/Board',
        'app/game/Compass',
        'app/etc/Frame'
    ],
    function
        (
            State,
            Anime,
            Board,
            Compass,
            Frame
        )
    {
        // Declare private variables for all instances of Game.StorySprites.Play states.  Allows for access by prototype methods
        var _zone = null;
        var _board = null;
        var _compass = null;
        var _myTurn = null;
        var _Isaac = null;

        function Play(){
            var self = this;
            State.call(self);

            // name this state
            self.name = 'GAME.STORYSPRITES.PLAY';
            self.App.log(self.App.logLevel.INFO,'START StorySprites.Play construct');

            // variables for controlling screen transition
            var x = 0;          // current x position of the screen in transition
            var y = 0;          // current y position of screen in transition


            // track turn status
            _myTurn = {
                toSPIN:   'to SPIN',
                toMOVE:   'to MOVE',
                isOver:   'is OVER',
                Now:      'to SPIN'
            };

            _Isaac = new Anime({name:'Isaac',rows:2,cols:5,height:240,width:600});

            // Define zones
            _zone = {
                Main: new Frame(
                    {
                        x: 0,
                        y: 0,
                        outerColor: '#CCCCE8',
                        innerColor: '#00002A',
                        borderColor: '#00000E',
                        backColor: 'Black',
                        width: self.App.canvas.width,
                        height: self.App.canvas.height * 0.8,
                        thickness: 0.05 * self.App.canvas.width
                    }),
                Ctrl: new Frame(
                    {
                        x: 0,
                        y: self.App.canvas.height * 0.8,
                        outerColor: 'GoldenRod',
                        innerColor: '#6D5210',
                        borderColor: '#2C2106',
                        backColor: '#6D5210',
                        width: self.App.canvas.width,
                        height: self.App.canvas.height * 0.2,
                        thickness: 0.02 * self.App.canvas.width
                    })
            };

            _board = new Board(
                {
                    x:_zone.Main.thickness,
                    y:_zone.Main.thickness,
                    width:_zone.Main.width - 2* _zone.Main.thickness,
                    height:_zone.Main.height - 2 * _zone.Main.thickness,
                    rowCount:12,
                    colCount:10
                }
            );

            // make compass radius as wide as control zone is high with a 5% pixel buffer top and bottom,
            // set background color same as control panel color
            _compass = new Compass(
                {
                    x: _zone.Ctrl.x+_zone.Ctrl.height/2,
                    y: _zone.Ctrl.y+_zone.Ctrl.height/2,
                    r: Math.round(0.9*(_zone.Ctrl.height-2*_zone.Ctrl.thickness)/2)
                }
            );

        return self;
        }

        // setup the inheritance chain
        Play.prototype = Object.create(State.prototype);
        Play.prototype.constructor = Play;

        // overwrite default process method
        Play.prototype.process = function(){
            // execute state transition processing, activate new state and deactivate previous as appropriate
            switch(true){
                case (this.App.Event.Last == this.App.Event.STOP):
                    this.App.State = this.Game.Ready;
                    console.log("Transition from RUN to READY");
                    break;
                case (this.App.Event.Last == this.App.Event.START):
                    if(!this.inTransition){
                        this._draw();
                    }else{
                        // transition to Run screen;
                        this._transition(this.SHOW_IMMEDIATELY);
                        if(!this.inTransition){
                            console.log("Transition into RUN complete");
                        }
                    }
                    break;
                default:
                    this._draw();
                    break;
            }

            return true;
        };

        Play.prototype._draw = function(){
            this.App.ctx.clearRect(0,0,this.App.canvas.width,this.App.canvas.height);
            _zone.Main.draw();
            _zone.Ctrl.draw();
            //_compass.draw();
            // if compass value is set (user spun the compass), then
            // todo: need to set squares based on vector return and current player location
            if(_compass.isSet && _myTurn.Now != _myTurn.toMOVE){
                _myTurn.Now = _myTurn.toMOVE;
            }
            _board.draw();
            _Isaac.draw(this.App.canvas.width-120,this.App.canvas.height-125);
            this.App.ctx.font="12px Georgia";
            this.App.ctx.fillStyle = 'White';
            this.App.ctx.fillText(this.App.timer.now,0,10);
            this.App.ctx.fillText('Current Model count = '+this.ModelCount,0,20);
        }

        return Play;

    });