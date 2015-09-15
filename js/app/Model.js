/**
 * File: Model
 * User: jderouen
 * Date: 12/29/13
 * Time: 1:16 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * @exports app/Model
 */
define('app/Model', function(){

    var _App = null;        // global pointer to the App object for use by all subclasses
    var _idModelCount = 0;  // the number of models currently in use

    /* array in global model space to make x and y properties part of prototype and allocate unique storage per model */
    var _x = new Array();
    var _y = new Array();

    /**
     * private function for returning next available id to use as a unique identifier
     *
     * @private
     * @returns {number}        - the next available id that the model will use for unique identification
     */
    function nextId(){
        return ++_idModelCount;
    }

    /**
     * @param {array} data      - array of class properties for setting during instantiation
     * @class                   - Base class for most any object that displays to application screen
     * @property {app/} App          - Returns global App object access to canvas and timer
     * @property {int} id       - returns unique identifier for the model
     * @property {int} ModelCount   - the total number of models
     * @property {array} properties - array of property names
     * @property {int} width        - width of the object
     * @property {int} height       - height of object
     * @property {boolean} isClicked   - identifies if object clicked
     */
    function Model(data){

        // I think this allows resolution of self at local scope if defined there, otherwise it resolve here at the
        // top level.
        var self = this;
        var _id = nextId();     // unique id for this Model

        var
            _width,             // the width occupied by the model
            _height             // the height occupied by the model

        // provides access to the App object
        Object.defineProperty(self,'App',{
            /** The global application object
             *
             * @type Object
             * @instance
             * @returns {app}   - the global application object
             */
            get: function() {
                if(_App != null){
                    return _App;
                }else{
                    return false;
                }
            },
            /**
             *
             * @param {app} x   - the application object
             */
            set: function(x){
                // there should be only one instance of the application object, if it is set, leave it
                if(_App == null){
                    _App = x;
                    _App.log(_App.logLevel.DEBUG,'App object set for global access');
                }else{
                    _App.log(_App.logLevel.WARN,"Attempted to create multiple references to App object in" +
                        self.constructor.name);
                }

            }
        });
        Object.defineProperty(self,"id",{
            get: function() {
                return _id;
            }
        });
        Object.defineProperty(self,"ModelCount",{
            get: function() {
                return _idModelCount;
            }
        });
        Object.defineProperty(self,"properties",{
            get: function(){
                return Object.getOwnPropertyNames(self);
            },
            set: function(x){
                // set properties per argument passed during construction
                for(var $key in x){
                    // set the property if it exists in the property array
                    if(self.hasOwnProperty($key) || Model.prototype.hasOwnProperty($key)){
                        // use self reference in order to execute setter method, call using bracket notation within object scope
                        self[$key] = x[$key];
                    }else{
                        // add the property then set it
                        _App.log(_App.logLevel.DEBUG,'Property ' + $key + ' does not exist in ' + self.constructor.name);
                    }
                }
            }
        });
        Object.defineProperty(self,'width',{
            get: function() {
                return _width;
            },
            set: function(x){
                _width = x;
            }
        });
        Object.defineProperty(self,'height',{
            get: function() {
                return _height;
            },
            set: function(x){
                _height = x;
            }
        });
        Object.defineProperty(self,"isClicked",{
            get: function() {
                var isClicked =
                    _App.Event.Clicked.x > self.x
                        &&
                        _App.Event.Clicked.x < self.x + _width
                        &&
                        _App.Event.Clicked.y > self.y
                        &&
                        _App.Event.Clicked.y < self.y + _height;
                return  isClicked;
            }
        });

        // set all of the class properties according to the data array passed to the constructor.
        self.properties = data;

    }

    Object.defineProperty(Model.prototype,"x",{
        get: function() {
            return _x[this.id];
        },
        set: function(x){
            _x[this.id] = x;
        }
    });
    Object.defineProperty(Model.prototype,"y",{
        get: function() {
            return _y[this.id];
        },
        set: function(y){
            _y[this.id] = y;
        }
    });

    return Model;

});
