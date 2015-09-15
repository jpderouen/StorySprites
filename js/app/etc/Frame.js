/**
 * File: Frame
 * User: jderouen
 * Date: 11/6/13
 * Time: 7:14 PM
 * To change this template use File | Settings | File Templates.
 */

define('app/etc/Frame',['app/Model'],function(Model){

    function Frame(data){
        // Class constructor
        var self = this;

        // define class properties */
        var _p = {
            outerColor: 'Yellow',
            innerColor: 'Black',
            borderColor:'Black',
            backColor:'DarkSlateGray',
            thickness: 20,
            text: '',                   // text on button
            line: 2
        };

        // Class setters and getters, setters and getters must be declared first so constructor can utilize them
        Object.defineProperty(self,'outerColor',{
            get: function() {
                return _p.outerColor;
            },
            set: function(x){
                // check to see if setting to color name
                var xType = typeof x;

                if(xType == 'string'){
                    _p.outerColor = x;
                }else{
                    // check for valid hex color code
                    if(/^#[0-9A-F]{6}$/i.test(x)){
                        _p.outerColor = x;
                    }else{
                        self.App.State = self.App.Error;
                        self.App.State.msg = 'Attempted to set frame outerColor to unrecognized value = ' + x;
                    }
                }
            }
        });
        Object.defineProperty(self,'innerColor',{
            get: function() {
                return _p.innerColor;
            },
            set: function(x){
                // check to see if setting to color name
                var xType = typeof x;

                if(xType == 'string'){
                    _p.innerColor = x;
                }else{
                    // check for valid hex color code
                    if(/^#[0-9A-F]{6}$/i.test(x)){
                        _p.innerColor = x;
                    }else{
                        self.App.State = self.App.Error;
                        self.App.State.msg = 'Attempted to set frame innerColor to unrecognized value = ' + x;
                    }
                }
            }
        });
        Object.defineProperty(self,'borderColor',{
            get: function() {
                return _p.borderColor;
            },
            set: function(x){
                // check to see if setting to color name
                var xType = typeof x;

                if(xType == 'string'){
                    _p.borderColor = x;
                }else{
                    // check for valid hex color code
                    if(/^#[0-9A-F]{6}$/i.test(x)){
                        _p.borderColor = x;
                    }else{
                        self.App.State = self.App.Error;
                        self.App.State.msg = 'Attempted to set frame borderColor to unrecognized value = ' + x;
                    }
                }
            }
        });
        Object.defineProperty(self,'backColor',{
            get: function() {
                return _p.backColor;
            },
            set: function(x){
                // check to see if setting to color name
                var xType = typeof x;

                if(xType == 'string'){
                    _p.backColor = x;
                }else{
                    // check for valid hex color code
                    if(/^#[0-9A-F]{6}$/i.test(x)){
                        _p.backColor = x;
                    }else{
                        self.App.State = self.App.Error;
                        self.App.State.msg = 'Attempted to set frame backColor to unrecognized value = ' + x;
                    }
                }
            }
        });
        Object.defineProperty(self,'line',{
            get: function() {
                return _p.line;
            },
            set: function(x){
                _p.line = x;
            }
        });
        Object.defineProperty(self,'thickness',{
            get: function() {
                return _p.thickness;
            },
            set: function(x){
                _p.thickness = x;
            }
        });
        Object.defineProperty(self,'text',{
            get: function() {
                return _p.text;
            },
            set: function(x){
                _p.text = x;
            }
        });

        Model.call(this,data);

        // START constructor logic
        self.App.log(self.App.logLevel.DEBUG,"START Frame construction, data = " + JSON.stringify(data));

        // public methods
        self.draw = function(){
            self.App.ctx.save();
            // translate context to origin of frame
            self.App.ctx.translate(self.x,self.y);

            self.App.ctx.lineJoin = 'round';

            var $leftGrad = self.App.ctx.createLinearGradient(0,0,_p.thickness,0);
            var $topGrad = self.App.ctx.createLinearGradient(0,0,0,_p.thickness);
            var $rightGrad = self.App.ctx.createLinearGradient(0,0,-_p.thickness,0);
            var $bottomGrad = self.App.ctx.createLinearGradient(0,0,0,-_p.thickness);

            $leftGrad.addColorStop(0,_p.outerColor);
            $leftGrad.addColorStop(.9,_p.innerColor);
            $topGrad.addColorStop(0,_p.outerColor);
            $topGrad.addColorStop(.9,_p.innerColor);
            $rightGrad.addColorStop(0,_p.outerColor);
            $rightGrad.addColorStop(.9,_p.innerColor);
            $bottomGrad.addColorStop(0,_p.outerColor);
            $bottomGrad.addColorStop(.9,_p.innerColor);

            self.App.ctx.fillStyle = _p.backColor;
            self.App.ctx.fillRect(0,0,self.width,self.height);

            self.App.ctx.fillStyle=$leftGrad;
            self.App.ctx.lineWidth=_p.line;
            self.App.ctx.strokeStyle=_p.borderColor;
            // draw left side
            self.App.ctx.beginPath();
            self.App.ctx.moveTo(0,0);
            self.App.ctx.lineTo(0,self.height);
            self.App.ctx.lineTo(_p.thickness,self.height-_p.thickness);
            self.App.ctx.lineTo(_p.thickness,_p.thickness);
            self.App.ctx.closePath();
            self.App.ctx.fill();
            self.App.ctx.stroke();
            // draw top side
            self.App.ctx.fillStyle=$topGrad;
            self.App.ctx.beginPath();
            self.App.ctx.moveTo(0,0);
            self.App.ctx.lineTo(self.width,0);
            self.App.ctx.lineTo(self.width-_p.thickness,_p.thickness);
            self.App.ctx.lineTo(_p.thickness,_p.thickness);
            self.App.ctx.closePath();
            self.App.ctx.fill();
            self.App.ctx.stroke();
            // draw right side
            self.App.ctx.translate(self.width,0);
            self.App.ctx.fillStyle=$rightGrad;
            self.App.ctx.beginPath();
            self.App.ctx.moveTo(0,0);
            self.App.ctx.lineTo(0,self.height);
            self.App.ctx.lineTo(-_p.thickness,self.height-_p.thickness);
            self.App.ctx.lineTo(-_p.thickness,_p.thickness);
            self.App.ctx.closePath();
            self.App.ctx.fill();
            self.App.ctx.stroke();
            // draw bottom side
            self.App.ctx.translate(-self.width,self.height);
            self.App.ctx.fillStyle=$bottomGrad;
            self.App.ctx.beginPath();
            self.App.ctx.moveTo(0,0);
            self.App.ctx.lineTo(self.width,0);
            self.App.ctx.lineTo(self.width-_p.thickness,-_p.thickness);
            self.App.ctx.lineTo(_p.thickness,-_p.thickness);
            self.App.ctx.closePath();
            self.App.ctx.fill();
            self.App.ctx.stroke();
            // draw top edges of button as illuminated by light source
            /*self.App.ctx.strokeStyle='rgba(255,255,255,0.8)';
            self.App.ctx.beginPath();
            self.App.ctx.moveTo(self.width,0);
            self.App.ctx.lineTo(0,0);
            self.App.ctx.lineTo(0,self.height);
            self.App.ctx.stroke();*/

            self.App.ctx.restore();

        };

        return self;
    }

    // setup the inheritance chain
    Frame.prototype = Object.create(Model.prototype);
    Frame.prototype.constructor = Frame;

    return Frame;

});