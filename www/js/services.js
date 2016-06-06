angular.module('tcApp.services', [])
  .constant("localStorage", window.localStorage)


  .factory('BlankFactory', [function(){

  }])

  .service('Settings', ["localStorage", function(localStorage){

    // employee information
    this.empName = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_empName", value);
      }
      return localStorage.getItem("_empName");
    };

    this.empNumber = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_empNumber", value);
      }
      return localStorage.getItem("_empNumber");
    };

    this.emailAddress = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_emailAddress", value);
      }
      return localStorage.getItem("_emailAddress");
    };


    // lunch data
    this.lunchStartTime = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_lunchStartTime", value);
      }
      return localStorage.getItem("_lunchStartTime");
    };
    this.lunchEndTime = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_lunchEndTime", value);
      }
      return localStorage.getItem("_lunchEndTime");
    };
    this.lunchLocation = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_lunchLocation", value);
      }
      return localStorage.getItem("_lunchLocation");
    };


    // Service Times and Locations
    this.driveInTime = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_driveInTime", value);
      }
      return localStorage.getItem("_driveInTime");
    };
    this.serviceInTime = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_serviceInTime", value);
      }
      return localStorage.getItem("_serviceInTime");
    };
    this.serviceOutTime = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_serviceOutTime", value);
      }
      return localStorage.getItem("_serviceOutTime");
    };
    this.serviceLoc = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_serviceLoc", value);
      }
      return localStorage.getItem("_serviceLoc");
    };
    this.empNotes  = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_empNotes", value);
      }
      return localStorage.getItem("_empNotes");
    };


    // flags for what to display
    this.driveInClocked = function(value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_driveInClocked", value);
      }
      return localStorage.getItem("_driveInClocked");
    };
    this.serviceInClocked = function(value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_serviceInClocked", value);
      }
      return localStorage.getItem("_serviceInClocked");
    };
    this.serviceOutClocked = function(value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_serviceOutClocked", value);
      }
      return localStorage.getItem("_serviceOutClocked");
    };
    this.lunchStarted= function(value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_lunchStarted", value);
      }
      return localStorage.getItem("_lunchStarted");
    };
    this.lunchLogged= function(value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_lunchLogged", value);
      }
      return localStorage.getItem("_lunchLogged");
    };


    // Built up email message
    this.messageSaved = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_message", value);
      }
      return localStorage.getItem("_message");
    };
    this.mydate = function (value) {
      if (value === null || value != undefined) {
        localStorage.setItem("_mydate", value);
      }
      return localStorage.getItem("_mydate");
    };

    // Saves employee settings
    this.saveSettings = function(empName, empNum, email, callback) {
      var self = this;
      self.empName(empName);
      self.empNumber(empNum);
      self.emailAddress(email);
      if(typeof(callback) == "function") {
        callback();
      }
    };

  }]);

