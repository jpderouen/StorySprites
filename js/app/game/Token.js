/**
 * File: Tokens
 * User: jderouen
 * Date: 11/11/13
 * Time: 8:19 PM
 * To change this template use File | Settings | File Templates.
 */

define('app/game/Token',['app/Model'],function(Model){
    // define private variable for this class, shared by all instances
    var _source = {
        imgFile: "img/game/storySprites/Tokens.png",         // sprite sheet of all available tokens for selection
        width: 50,                              // width for one token in the sprite sheet
        height: 50,                             // height of one token in the sprite sheet
        count: 6                                // number of tokens in sprite sheet
    };
    var _selected = new Array(_source.count);   // identifies which tokens are selected from the available choices
    // initialize selected array
    for(var i=0;i<_selected.length;i++){
        _selected[i] = false;
    }

    var _tokens = new Image();
    _tokens.src = _source.imgFile;                 // default source of all tokens

    function Token(data){
        var self = this;

        var _p = {
            selected: false
        };

        // private variables
        var _index = 0;            // identifies index location in the source file

        Object.defineProperty(self,'source',{
            get: function() {
                return _source;
            }
        });

        // todo: fix selected flag to release token for use by someone else

        // START constructor logic
        Model.call(self,data);

        // start constructor logic
        self.App.log(self.App.logLevel.INFO,'Token constructor, data = ' + JSON.stringify(data));

        self.width = _source.width;
        self.height = _source.height;

        // set token index to the first available and update selected array
        var i = 0;
        while(_selected[i]){
            i++;
            if(i == _selected.length){
                self.App.log(self.App.logLevel.WARN,'No more tokens available for selection');
                break;
            }
        }
        _index = i;
        _selected[i] = true;

        self.draw = function(){
            //console.log('START Tokens.draw');
            var $i = 0;

            self.App.ctx.save();
            self.App.ctx.translate(self.x,self.y);
            // set display window to player's selected token
            self.App.ctx.drawImage(_tokens,_index*_source.width,0,_source.width,_source.height,0,0,_source.width,_source.height);

            self.App.ctx.restore();
        }

        self.next = function(){
            // release the current selection
            _selected[_index] = false;

            // make a new selection from next available
            var i = 0;
            while(_selected[i]){
                i++;
                if(i == _selected.length){
                    self.App.log(self.App.logLevel.WARN,'No more tokens available for selection');
                    break;
                }
            }
            _index = i;
            _selected[i] = true;
        }
    }

    // setup the inheritance chain
    Token.prototype = Object.create(Model.prototype);
    Token.prototype.constructor = Token;

    return Token;

});