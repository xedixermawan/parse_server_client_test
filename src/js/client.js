import { applyMiddleware, createStore } from "redux";
import axios from "axios";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

// my local server

const SERVER_URL = 'http://localhost:1337/parse';
const APP_ID     = 'myApphaha123';
const MASTER_KEY = 'myKeyhaha123';

/*
const SERVER_URL = 'https://goalie2-api.staging.sense-os.nl/parse';
const APP_ID     = 'goalie_staging';
const MASTER_KEY = 'V5O6P66P9uwv1W6IxHUkNL9u7hJo49';
*/
var Parse = require('parse');
Parse.initialize(APP_ID);
Parse.serverURL = SERVER_URL;
var startRequest;
var endRequest;
/**
 * XHR object
 */

var XHR = {}


XHR.setCallback = function(callback) {
  this.xhttp = new XMLHttpRequest();
  var _self = this;
  this.xhttp.onreadystatechange = function() {
    if (_self.xhttp.readyState == 4 && _self.xhttp.status >= 200 && _self.xhttp.status <= 299) {
      callback(_self.xhttp.responseText);
    }
  };
}

XHR.PUT = function(path, jsonData, callback) {
    this.xhttp.open("PUT", path, true);
    this.xhttp.setRequestHeader("X-Parse-Application-Id", APP_ID );
    this.xhttp.setRequestHeader("X-Parse-Master-Key", MASTER_KEY );
    this.xhttp.setRequestHeader("Content-type", "application/json");
    this.xhttp.send(JSON.stringify(jsonData));
  }

XHR.POST = function(path, jsonData, callback) {
  this.xhttp.open("POST", path, true);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", APP_ID );
  this.xhttp.setRequestHeader("X-Parse-Master-Key", MASTER_KEY);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send(JSON.stringify(jsonData));
}

XHR.GET = function(path,callback) {
  this.xhttp.open("GET", path, true);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", APP_ID );
  this.xhttp.setRequestHeader("X-Parse-Master-Key", MASTER_KEY);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send(null);
}

XHR.setCallback(function(data){
    endRequest = Date.now();
    console.log(JSON.stringify(data));
    console.log('end request:'+ endRequest - window.startRequest)
});


// add a schema
function addSchemaTest() {
  var sleep_schema = {
      className: "Sleep",
      fields: {
        start_time: {
          type: "Date"
        },
        end_time: {
          type: "Date"
        },
        sleep_time: {
          type: "Number"
        },
        metadata : {
          type: "Object",
          fields: {
            schema_version : {
              type: "String"
            },
            app_version : {
              type: "String"
            },
            platform : {
              type: "String"
            }
          }
        }
      }
  };
  XHR.POST(SERVER_URL+'/schemas', sleep_schema)
}

// modify schema : add new field
function modifySchemaTest() {
  var sleep_schema_v2 = {
      className: "Sleep",
      fields: {
        user_id : {         // new field
          type: "String"
        }
      }
  };
  XHR.PUT(SERVER_URL+'/schemas' + "/" + sleep_schema_v2.className, sleep_schema_v2)
}

// modify schema: add new field 2
function modifySchemaTest2() {
  var sleep_schema_v3 = {
      className: "Sleep",
      fields: {
        sleep_quality : {         // new field
          type: "String"
        },
        polyphasic : {         // new field
          type: "Boolean"
        }
      }
  };
  XHR.PUT(SERVER_URL+'/schemas' + "/" + sleep_schema_v3.className, sleep_schema_v3)
}

// get all schemas
function getAllSchemas() {
  XHR.GET(SERVER_URL+'/schemas')
}
// get 1 schema
function getSleepSchemas() {
  XHR.GET(SERVER_URL+'/schemas/Sleep')
}

var Sleep = Parse.Object.extend("Sleep");

