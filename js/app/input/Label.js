/**
 * File: Label
 * User: jderouen
 * Date: 3/1/14
 * Time: 1:30 PM
 * To change this template use File | Settings | File Templates.
 */
define('app/input/Label',['app/Model'],function(Model){

    function Label(data){
        // Class constructor
        var self = this;

        // define class properties */
        var _p = {
            backColor: 'None',
            borderColor:'None',
            textColor:'Black',
            font:'bold 10px Cooper Black',      // size and style as specified for context object, e.g. bold 6px Cooper Black
            align:'left',
            line:   0,                          // line pixel thickness
            text:   ''
        };
        // other protected properties

        // Class setters and getters, setters and getters must be declared first so constructor can utilize them
        Object.defineProperty(self,"backColor",{
            get: function() {
                return _p.backColor;
            },
            set: function(x) {
                // check to see if setting to color name
                var xType = typeof x;

                if(xType == 'string'){
                    _p.backColor = x;
                }else{
                    // check for valid hex color code
                    if(/^#[0-9A-F]{6}$/i.test(x)){
                        _p.backColor = x;
                    }else{
                        self.App.log(self.App.logLevel.WARN,'Attempted to set select input backColor to unrecognized value = ' + x);
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
                        self.App.log(self.App.logLevel.WARN,'Attempted to set select input borderColor to unrecognized value = ' + x);
                    }
                }
            }
        });
        Object.defineProperty(self,'textColor',{
            get: function() {
                return _p.textColor;
            },
            set: function(x){
                // check to see if setting to color name
                var xType = typeof x;

                if(xType == 'string'){
                    _p.textColor = x;
                }else{
                    // check for valid hex color code
                    if(/^#[0-9A-F]{6}$/i.test(x)){
                        _p.textColor = x;
                    }else{
                        self.App.log(self.App.logLevel.WARN,'Attempted to set select input textColor to unrecognized value = ' + x);
                    }
                }
            }
        });
        Object.defineProperty(self,'font',{
            get: function() {
                return _p.font;
            },
            set: function(x){
                _p.font = x;
            }
        });
        Object.defineProperty(self,'align',{
            get: function() {
                return _p.align;
            },
            set: function(x){
                _p.align = x;
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
        Object.defineProperty(self,'text',{
            get: function() {
                return _p.text;
            },
            set: function(x){
                _p.text = x;
            }
        });
        // call superclass and data array
        Model.call(self,data);


        self.App.log(self.App.logLevel.DEBUG,"Input.Label.construct(): arguments = " + JSON.stringify(data));

        // public methods
        self.draw = function(){
            var words = self.text.split(" ");   // array of words that compose the text to write
            var txt = "";    // temporary text for determine text wrapping

            self.App.ctx.save();

            // translate context to origin of label
            self.App.ctx.translate(self.x,self.y);
            self.App.ctx.lineJoin = 'round';

            // draw background if specified, adjust for the line border so that the line edging effects come forward
            if(_p.backColor != 'None'){
                self.App.ctx.fillStyle=_p.backColor;
                self.App.ctx.fillRect(self.line,self.line,self.width-2*self.line,self.height-2*self.line);
            }
            // draw border if specified
            if(_p.line != 0){
                self.App.ctx.lineWidth=_p.line;
                self.App.ctx.strokeStyle=_p.borderColor;
                self.App.ctx.rect(self.line/2,self.line/2,self.width-self.line,self.height-self.line);
                self.App.ctx.stroke();
            }

            // set text
            self.App.ctx.font=_p.font;
            self.App.ctx.textBaseline = 'middle';
            self.App.ctx.textAlign = _p.align;
            self.App.ctx.fillStyle=_p.textColor;

            for (var i=0;i<words.length;i++) {
                var testTxt = txt + words[i] + " ";
                // if next additional word is too long, write the line and start a new one
                if(self.App.ctx.measureText(testTxt).width > self.width){
                    self.App.ctx.fillText(txt,self.width/2,self.height/2);
                    txt = words[i] + " ";
                    self.App.ctx.translate(0,20);   // TODO: offset by pixel size
                }else{
                    txt = testTxt;
                };
            }

            // draw the remaining line of text
            self.App.ctx.fillText(txt,self.width/2,self.height/2);

            self.App.ctx.restore();

        };

        // private methods

    }

    // setup the inheritance chain
    Label.prototype = Object.create(Model.prototype);
    Label.prototype.constructor = Label;

    return Label;

});