/**
 * File: Story
 * User: jderouen
 * Date: 8/14/13
 * Time: 12:23 PM
 * To change this template use File | Settings | File Templates.
 */
define('app/game/Story',function(){

    function Story($data){
        console.log("Story.construct(): arguments = ",$data);
        // Class constructor
        var self = this;

        // Class constants
        // Parts of speech as tagged in the loaded story
        var ADV = '#ADV#';
        var NOUN = '#NOUN#';
        var ADJ = '#ADJ#';
        var VERB = '#VERB#';
        // Story templates
        var ACTIVE = 1;         // verb heavy
        var DESCRIPTIVE = 2;    // adjective heavy
        var THINGS = 4;         // noun heavy
        var EMOTIVE = 8;        // adverb heavy

        // error messaging
        var $msg = '';
        var $error = false;

        // Class properties
        var $p = {
            Words: [],
            Theme: DESCRIPTIVE + THINGS,
            Text: ''
            };

        // private variables
        var NounCnt = 10;
        var AdjCnt = 7;
        var VerbCnt = 5;
        var AdvCnt = 5;

        var $mapper = new Mapper();

        // set properties per argument passed during construction
        for(var $key in $data){
            if($p.hasOwnProperty($key)){
                // use the self reference to insure execution of setter function
                self[$key] = $data[$key];
            }
        }

        $mapper.LoadStory();

/*        // load Words based on newly acquired story
        var $match = $p.Text.match(/#(NOUN|VERB|ADV|ADJ)#/g);
        for(var $key in $match){
            var i = $p.Words.push(new Word());
            $p.Words[i-1].Part = $match[$key];
            $p.Words[i-1].SetRandomLetter();
            console.log($p.Words[i-1].StartsWith);
        }*/

        // Class Getters and Setters
        Object.defineProperty(self,"error",{
            get: function() {return $error}
        });

        Object.defineProperty(self,"Text",{
            get: function() {return $p.Text}
        });

        Object.defineProperty(self,"Words",{
            get: function() {return $p.Words}
        });

        Object.defineProperty(self,"ACTIVE",{
            get: function() {return ACTIVE}
        });

        Object.defineProperty(self,"DESCRIPTIVE",{
            get: function() {return DESCRIPTIVE}
        });

        Object.defineProperty(self,"THINGS",{
            get: function() {return THINGS}
        });

        Object.defineProperty(self,"EMOTIVE",{
            get: function() {return EMOTIVE}
        });

        Object.defineProperty(self,"Theme",{
            get: function() {
                return $p.Theme;
            },
            set: function(x) {
                if (x >0 && x < 15){
                    $p.Theme = x;
                    $mapper.LoadStory();

                    return true;
                }else{
                    $msg = 'Not a valid theme.  You must pick from the class constants ACTIVE, ' +
                        'DESCRIPTIVE, EMOTIVE, and THINGS or any combination thereof.';
                    $error = true;
                    return false;
                }
            }
        });


        // Subclasses
        function Mapper(){
            console.log('START Story.Mapper Constructor');

            // private function to retrieve story based on theme settings
            function LoadStory(){
                console.log('START Story.Mapper.LoadStory');
                var $newStory = 'nothing';
                var $success = false;

                switch ($p.Theme){
                    case ACTIVE:
                        $newStory = 'This ACTIVE story requires lots of verbs like #VERB#, #VERB#, and #VERB#.';
                        break;
                    case DESCRIPTIVE + THINGS:
                        $newStory = 'This old #NOUN# came #VERB# #NOUN#.';
                        break;
                    case EMOTIVE:
                        $newStory = 'This EMOTIVE story requires lots of adverbs like #ADV#, #ADV#, and #ADV#.';
                        break;
                    default:
                        $newStory = 'This default story is balanced with nouns, verbs, adjectives, and adverbs.';
                }

                $p.Text = $newStory;

                // load Words based on newly acquired story
                // determine word part matches in the story template
                var $match = $p.Text.match(/#(NOUN|VERB|ADV|ADJ)#/g);
                // reset words array
                $p.Words.length = 0;

                for(var $key in $match){
                    var i = $p.Words.push(new Word());
                    $p.Words[i-1].Part = $match[$key];
                    $p.Words[i-1].SetRandomLetter();
                }

                if ($p.Words.length > 0){
                    $success = true;
                }else{
                    $success = false;
                    $msg = 'No words found in loaded story = /n/n' & $p.Text;
                    $error = true;
                }

                console.log('END Story.Mapper.LoadStory');

                return $success;
            }

            console.log('END Story.Mapper Constructor');

            return {
                LoadStory: LoadStory
            };
        }

        function Word(){
            //console.log('START Story.Word constructor');
            // attempts to use 'self' reference leads to undefined object
            //self = this;

            this.Value = '';
            this.Part = NOUN;
            this.StartsWith = '';
            this.Length = 0;

            // error handling
            this.err = 0;
                // 1 = fails StartsWith criteria
                // 2 = word contains non-alpha characters
            this.msg = '';

            Object.defineProperty(this,"Value",{
                get: function() {
                    return this.Value;
                },
                set: function(x) {
                    var $patt = /[A-z]/i;

                    for(var i=0; i< x.length; i++){
                        if(this.StartsWith != '' && x.charAt(i) != this.StartsWith){
                            this.err = 1;
                            this.msg = 'Sorry, your word does not start with "' + this.StartsWith + '!  Please enter a different word.';
                        }else if(!$patt.test(x.charAt(i))){
                            this.err = 2;
                            this.msg = 'Letter in square is not an alphabetic character.'
                        }
                    }

                }
            });

            this.SetRandomLetter = function(){
                //console.log('START GetRandomLetter');
                var $success = false;
                var $letter;
                // create map for relative frequency of the first letters of a word, ref http://en.wikipedia.org/wiki/Letter_frequency
                var $map = {
                    A: 11.602,       // frequency of A = 11.602%
                    B: 4.702,
                    C: 3.511,
                    D: 2.67,
                    E: 2.007,
                    F: 3.779,
                    G: 1.95,
                    H: 7.232,
                    I: 6.286,
                    J: 0.597,
                    K: 0.59,
                    L: 2.705,
                    M: 4.374,
                    N: 2.365,
                    O: 6.264,
                    P: 2.545,
                    Q: 0.173,
                    R: 1.653,
                    S: 7.755,
                    T: 16.671,
                    U: 1.487,
                    V: 0.649,
                    W: 6.753,
                    X: 0.037,
                    Y: 1.62,
                    Z: 0.034
                };

                var $random = Math.random()*100;

                var $accum = 0;
                for (var $x in $map){
                    $accum = $accum + $map[$x];
                    if($random<$accum){
                        this.StartsWith = $x;
                        $success = true;
                        break;
                    }
                }
                return $success;
            }
        };

    }



    return Story;

});