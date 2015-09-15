<?php
/**
 * Created by JetBrains PhpStorm.
 * User: jderouen
 * Date: 1/17/14
 * Time: 1:31 AM
 * To change this template use File | Settings | File Templates.
 * Run from command line
 *  php -r "require 'junk.php'; echo json_encode(gonogo(Array(12=>0,2=>0,23=>0,5=>1,13=>1,64=>1)));"
 *  php -r "require 'junk.php'; echo protocol1(41,'Female',Array(1=>1,2=>160)) ? 'True' : 'False';"
 */

// go
function gonogo($x){
    $missed = Array(true);  // first element of return holds go/nogo, initialize to pass
    // Admin creates the answer key, array keyed to monitor ids pointing to correct answer
    $answer = Array(12=>1,2=>1,23=>1,5=>1,13=>1,64=>1);

    // Loop
    foreach($x as $key=>$value){
        if($value != $answer[$key]){
            $missed[] = $key;
        }
    }

    if((sizeof($missed)-1)/sizeof($x) > .2){
        $missed[0] = false;
    }

    return $missed;
}
// php -r "require 'junk.php'; echo json_encode(gonogo2(Array(7=>0)));"
function gonogo2($x){
    $missed = Array(true);

    foreach($x as $key=>$value){
        if($key%2){
            $missed[] = $key;
        }
    }

    if(sizeof($missed) > 1){
        $missed[0] = false;
    }

    return $missed;
}
function protocol1($age,$gender,$x){
    if($gender == 'Female' && $age >= 40 && $x[1] && $x[2] >= 140){
        return true;
    }else{
        return false;
    }
}
// php -r "require 'junk.php'; echo protocol2(50,'Female',Array(12=>123,14=>160,16=>98)) ? 'True' : 'False';"
function protocol2($age,$gender,$x){
    $sum = $age;

    $sum = $sum + min(array_keys($x));

    if($gender == 'Female'){
        return $sum % 2;
    }else{
        return ($sum + 1) % 2;
    }
}