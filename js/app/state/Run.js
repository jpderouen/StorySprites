/**
 * File: Run
 * User: jderouen
 * Date: 6/22/13
 * Time: 12:05 PM
 * To change this template use File | Settings | File Templates.
 */
define(
    'app/state/Run',
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
    function Run(App){
        //console.log('Run construct, App.ctx = ',App.ctx);
        State.call(this);
        var self = this;
        // name this state
        self.name = 'RUN';

        var _App = App;     // maintain a pointer to the App object for global control functions

        // variables for controlling screen transition
        var x = 0;          // current x position of the screen in transition
        var y = 0;          // current y position of screen in transition

        // track turn status
        var _myTurn = {
            toSPIN:   'to SPIN',
            toMOVE:   'to MOVE',
            isOver:   'is OVER',
            Now:      'to SPIN'
        };

        var _Isaac = new Anime(_App,{name:'Isaac',rows:2,cols:5,height:240,width:600});

        // Define zones
        var _zone = {
            Main: new Frame(
                _App,
                {
                    x: 0,
                    y: 0,
                    outerColor: '#CCCCE8',
                    innerColor: '#00002A',
                    borderColor: '#00000E',
                    backColor: 'Black',
                    width: _App.canvas.width,
                    height: _App.canvas.height * 0.8,
                    thickness: 0.05 * _App.canvas.width
                }),
            Ctrl: new Frame(
            _App,
            {
                x: 0,
                y: _App.canvas.height * 0.8,
                outerColor: 'GoldenRod',
                innerColor: '#6D5210',
                borderColor: '#2C2106',
                backColor: '#6D5210',
                width: _App.canvas.width,
                height: _App.canvas.height * 0.2,
                thickness: 0.02 * _App.canvas.width
            })
        };

        var _board = new Board(
            _App,
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
        var _compass = new Compass(
            _App,
            {
                x: _zone.Ctrl.x+_zone.Ctrl.height/2,
                y: _zone.Ctrl.y+_zone.Ctrl.height/2,
                r: Math.round(0.9*(_zone.Ctrl.height-2*_zone.Ctrl.thickness)/2)
            }
        );

        // overwrite default process method
        self.process = function(){
            // execute state transition processing, activate new state and deactivate previous as appropriate
            switch(true){
                case (_App.Event.Last == _App.Event.STOP):
                    // deactivate current RUN state
                    self.deactivate();
                    // activate READY state and set transition flag
                    _App.State.inTransition = true;
                    _App.State = _App.Ready.activate();
                    console.log("Transition from RUN to READY");
                    break;
                case (_App.Event.Last == _App.Event.START):
                    if(!self.inTransition){
                        drawState();
                    }else{
                        // transition to Run screen;
                        ShowImmediately();
                        if(!self.inTransition){
                            console.log("Transition into RUN complete");
                        }
                    }
                    break;
                default:
                    drawState();
                    break;
            }

            return true;
        };

        // private methods
        function drawState(){
            _App.ctx.clearRect(0,0,_App.canvas.width,_App.canvas.height);
            _zone.Main.draw();
            _zone.Ctrl.draw();
            _compass.draw();
            // if compass value is set (user spun the compass), then
            // todo: need to set squares based on vector return and current player location
            if(_compass.isSet && _myTurn.Now != _myTurn.toMOVE){
                _myTurn.Now = _myTurn.toMOVE;
            }
            _board.draw();
            _Isaac.draw(_App.canvas.width-120,_App.canvas.height-125);
            _App.ctx.font="12px Georgia";
            _App.ctx.fillStyle = 'White';
            _App.ctx.fillText(_App.timer.now,0,10);
        }


    }

    // setup the inheritance chain
    Run.prototype = Object.create(State.prototype);
    Run.prototype.constructor = Run;

    return Run;

});