/**
 * File: Anime
 * User: jderouen
 * Date: 7/24/13
 * Time: 12:53 PM
 * To change this template use File | Settings | File Templates.
 */
define('app/etc/Anime',['app/Model'], function(Model){
    // Class initialization
    var root = "img/sprite/";            // root to application image folder
    /**
     *
     * @param {array} data      - array of properties defining the Anime object on construction
     * @constructor
     * @property {string} name  - name of the object
     * @property {int} fps      - frames per second
     * @property {int} rows     - number of rows in the sprite sheet
     * @property {int} cols     - number of columns in the sprite sheet
     */
    function Anime(data){
        // Class constructor
        // private variables
        var self = this;

        // define class properties
        var p = {
            name:   'Isaac',    // name of sprite screen (assumes .png)
            fps:    10         // msecs per frame, TBD: remove
        };

        // private variables
        // declare screen indices trackers
        var i = -1;         // col index
        var j = 0;          // row index

        var screen = {
            img: new Image(),   // sprite screen image object
            sx: 0,              // start crop x-coor
            sy: 0,               // start crop y-coor
            swidth: 0,          // crop window width, calculated value dependent on p.width / p.cols)
            sheight: 0          // crop window height, calculated valued dependent on p.height / p.rows)
        };

        Object.defineProperty(self,"name",{
            get: function() {
                return p.name;
            },
            set: function(x) {
                p.name = x;
            }
        });
        Object.defineProperty(self,"fps",{
            get: function() {
                return p.fps;
            },
            set: function(x) {
                p.fps = x;
            }
        });
        Object.defineProperty(self,"rows",{
            get: function() {
                return p.rows;
            },
            set: function(x) {
                p.rows = x;
                screen.sheight = Math.round(p.height/ p.rows);
            }
        });
        Object.defineProperty(self,"cols",{
            get: function() {
                return p.cols;
            },
            set: function(x) {
                p.cols = x;
                screen.swidth = Math.round(p.width/ p.cols);
            }
        });

        // call superclass and data array
        Model.call(this,data);

        // start constructor logic
        self.App.log(self.App.logLevel.INFO,'Anime constructor, data = ' + JSON.stringify(data) + '; screen = ' + JSON.stringify(screen));

        // there must by a sprite screen file in the root of the app image directory with the instantiated name
        screen.img.src = root + p.name + '.png';

        // private method
        var next = function(){
            screen.sheight = Math.round(self.height/ p.rows);
            screen.swidth = Math.round(self.width/ p.cols);
            // determine row and column index
            if(i==-1){
                i = 0;
                j = 0;
            }else{
                i = i + 1;
                if (i>p.cols-1){
                    i=0;
                    j=j+1;
                    if(j>p.rows-1){
                        i=0;
                        j=0;
                    }
                }
            }
            // increment to next screen
            screen.sx = i* screen.swidth;
            screen.sy = j* screen.sheight;

            //timer.reset();

            return screen;
        };

        self.draw = function(x,y){
            self.App.ctx.drawImage(screen.img,screen.sx,screen.sy,screen.swidth,screen.sheight,x,y,screen.swidth,screen.sheight);
            next();
        }

    }

    // setup the inheritance chain
    Anime.prototype = Object.create(Model.prototype);
    Anime.prototype.constructor = Anime;

    return Anime;

});