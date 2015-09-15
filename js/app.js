/**
 * File: app
 * User: jderouen
 * Date: 6/22/13
 * Time: 10:33 AM
 * To change this template use File | Settings | File Templates.
 */

// Shim layer with setTimeout fallback.  This allows interjection of new
// canvas drawings during browser screen refreshes (about 60 times per second)
window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * @exports app
 */
define(
    'app',
    [
        'jquery',
        'app/Model',
        'app/state/Ready',
        'app/state/Run',
        'app/state/Error',
        'app/Game',
        'app/State',
        'app/Event',
        'app/Timer'
    ],
    function(
        $,
        Model,
        Ready,
        Run,
        Error,
        Game,
        State,
        AppEvent,
        Timer
        )
    {
        /**
         * The running application object.  Globally available to most all objects in order to track and update
         * the current application state as well as respond to application events.
         *
         * @class App
         * @constructor
         * @property {app/Event} Event
         * @property {app/State} Ready      The root application ready state
         * @property {app/State} Run        The running application state
         * @property {app/State} Error      The application error state
         * @property {app/State} State      The current application state (either Ready, Run, or Error)
         * @property {app/Timer} timer      The application timer used to coordinate responsed to events
         * @property {app/Game} Game        The current game with focus
         * @property {HTMLElement} canvas   Access to the application canvas
         * @property {HTMLElement} ctx      Access to the canvas context
         * @property {HTMLElement} tmpCan   Access to an invisible temporary canvas for drawing before transfer to canvas
         * @property {HTMLElement} tmpCtx   The context for manipulating tmpCan
         * @property {integer} logLevel     Specifies the application logging level
         *
         *
         */
        function App(){
            console.log("START App.construct()");
            var self = this;    // required as a pointer to the methods and properties for this app class

            // Create the application $timer.
            var _timer;
            // log levels are "ERROR", "INFO", and "DEBUG", from least verbose to most verbose
            var _logLevel = {
                ERROR: 0,
                WARN: 1,
                INFO: 2,
                DEBUG: 3,
                Now: 3
            };

            // Declare application state machine variables
            var _State;             // app global pointer to currently active state
            var _Event;            // create event object

            // Define game reference for manipulation by various Game states
            var _Game;

            // protected application state variables
            var _Ready;// = new Ready(self);
            var _Run;// = new Run(self);
            var _Error; // = new Error;

            var _canvas;
            var _ctx;
            var _tmpCan;
            var _tmpCtx;

            // define setters and getters
            // Only need Getters for the different App states, they are singletons declared for application use.
            Object.defineProperty(self,"Ready",{
                get: function() {
                    if (!(_Ready instanceof State)){
                        _Ready = new Ready();
                    }

                    return _Ready;
                }
            });
            Object.defineProperty(self,"Run",{
                get: function() {
                    if (!(_Run instanceof State)){
                        _Run = new Run();
                    }
                    return _Run;
                }
            });
            Object.defineProperty(self,"Error",{
                get: function() {
                    if (!(_Error instanceof State)){
                        _Error = new Error();
                    }
                    return _Error;
                }
            });
            Object.defineProperty(self,"Event",{
                get: function() {
                    return _Event;
                },
                set: function(x){
                    _Event = x;
                }
            });
            Object.defineProperty(self,"timer",{
                get: function() {
                    return _timer;
                }
            });
            Object.defineProperty(self,"State",{
                get: function() {
                    return _State;
                },
                // The App.State variable is set to one of the different application states
                set: function(x){
                    if(x instanceof State){
                        _State = x.activate();  // set application state reference
                    }else{
                        _State = self.Error;
                        _State.msg = 'Attempted to set App.State to non-state object';
                        self.log(self.logLevel.ERROR,'Attempted to set App.State to non-state object');
                    }
                }
            });
            Object.defineProperty(self,"Game",{
                get: function() {
                    return _Game;
                },
                set: function(x){
                    if(x instanceof Game){
                        // maybe could implement a activate() or select() method in Game superclass to provide some
                        // management of all the different Game instances.  For example, cleanup (delete) of the
                        // previously active game may be nice to release the memory.
                        _Game = x;
                    }else{
                        _State = self.Error;
                        _State.msg = 'Attempted to set App.Game to non-game object';
                        self.log(self.logLevel.ERROR,'Attempted to set App.Game to non-game object');
                    }
                }
            });
            Object.defineProperty(self,"canvas",{
                get: function() {
                    return _canvas;
                }
            });
            Object.defineProperty(self,"ctx",{
                get: function() {
                    return _ctx;
                }
            });
            Object.defineProperty(self,"tmpCan",{
                get: function() {
                    return _tmpCan;
                }
            });
            Object.defineProperty(self,"tmpCtx",{
                get: function() {
                    return _tmpCtx;
                }
            });
            Object.defineProperty(self,"logLevel",{
                get: function() {
                    return _logLevel;
                },
                set: function(x){
                    if(x >= 0 && x <= 2){
                        _logLevel.Now = x;
                    }
                }
            });


            // set watch for keyboard events
            $(window).keydown(function (event) {
                event.preventDefault();
                event.stopPropagation();
                // set the new event
                _Event.ParseKeyboard(event.keyCode);
            });

            // set watch for mouse events on canvas
            // todo:  I cannot make this work directly with a named function, I must use anonymous, why?
            $("#canvas").click(function (e){
                _Event.ClickedCanvas(e,_canvas);
            });

            /**
             * Initialization of the application.  Loads the application model into global memory for access by other
             * models.  Starts the application timer and sets application to Ready state.
             *
             * @method Initialize
             * @memberOf App
             *
             * @returns {boolean}
             */
            self.initialize = function(){
                var bSuccess = true;
                // load Application object in global memory for use by all subclasses of Model
                var init = new Model({App:self});

                $(document).ready(function () {
                    _canvas = document.getElementById('canvas');
                    _tmpCan = document.createElement('canvas');
                    _tmpCan.setAttribute('width',_canvas.width);
                    _tmpCan.setAttribute('height',_canvas.height);

                    if (_canvas.getContext){
                        // Define timer and set tripping point every 100ms
                        _timer = new Timer({trip: 100});
                        // construct event object for tracking events
                        _Event = new AppEvent();

                        // initialize state machine
                        self.Event.Last = self.Event.INITIALIZE;
                        self.State = self.Ready;

                        _ctx = _canvas.getContext('2d');
                        _tmpCtx = _tmpCan.getContext('2d');
                        tick();    // start the app ticker
                    }
                });

                return bSuccess;
            };
            /**
             * Writes application log events based on current log level.
             *
             * @param {integer} level   The log level associated with the entry. Logs entry based on App.LogLevel
             * @param {string} entry    The log entry
             */
            self.log = function(level,entry){
                if(level <= _logLevel.Now){
                    console.log(entry);
                }

            };

            // private function for controlling drawing to web page
            function tick() {
                // maintain the ticker by requesting animation frames;
                requestAnimFrame(tick.bind(self));

                // center canvas object based on current screen size
                //_canvas.style.left = String((window.innerWidth - _canvas.width)/2) + "px";

                // only process the state, according to timer frame rate
                // this allows all logic to process knowing that the timer tripped, no need to check
                if(_timer.isTripped){
                    // determine what to do in current state
                    // TODO:  pivot off of state.draw as opposed to state.process, make state.process private
                    self.State.process();
                    _timer.isTripped = false;
                }

                return true;
            };

            console.log('END App.construct()');

        }

        return App;
    });