// save object
function saveObjectTest() {
  var sleepData = new Sleep();
  sleepData.set("user_id", "his_user_id");
  sleepData.set("start_time", new Date( Date.UTC(2017,11,27,23,0,0) ) );
  sleepData.set("end_time", new Date( Date.UTC(2017,11,28,7,0,0)));
  sleepData.set("sleep_time", 8);
  sleepData.set("sleep_quality", "AVG");
  sleepData.set("polyphasic", false);
  sleepData.save(null, {
    success: function(sleepData) {
      console.log(JSON.stringify(sleepData));
    },
    error: function(object, error) {
      console.log(JSON.stringify(error));
    }
  });
}


// modify schema : DELETE field
function deleteSchemaField() {
  var sleep_schema_v4 = {
    className: "Sleep",
    fields: {
      polyphasic: {
        "__op" : "Delete"
      }
    }
  };
  XHR.PUT(SERVER_URL+'/schemas' + "/" + sleep_schema_v4.className, sleep_schema_v4)
}

// add a schema : multi descendant object field
function addOtherSchemaTest() {
  var schema_multi = {
    className: "NobelWinner",
    fields: {
      name: {
        type: "Object",
        fields: {
          alias1 : {
            type: "String"
          },
          alias2 : {
            type: "String"
          }
        }
      },
      address: {
        type: "String"
      }
    }
  };
  XHR.POST(SERVER_URL+'/schemas', schema_multi)
}

function modifyOtherSchemaTest() {
  var nobelWinner = {
    "name": {
        "alias1": "Albert",
        "alias2": "Einstein"
      },
      "address": "street 2"
  }
  XHR.POST(SERVER_URL+'/classes/NobelWinner', nobelWinner)
}

// generate many data
function generateManyData() {
  var sleep_qs = ["SUPER","GOOD","NORMAL","AVG","BAD"];
  var polyphasic_a =[true,false];

  for(var i=0;i<100;i++) {
      var sleepData = new Sleep();
      sleepData.set("user_id", "edie_"+i);
      sleepData.set("start_time", new Date( Date.UTC(2017,11,27,23,0,0) ) );
      sleepData.set("end_time", new Date( Date.UTC(2017,11,28,7,0,0)));
      sleepData.set("sleep_time", randomRange(3,12) );
      sleepData.set("sleep_quality", sleep_qs[ randomRange(0,4)]);
      sleepData.set("polyphasic",polyphasic_a[randomRange(0,1)]);

      var metadata = {
        "schema_version":  "3",
        "app_version": "1",
        "platform": "android"
      }
      metadata.app_version = randomRange(1,25);
      sleepData.set("metadata", metadata);

      sleepData.save(null, {
        success: function(sleepData) {
          console.log(JSON.stringify(sleepData));
        },
        error: function(object, error) {
          console.log(JSON.stringify(error));
        }
      });
  }
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Query 1 : query field
function queryTest1() {
  var query = new Parse.Query(Sleep);
  query.greaterThan("sleep_time", 5);
  query.lessThan("sleep_time", 8);
  query.limit(10);
  query.find( {
    success: function(results) {
      console.log(JSON.stringify(results));
    },
    error: function(object, error) {
      console.log(JSON.stringify(error));
    }
  })
}

// Query 2 : query field under field : exact match
function queryTest2() {
    XHR.GET(SERVER_URL+'/classes/Sleep?'+encodeURI('where={"metadata.app_version":"3"}'))
}

// Query 3 : query field under field
function queryTest3() {
   XHR.GET(SERVER_URL+'/classes/Sleep?'+encodeURI('where={"metadata.app_version":{"$gte":1,"$lte":3}}'))
}

// ========================= MAIN =========================

addSchemaTest();
modifySchemaTest();
modifySchemaTest2();

getAllSchemas();

getSleepSchemas(); // get 1 schema // similar to getSensor

//saveObjectTest(); // save 1 object

// deleteSchemaField();

//addOtherSchemaTest() // other add schema test
//modifyOtherSchemaTest() 

//generateManyData();

queryTest1();
//queryTest2();
//queryTest3();