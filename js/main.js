// bootstrap file, responsible for configuring Requirejs and
// loading initially important dependencies

requirejs.config({
    //root path to use for all module lookups, js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        // path mappings for module names not found directly under baseUrl
        app: '../app',
        app3: '../app3',
        jquery: 'jquery-1.9.1.min'
            // I believe this allows loading of jquery from server if not already loaded from Google
            // in index.html
    }   //,waitSeconds: 200
});

/*
    Initialize application
    Load app module and pass it to the definition function
    In RequireJS, all code is wrapped in require() or define() functions.
    The first parameter of these functions specifies dependencies.
    The second parameter is an anonymous callback function which takes an object that
    is used to call the functions inside the dependent file.
    The require() function is used to run immediate functionalities,
    while define() is used to define modules for instantiation as new objects as desired.
    Here, I want to run the App.init() function immediately.
    For console debugging, use require("module/name").callSomeFunction()
    Use requirejs.undef() to unload a module.

    For this application it does not matter if I use 'define' or 'requirejs'.  The App object
    is contained within a function wrapper, I still must instantiated to use the object.
 */
define(['app'], function(App){
        // the app dependency is passed in as App
        // Window.App = App;
        console.log('App Start');
        var $App = new App;
        $App.initialize();
        //var myApp = new app();
});
