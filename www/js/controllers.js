angular.module('tcApp.controllers', ['ngRoute'])

  .controller('timeClockCtrl', ["$scope", "$location", "Settings",
    function($scope, $location, Settings) {

      // variables to control display of data.
      $scope.driveInClocked = false;
      $scope.serviceInClocked = false;
      $scope.serviceOutClocked = false;

      // variables to control the display of buttons
      $scope.StartOn = true;
      $scope.ServIn = false;
      $scope.ServOut = false;

      // variables for controlling the lunch times and buttons
      $scope.lunchStartTime = null;
      $scope.lunchEndTime = null;
      $scope.lunchStarted = false;
      $scope.lunchLogged = false;
      $scope.lunchLocation = "";

      // variables for maintaining the display of dates and times
      $scope.mydate = new Date();
      $scope.message = "";
      $scope.empString = "";

      $scope.driveInTime = null;
      $scope.serviceInTime = null;
      $scope.serviceOutTime = null;
      $scope.serviceLoc = "";
      $scope.sendTo = [];

      $scope.lat = null;
      $scope.lng = null;
      $scope.error = "";
      $scope.locToSet = "";
      $scope.empLocation = "";
      $scope.displayedNote = "";

      $scope.$watch(
        "$scope.serviceLoc",
        function handleChange (newValue, oldValue) {
          $scope.$apply()});

      $scope.$watch(
        "$scope.lunchLocation",
        function handleChange (newValue, oldValue) {
          $scope.$apply()});

      // Function to initialize the TimeClock App data.
      $scope.init = function() {

        $scope.mydate = new Date();  // Current Date

        if (Settings.messageSaved() == null) {

          // Starting a new message
          $scope.empString = "Name: " + Settings.empName() + "\nNumber/Id: " + Settings.empNumber();
          $scope.message = "";
          Settings.messageSaved($scope.message);
        }
        else {         // Current Message under construction

          $scope.message = Settings.messageSaved();
        }

        // Initialize times - Retrieve times from saved data
        $scope.driveInTime = new Date(Settings.driveInTime());
        $scope.serviceInTime = new Date(Settings.serviceInTime());
        $scope.serviceOutTime = new Date(Settings.serviceOutTime());
        $scope.lunchStartTime = new Date(Settings.lunchStartTime());
        $scope.lunchEndTime = new Date(Settings.lunchEndTime());

        // Retrieve locations
        $scope.serviceLoc = Settings.serviceLoc();
        $scope.empLocation = Settings.empLocation();
        $scope.displayedNote= $scope.empLocation;
        $scope.lunchLocation = Settings.lunchLocation();

        // Set Display Flags as Appropriate based on most recent state of the App
        if (Settings.lunchStarted() === "true") {
          $scope.lunchStarted = true;
        }
        if (Settings.lunchLogged() === "true") {
          $scope.lunchLogged = true;
        }

        if (Settings.driveInClocked() === "true") {
          $scope.driveInClocked = true;
          $scope.serviceInClocked = false;
          $scope.serviceOutClocked = false;
          $scope.StartOn = false;
          $scope.ServIn = true;
        }

        if (Settings.serviceInClocked() === "true") {
          $scope.serviceInClocked = true;
          $scope.ServIn = false;
          $scope.ServOut = true;
        }

        if (Settings.serviceOutClocked() === "true") {
          $scope.serviceOutClocked = true;
          $scope.ServOut = false;
          $scope.StartOn = true;
        }
      };

      $scope.timeString = function(date) {
        var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return hh + ":" + min;
      };

      // Callback function for the GPS location function
      $scope.savePosition = function (position) {

        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;

        $scope.reverseGeocode($scope.lat, $scope.lng);

      };

      // Function to convert the GPS lat/long to an address
      $scope.reverseGeocode = function (latitude, longitude) {
        var reverseGeocoder = new google.maps.Geocoder();
        var currentPosition = new google.maps.LatLng(latitude, longitude);

        reverseGeocoder.geocode({'latLng': currentPosition}, function(results, status) {

          var myString = "Lat:" + latitude.toString() + " Lon:" + longitude.toString();

          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {

              myString = results[0].formatted_address;

            }
          }

          // Update the display of the correct location
          if ($scope.locToSet === 'lunch') {
            $scope.lunchLocation = myString;
            Settings.lunchLocation(myString);
          }
          else {
            $scope.serviceLoc = myString;
            Settings.serviceLoc(myString);
          }

          $scope.$apply();

        });
      };

      // Callback error function if the Geolocation did not work
      $scope.showError = function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            $scope.error = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            $scope.error = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            $scope.error = "The request to get user location timed out.";
            break;
          case error.UNKNOWN_ERROR:
            $scope.error = "An unknown error occurred.";
            break;
        }
        $scope.$apply();
      };

      // Function called to retrieve the current location
      $scope.getLocation = function () {

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition($scope.savePosition, $scope.showError);
        }
        else {
          $scope.error = "Geolocation is not supported by this browser.";
        }
      };

      // Function to handle lunch times and location.
      // These are only cleared when the user closes out the day
      $scope.lunchClock = function(action) {
        if (action == 'in') {
          $scope.lunchStartTime = new Date();
          Settings.lunchStartTime($scope.lunchStartTime);
          $scope.lunchStarted = Settings.lunchStarted(true);
          $scope.message += "\n\nLunch: \n\tIn :\t" + $scope.timeString($scope.lunchStartTime);
          $scope.locToSet = 'lunch';
          $scope.getLocation();
        }
        else {
          $scope.lunchEndTime = new Date();
          Settings.lunchEndTime($scope.lunchEndTime);
          $scope.lunchLogged = Settings.lunchLogged(true);
          $scope.message += "\n\tOut:\t" + $scope.timeString($scope.lunchEndTime) +
            "\n\tLunch Location: \t" + $scope.lunchLocation + "\n";
        }
        Settings.messageSaved($scope.message);
      };

      // Function to Start New Job - this clocks in the drive time and displays the
      // travel clock in
      $scope.driveInClock = function(empLocation) {

        // create a new job to be logged.
        $scope.empLocation = empLocation;
        Settings.empLocation(empLocation);

        $scope.displayedNote = empLocation;

        $scope.driveInTime = new Date();
        Settings.driveInTime($scope.driveInTime);

        $scope.driveInClocked = true;
        Settings.driveInClocked(true);
        $scope.serviceInClocked = false;
        Settings.serviceInClocked(false);
        $scope.serviceOutClocked = false;
        Settings.serviceOutClocked(false);
        $scope.serviceLoc = "";
        Settings.serviceLoc($scope.serviceLoc);

        $scope.StartOn = false;
        $scope.ServIn = true;

        $scope.message += "\n\nNew Job \t" + $scope.empLocation +
            "\n\tTravel Clock In : \t" + $scope.timeString($scope.driveInTime);
        Settings.messageSaved($scope.message);
      };


      // Clock in for actual Service call, displays the travel clock out and
      // the service start
      $scope.serviceInClock = function () {
        $scope.serviceInTime = new Date();
        Settings.serviceInTime($scope.serviceInTime);

        // call to get the location
        $scope.locToSet = 'service';
        $scope.getLocation();

        $scope.serviceInClocked = true;
        Settings.serviceInClocked(true);
        $scope.ServIn = false;
        $scope.ServOut = true;
        $scope.message += "\n\tTravel Clock Out: \t" + $scope.timeString($scope.serviceInTime) +
          "\n\n\tService Clock In : \t" + $scope.timeString($scope.serviceInTime);
        Settings.messageSaved($scope.message);
      };

      // Clock out for Service call, displays the service complete time, ends the job
      $scope.serviceOutClock = function () {
        $scope.serviceOutTime = new Date();
        Settings.serviceOutTime($scope.serviceOutTime);
        $scope.serviceOutClocked = true;
        Settings.serviceOutClocked(true);

        $scope.ServOut = false;
        $scope.StartOn = true;
        $scope.message += "\n\tService Clock Out: \t" + $scope.timeString($scope.serviceOutTime) +
          "\n\tService Location : \t" + $scope.serviceLoc;
        Settings.messageSaved($scope.message);
        $scope.empLocation = "";
        Settings.empLocation($scope.empLocation);
        var note = document.getElementById('empLocation');
        note.value = $scope.empLocation;
      };

      // Close out for the day.  Sends email detailing work performed.
      $scope.closeOut = function () {
        $scope.sendTo = ["april@westerntel-com.com", Settings.emailAddress()];
        $scope.closeOutTime = new Date();
        if (document.getElementById('perDiem').checked) {
          $scope.message += "\n\nPer Diem Requested";
        }


        $scope.message += "\n\nFinal Clock Out: \t\t" + $scope.timeString($scope.closeOutTime);
        $scope.empString = "Name: " + Settings.empName() + "\nNumber/Id: " + Settings.empNumber();
        $scope.message = $scope.empString + $scope.message;
        // send email
        console.log($scope.message);

        cordova.plugins.email.open({
          to: $scope.sendTo,              // email addresses for TO field
          subject: "My Time Sheet",       // subject of the email
          body: $scope.message,           // email body (for HTML, set isHtml to true)
          isHtml: false                   // indicates if the body is HTML or plain text
        }, function () {
        }, this);

        $scope.clearData()
      };

      // Function to clear saved data
      $scope.clearData = function() {
        // clear all saved data
        $scope.driveInClocked = false;
        Settings.driveInClocked(false);

        $scope.serviceInClocked = false;
        Settings.serviceInClocked(false);

        $scope.serviceOutClocked = false;
        Settings.serviceOutClocked(false);

        $scope.serviceLoc = "";
        Settings.serviceLoc($scope.serviceLoc);
        $scope.empLocation = "";
        Settings.empLocation($scope.empLocation);
        $scope.displayedNote = $scope.empLocation;

        $scope.lunchStarted = false;
        Settings.lunchStarted(false);

        $scope.lunchLogged = false;
        Settings.lunchLogged(false);

        $scope.lunchLocation = "";
        Settings.lunchLocation($scope.lunchLocation);

        $scope.empLocation = "";
        Settings.empLocation($scope.empLocation);

        $scope.message = "";
        Settings.messageSaved($scope.message);

        $scope.StartOn = true;
        $scope.ServIn = false;
        $scope.ServOut = false;

        document.getElementById('perDiem').checked = false;
      };

      $scope.init();

    }])


.controller('settingsCtrl', ["$scope", "$location", "Settings",
  function($scope, $location, Settings) {

    // This controller handles the employee settings which remain static
    // The settings are fetched into the local variables and updated using
    // the Settings service. Upon update the user is returned to the main page.
    // Current settings are Employee Name, Employee Id/Number and Supervisor Email

    $scope.empName = "";
    $scope.empNumber = "";
    $scope.emailAddress = "";

    // Function to fetch data for display.

    $scope.fetch = function () {
      $scope.empName = Settings.empName();
      $scope.empNumber = Settings.empNumber();
      $scope.emailAddress = Settings.emailAddress();
    };

    // Function to store data when user updates Employee Information
    // Activated when the employee presses the Update button.

    $scope.saveMySettings = function (emp, num, email) {
      Settings.saveSettings(emp, num, email, function() {
          $scope.empName = Settings.empName();
          $scope.empNumber = Settings.empNumber();
          $scope.emailAddress = Settings.emailAddress();
        }
      );

      // Return to main page.
      $location.path('/my-time');
    };

    // Call fetch when page is activated by the employee clicking the
    // Employee Information button.
    $scope.fetch();

  }]);
