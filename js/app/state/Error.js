/**
 * File: Error
 * User: jderouen
 * Date: 6/22/13
 * Time: 12:07 PM
 * To change this template use File | Settings | File Templates.
 */
define('app/state/Error',['app/State','app/input/Button'],function(State,Button){

    var _RESET = 'RESET';
    var _homeBtn = null;
    var _OB1 = new Image(); //creates a variable for a new image
    var _droids = new Image();

    function Error(){
        //console.log('Error construct');
        var self = this;

        State.call(this);

        self.App.log(self.App.logLevel.INFO,'START App.Error.construct()');

        self.name = 'Error';


        _homeBtn = new Button(
            {
                x: 0.2 * self.App.canvas.width,
                y: 0.8 * self.App.canvas.height,
                width: self.App.canvas.width * 0.6,
                height: self.App.canvas.width * 0.1,
                text: 'Reset Program',
                value: _RESET,
                event: self.App.Event.SELECT
            }
        );

        _OB1.src= "img/OB1.jpg"; // specifies the location of the image
        _droids.src = "img/droids.jpg"

        self.App.log(self.App.logLevel.INFO,'END App.Error.construct()');

    }

    // setup the inheritance chain
    Error.prototype = Object.create(State.prototype);
    Error.prototype.constructor = Error;

    // overwrite parent process method
    Error.prototype.process = function(){
        // execute state transition processing, activate new state and deactivate previous as appropriate
        switch(true){
            case (this.App.Event.Last == this.App.Event.SELECT):
                if(this.App.Event.Value = _RESET){
                    this.App.State.resetTo(this.App.Ready);
                }
                this.App.Event.Last = this.App.Event.WAIT;
                break;
            default:
                this._draw();
                break;
        }

        return true;
    };
    Error.prototype._draw = function(){
        //process();
        this.App.ctx.save();
        this.App.ctx.clearRect(0,0,this.App.canvas.width,this.App.canvas.height);
        this.App.ctx.drawImage(_OB1,(this.App.canvas.width-_OB1.width)/2,10);
        this.App.ctx.textBaseline = 'middle';
        this.App.ctx.textAlign = 'center';
        this.App.ctx.font="bold 24px Cooper Black";
        this.App.ctx.fillText('These are not the droids',this.App.canvas.width/2,this.App.canvas.height/2-2*24);
        this.App.ctx.fillText('your looking for...',this.App.canvas.width/2,this.App.canvas.height/2-24);
        this.App.ctx.font="bold 18px Cooper Black";
        this.App.ctx.fillText(this.App.State.msg,this.App.canvas.width/2,this.App.canvas.height/2);
        this.App.ctx.drawImage(_droids,(this.App.canvas.width-_droids.width)/2,this.App.canvas.height/2+24);
        _homeBtn.draw();
        this.App.ctx.restore();
    };

    return Error;

});