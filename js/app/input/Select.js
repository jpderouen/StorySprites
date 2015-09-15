/**
 * File: Select
 * User: jderouen
 * Date: 1/19/14
 * Time: 8:39 PM
 * To change this template use File | Settings | File Templates.
 */
define('app/input/Select',['app/Model'],function(Model){

    function Select(data){
        // Class constructor
        var self = this;

        // define class properties */
        var _p = {
            backColor: 'LightBlue',
            borderColor:'Black',
            textColor:'Black',
            line:   3,                  // line pixel thickness
            selected: {key:0,value:0,text:'<Select from Below>'},
            selection: Array(),
            mode: 'SINGLE',             // single selection or multiple selection (MULTI)
            event: ''                   // maps select action to an event
        };
        // other protected properties
        var _isActive = false;
        var _showSelection = false;
        var _isOpening = false;         // identifies that select box choice list is opening
        var _isOpen = false;            // identifies select box choice list is open

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
        Object.defineProperty(self,'line',{
            get: function() {
                return _p.line;
            },
            set: function(x){
                _p.line = x;
            }
        });
        Object.defineProperty(self,'event',{
            get: function() {
                return _p.event;
            },
            set: function(x){
                _p.event = x;
            }
        });
        Object.defineProperty(self,'selected',{
            get: function() {
                return _p.selected;
            }
        });
        Object.defineProperty(self,'selection',{
            get: function() {
                return _isActive;
            },
            set: function(x){
                console.log('set selection');
                // TODO: validate that element has properties 'key' and 'text'
                for (var i=0; i< x.length;i++){
                    console.log('set element = ',x[i]);
                    _p.selection.push(new element(i,x[i]));
                }
            }
        });

        // call superclass and data array
        Model.call(self,data);


        self.App.log(self.App.logLevel.DEBUG,"Select.construct(): arguments = " + JSON.stringify(data));

        // public methods
        self.draw = function(){
            process();
            self.App.ctx.save();

            // translate context to origin of button and draw the inactive select box
            self.App.ctx.translate(self.x,self.y);
            self.App.ctx.lineJoin = 'round';
            self.App.ctx.fillStyle=_p.backColor;
            self.App.ctx.lineWidth=_p.line;
            self.App.ctx.strokeStyle=_p.borderColor;
            self.App.ctx.fillRect(0,0,self.width,self.height);

            // sink the select box when active
            if(_isActive){
                // draw top edges of button as shaded by light source
                self.App.ctx.translate(Math.round(_p.line/2),Math.round(_p.line/2));
                self.App.ctx.strokeStyle='rgba(0,0,0,0.8)';
                self.App.ctx.beginPath();
                self.App.ctx.strokeRect(0,0,self.width-Math.round(_p.line/2),self.height-Math.round(_p.line/2));

                // emboss bottom edges of select box as though illuminated by light source
                self.App.ctx.translate(Math.round(-_p.line),Math.round(-_p.line));
                self.App.ctx.strokeStyle='rgba(255,255,255,0.6)';
                self.App.ctx.beginPath();
                self.App.ctx.moveTo(self.width,_p.line);
                self.App.ctx.lineTo(self.width,self.height);
                self.App.ctx.lineTo(_p.line,self.height);
                self.App.ctx.stroke();
            }

            // determine text size based on size of button
            switch(true){
                case self.width<10:
                    self.App.ctx.font="bold 6px Cooper Black";
                    break;
                case self.width<20:
                    self.App.ctx.font="bold 8px Cooper Black";
                    break;
                case self.width<40:
                    self.App.ctx.font="bold 12px Cooper Black";
                    break;
                default:
                    self.App.ctx.font="bold 14px Cooper Black";
                    break;
            }
            // set positioning and color
            self.App.ctx.textBaseline = 'middle';
            self.App.ctx.textAlign = 'center';
            self.App.ctx.fillStyle='Black';
            // draw coordinates
            self.App.ctx.fillText(_p.selected.text,self.width/2,self.height/2);

            self.App.ctx.restore();

            // draw the selection elements as appropriate
            if(_showSelection){
                //self.App.ctx.translate(_p.line,self.height);
                for (var i in _p.selection){
                    _p.selection[i].draw(self.App.ctx);
                    //self.App.ctx.translate(0, _p.selection[i].height);
                }
            }

        };

        // private methods
        function process(){
            var ClickEvent = self.App.Event.Last == self.App.Event.CLICK;

            // only process click event
            if(ClickEvent){
                var ClickedSelectBox = self.isClicked;

                // determine if user clicked a selection
                if(!ClickedSelectBox && _isActive){
                    for (var i in _p.selection){
                        if(_p.selection[i].isClicked){
                            _p.selected = _p.selection[i];
                            self.App.Event.Value = _p.selected.value;
                            // set event to that assigned during construction
                            self.App.Event.Last = self.event;
                        }
                    }
                }

                switch(true){
                    case !_isActive && ClickedSelectBox:
                        _isActive = true;
                        _showSelection = true;
                        // set event value to the value of the selection
                        self.App.Event.Value = _p.selected.value;
                        // set event to that assigned during construction
                        self.App.Event.Last = self.event;
                        break;
                    case _isActive && ClickedSelectBox && _showSelection:
                        _isActive = true;
                        _showSelection = false;
                        // must disposition event or other objects will process it even through user clicked select box
                        self.App.Event.Last = self.App.Event.WAIT;
                        break;
                    case _isActive && ClickedSelectBox && !_showSelection:
                        _isActive = true;
                        _showSelection = true;
                        self.App.Event.Last = self.App.Event.WAIT;
                        break;
                    case _isActive && !ClickedSelectBox:
                        _isActive = false;
                        _showSelection = false;
                        break;
                    default:
                    // nothing
                }


            }
        }

        function element(i,item){
            this.width = Math.round(self.width*0.9);
            this.height = Math.round(self.height*0.8);
            // determine x,y position based on element position as referenced to select box
            this.x = self.x + (self.width-this.width)/2;
            this.y = self.y + self.height + i*this.height;
            this.key = item.key;
            this.value = item.value;
            this.text = item.text;
            this.isActive = false;
            var backColor = 'White';
            var line = Math.round(_p.line/2);
            var lineColor = _p.backColor;

            Object.defineProperty(this,"isClicked",{
                get: function() {
                    this.isActive =
                        self.App.Event.Clicked.x > this.x
                            &&
                            self.App.Event.Clicked.x < this.x + this.width
                            &&
                            self.App.Event.Clicked.y > this.y
                            &&
                            self.App.Event.Clicked.y < this.y + this.height;
                    return  this.isActive;
                }
            });

            this.draw = function(ctx){
                ctx.save();
                ctx.translate(this.x,this.y);
                // translate context to origin of button
                ctx.fillStyle=backColor;
                ctx.lineWidth=line;
                ctx.fillRect(0,0,this.width,this.height);
                ctx.strokeStyle=lineColor;
                ctx.strokeRect(0,0,this.width,this.height);

                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillStyle='Black';
                ctx.fillText(this.text,this.width/2,this.height/2);

                ctx.restore();

                return true;
            }
        }
    }

    // setup the inheritance chain
    Select.prototype = Object.create(Model.prototype);
    Select.prototype.constructor = Select;

    return Select;

});