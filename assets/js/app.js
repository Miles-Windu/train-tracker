
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB3qY8EWzi4aCIIO6krKZqdDED8LqkoQ6A",
    authDomain: "train-tracker-dfe8c.firebaseapp.com",
    databaseURL: "https://train-tracker-dfe8c.firebaseio.com",
    projectId: "train-tracker-dfe8c",
    storageBucket: "train-tracker-dfe8c.appspot.com",
    messagingSenderId: "191259302386"
  };
  firebase.initializeApp(config);
  
  // storing the firebase functionality inside a variable for quick reference
  var database = firebase.database();
  
  // Adding an on click event to the submit button
  $("#add-train").on("click", function(event) {

    // prevents the normal functionailty of the button in order to manipulate it the way I want. 
      event.preventDefault();

      // get values from each input to stor into the database. 
      var name = $("#train-name").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#time").val().trim();
      var freq = $("#frequency").val().trim();

      // Pushes the information that we gathered from the input fields into an object to send to firebase. 
      database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        freq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
  
      $("#train-name").val(" ")
      $("#destination").val(" ")
      $("#time").val(" ")
      $("#frequency").val(" ")
  });
  
  // adds an event listener for when an entry is added to the database.
  database.ref().on("child_added", function(snapshot) {
      
    // saves the information stored onto the database into a variable that can be called/referenced in our script.
      var snap = snapshot.val();

      // console log the information from firebase to ensure that all information is being passed properly.

      // should log the name of the train
      console.log(snap.name);

      //should log the destination 
      console.log(snap.destination);

      //should log the time that the train comes
      console.log(snap.firstTrain);

      //should log the freqency of the train
      console.log(snap.freq);
  
      var timeConverted = moment(snap.firstTrain, "HH:mm").subtract(1, "years");
      console.log(timeConverted);
  
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
  
      var difference = moment().diff(moment(timeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + difference);
  
      var remainder = difference % snap.freq;
      console.log(remainder);
  
      var minRemaining = snap.freq - remainder;
      console.log("MINUTES TILL TRAIN: " + minRemaining);
  
      var nextTrain = moment().add(minRemaining, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


      // appends the data from firebase to the table on the DOM
      var newRow = $("<tr>");
      var newName = $("<td>" + snap.name + "</td>");
      newRow.append(newName);
      var newDest = $("<td>" + snap.destination + "</td>");
      newRow.append(newDest);
      var newFreq = $("<td>" + snap.freq + "</td>");
      newRow.append(newFreq);
      var newNextTrain = $("<td>" + moment(nextTrain).format("HH:mm") + "</td>");
      newRow.append(newNextTrain);
      var newMinRemaining =$("<td>" + minRemaining + "</td>");
      newRow.append(newMinRemaining);
      $("#train-table").append(newRow);
  
    
    }, function(err) {
      console.log("Errors handled: " + err.code);
    });