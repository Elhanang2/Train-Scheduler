
// $(document).ready(function() {
  //firebase api key 
  var config = {
    apiKey: "AIzaSyC5_bIdWSruFN-5Msy_rpjIQTN-mdbhsrs",
    authDomain: "train-schedule-f8b18.firebaseapp.com",
    databaseURL: "https://train-schedule-f8b18.firebaseio.com",
    projectId: "train-schedule-f8b18",
    storageBucket: "train-schedule-f8b18.appspot.com",
    messagingSenderId: "1091618328222"
  };
  // Initialize Firebase
  firebase.initializeApp(config);
  //create variable  counter as a function of time to use as an id
  var d= new Date();
  var t=d.getTime();
  var counter = t;
  // Create a variable to reference the database
  var database = firebase.database();
   
  
  
  
    //initialization and declare 
  
    var nextarrival; 
  
  //onclick submit get the value and push it to the firebase to store  
  $("#submit-button").on("click",function(event){
      event.preventDefault();
      
    var  trainName=$("#train-name").val().trim();
    var  destination=$("#destination").val().trim();
    var  firstTrainTime=$("#train-time").val().trim();
   var   frequency=$("#frequency").val().trim();
      
        console.log(trainName);
        console.log(destination);
        console.log(firstTrainTime);
        console.log(frequency);
       trainrecord(trainName, destination, firstTrainTime, frequency) ;
      ////////     
        return false;   
      
  });
  //function to record train information in firebase 
  function trainrecord(trainName, destination, firstTrainTime,frequency){
    console.log(counter)
       counter+=1;
       console.log(counter);
       var train={
        id: counter,
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
       }
      database.ref("trains/"+counter).set(train);
      
     reset();

  }
  //function to empitying form
  function reset(){

    $("#train-name").val("");
    $("#destination").val("");
    $("#train-time").val("");
    $("#frequency").val("");
  }
    readSchedule();
    var trainData;
  //function on add child get snapshot of the data
  function readSchedule(){
    database.ref("trains/").on("child_added", function(Snapshot) {
  
      console.log("Train name" + Snapshot.val().trainName);
      console.log("Destination" + Snapshot.val().destination);
      console.log("First train time" + Snapshot.val().firstTrainTime);
      console.log("Frequency" + Snapshot.val().frequency);
      
        trainData = Snapshot.val();
      var trainName=trainData.trainName;
      var destination=trainData.destination;
      var firstTrainTime=trainData.firstTrainTime;
      var frequency=trainData.frequency;
      //to calculate next arrival using moment 
      //take current time and first train time & change it to minutes .
      //to get next arrival take time difference between curret time and 
      //first train arrival   
      var firstTrainHour= moment(firstTrainTime,"HH:mm").format("HH");
      var  firstTrainMinute=moment(firstTrainTime,"HH:mm").format("mm");
      var currentHour=moment().format("H");
      var currentMinutes=moment().format("m");
      var firstTrainInMinutes=(firstTrainHour*60) + (firstTrainMinute*1);
      var currentInMinutes=(currentHour*60) + (currentMinutes*1);
      var timeDiff=currentInMinutes - firstTrainInMinutes;
      var trainpassed=Math.floor(timeDiff/frequency);
      var nextarrival=(trainpassed + 1)*frequency + firstTrainInMinutes;
      if(firstTrainInMinutes < currentInMinutes){
        var minAway=nextarrival-currentInMinutes;
        var nextarrival=moment().add(minAway,"minutes").format("HH:mm");
      }else{
        var nextarrival=firstTrainTime;
        var minAway=firstTrainInMinutes-currentInMinutes;
      }
      
      //create table colomn tag and append to new created table row
      var c=$("<tr>");
        c.append($("<td data-label='Train Name'>").html(trainName));
        c.append($("<td data-label='Destination'>").html(destination));
        c.append($("<td data-label='Frequency'>").html(frequency)); 
        c.append($("<td data-label='Next Arrival'>").html(nextarrival));
        c.append($("<td data-label='Minutes Away'>").html(minAway));
        c.append($('<td><button type="submit" onclick="deletetrainSchedule(trainData.id)" class="btn btn-danger btn-sm delete-btn" >Delete</button></td>'))
        
        //append table row in id train-output 
        $(".table #train-output").append(c);
        console.log("idddddddddddddddd"+ trainData.id)
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
  }
 
  // function to delete train information from firebase database
  function deletetrainSchedule(id){

  
    if(confirm("Are You sure?")){
      $(this).closest("tr").remove();
      firebase.database().ref("trains/"+ id).remove();
      reset();
      window.location.reload();
      
    }
    
  }
  
// });