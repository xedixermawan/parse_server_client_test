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
const SERVER_URL = 
const APP_ID     = 
const MASTER_KEY = 
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
    console.log(JSON.stringify(data));
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

function saveSleepData(userid, date_start,date_end, sleep_time, sq, polyphasic, metadata) {
  var sleepData = new Sleep();
  sleepData.set("user_id", userid);
  sleepData.set("start_time", date_start );
  sleepData.set("end_time", date_end );
  sleepData.set("sleep_time", sleep_time );
  sleepData.set("sleep_quality", sq);
  sleepData.set("polyphasic",polyphasic);
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

function saveSleepData2(userid,date_start,date_end) {
  var sleep_qs = ["SUPER","GOOD","NORMAL","AVG","BAD"];
  var polyphasic_a =[true,false];
    var metadata = {
      "schema_version":  "3",
      "app_version": "1",
      "platform": "android"
    }
    metadata.app_version = randomRange(1,25);
    saveSleepData(userid,
        date_start,
        date_end,
        randomRange(3,12),
        sleep_qs[ randomRange(0,4)],
        polyphasic_a[randomRange(0,1)],
        metadata
      );
}

// generate many data
function generateManyData() {
  var sleep_qs = ["SUPER","GOOD","NORMAL","AVG","BAD"];
  var polyphasic_a =[true,false];

  for(var i=0;i<100;i++) {
    var metadata = {
      "schema_version":  "3",
      "app_version": "1",
      "platform": "android"
    }
    metadata.app_version = randomRange(1,25);
    saveSleepData("DUCKO "+i,
        new Date(Date.UTC(2017,11,1,23,0,0)),
        new Date(Date.UTC(2017,11,1,23,0,0)),
        randomRange(3,12),
        sleep_qs[ randomRange(0,4)],
        polyphasic_a[randomRange(0,1)],
        metadata
      );
  }
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate data for queryDataTest2
function generateData2() {
  saveSleepData2("user_data_A",
    new Date(Date.UTC(2017,11,1,6,0,0)),  // start_time  year,month,day,hour,min,sec
    new Date(Date.UTC(2017,11,1,13,0,0))   // end_time
  );

  saveSleepData2("user_data_B",
    new Date(Date.UTC(2017,11,1,10,0,0)),
    new Date(Date.UTC(2017,11,2,8,0,0))
    );
  saveSleepData2("user_data_C",
    new Date(Date.UTC(2017,11,2,5,0,0)),
    new Date(Date.UTC(2017,11,3,6,0,0))
  );

  saveSleepData2("user_data_D",
    new Date(Date.UTC(2017,11,1,1,0,0)),
    new Date(Date.UTC(2017,11,1,5,0,0))
    );
  saveSleepData2("user_data_E",
    new Date(Date.UTC(2017,11,3,8,0,0)),
    new Date(Date.UTC(2017,11,3,12,0,0))
  );
  saveSleepData2("user_data_F",
    new Date(Date.UTC(2017,11,1,6,20,0)),
    new Date(Date.UTC(2017,11,3,7,0,0))
    );
}

// this query return : user_data_ : A,B,C,F 
function queryDataTest2() {
  var or1 = new Parse.Query(Sleep);
  or1.greaterThanOrEqualTo("start_time", new Date(Date.UTC(2017,11,1,8,0,0)) );
  or1.lessThanOrEqualTo("start_time", new Date(Date.UTC(2017,11,2,10,0,0)));
  
  var or2 = new Parse.Query(Sleep);
  or2.greaterThanOrEqualTo("end_time", new Date(Date.UTC(2017,11,1,8,0,0)) );
  or2.lessThanOrEqualTo("end_time", new Date(Date.UTC(2017,11,2,10,0,0)));
  
  var or3 = new Parse.Query(Sleep);
  or3.lessThan("start_time", new Date(Date.UTC(2017,11,1,8,0,1)));
  or3.greaterThan("end_time", new Date(Date.UTC(2017,11,2,10,0,0)));
  
  var queryCompound = Parse.Query.or(or1,or2,or3);
  queryCompound.find()
    .then(function(results) {
      console.log(JSON.stringify(results));
    })
    .catch(function(error) {
      console.log(JSON.stringify(error));
    });
}

// other version of queryDataTest2 ( but don't work. need to find a way to change date format)
function queryDataTest3() {
  var start_q ='\"'+(new Date(Date.UTC(2017,11,1,8,0,0))).toISOString()+'\"';
  var end_q = '\"'+(new Date(Date.UTC(2017,11,2,10,0,0))).toISOString()+'\"';;
  var or1 = '{"start_time":{"$gte":'+start_q+',"$lte":'+end_q+'}},';
  var or2 = '{"end_time":{"$gte":'+start_q+',"$lte":'+end_q+'}},';
  var or3 = '{"start_time":{"$lt":'+start_q+'},"end_time":{"$gt":'+end_q+'}}';
  var query ='where={"$or":['+or1+or2+or3+']}';
  console.log(query)
  XHR.GET(SERVER_URL+'/classes/Sleep?'+encodeURI(query))
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
    XHR.GET(SERVER_URL+'/classes/Sleep?'+encodeURI('where={"metadata.app_version":3}'))
}

// Query 3 : query field under field
function queryTest3() {
   XHR.GET(SERVER_URL+'/classes/Sleep?'+encodeURI('where={"metadata.app_version":{"$gte":1,"$lte":3}}'))
}

// ========================= MAIN =========================

//addSchemaTest();
//modifySchemaTest();
//modifySchemaTest2();

//getAllSchemas();

//getSleepSchemas(); // get 1 schema // similar to getSensor

//saveObjectTest(); // save 1 object

// deleteSchemaField();

//addOtherSchemaTest() // other add schema test
//modifyOtherSchemaTest() 

//generateManyData();

//queryTest1();
//queryTest2();
//queryTest3();


// generateData2(); // generate data for queryDataTest2
queryDataTest2();
