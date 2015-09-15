/**
 * File: Tokens
 * User: jderouen
 * Date: 11/11/13
 * Time: 8:19 PM
 * To change this template use File | Settings | File Templates.
 */

define('app/game/Tokens',['app/Model','app/etc/Frame'],function(Model,Frame){

    // expects a image file containing a linear list of tokens images
    function Tokens(data){
        // Class constructor
        var self = this;

        // define class properties settable during construction */
        var _p = {
            imgFile: '',
            index: 0,                   // currently active token in viewer
            count: 0                   // number of tokens in the file
        };


        /*var _drawer = new Frame(
            {
                outerColor: 'Blue',
                innerColor: 'Yellow',
                backColor: 'Yellow',
                borderColor: 'Black',
                thickness: 10,
                height: 50,
                width: 50
            }
        );*/

        Object.defineProperty(self,'imgFile',{
            get: function() {
                return _p.imgFile;
            },
            set: function(x){
                _p.imgFile = x;
            }
        });
        Object.defineProperty(self,'count',{
            get: function() {
                return _p.count;
            },
            set: function(x){
                _p.count = x;
            }
        });
        // call superclass and data array
        Model.call(self,data);
        // start constructor logic
        self.App.log(self.App.logLevel.INFO,'Tokens constructor, data = ' + JSON.stringify(data));


        var _img = new Image();
        _img.src = _p.imgFile;

        var _Tokens = new Array();

        // build array of tokens
        for(var i=0;i<_p.count;i++){
            var token = new Token(i);
            _Tokens.push(token);
        };

        self.getToken = function(x){
            _Tokens[x].selected = true;
            return _Tokens[x];
        }

        // sub-classes
        function Token(i){

            this.index = i;                 // identify x position in the strip of tokens
            this.selected = false;
            this.width = self.width;
            this.height = self.height;

            this.draw = function(){
                    self.App.ctx.drawImage(_img, self.width*this.index, 0, self.width, self.height,0,0, self.width, self.height);
                };

        }

    }

    // setup the inheritance chain
    Tokens.prototype = Object.create(Model.prototype);
    Tokens.prototype.constructor = Tokens;

    return Tokens;

});