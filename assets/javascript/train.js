 $(document).ready(function() {
  var config = {
    apiKey: "AIzaSyC5_bIdWSruFN-5Msy_rpjIQTN-mdbhsrs",
    authDomain: "train-schedule-f8b18.firebaseapp.com",
    databaseURL: "https://train-schedule-f8b18.firebaseio.com",
    projectId: "train-schedule-f8b18",
    storageBucket: "train-schedule-f8b18.appspot.com",
    messagingSenderId: "1091618328222"
  };
  firebase.initializeApp(config);
  // Create a variable to reference the database
  var database = firebase.database();
   
    

  // Initialize Firebase
//initialization and declare 
var trainName="" ;
var destination="";
var firstTrainTime="";
var frequency="";
var nextarrival;

       
   
 //on click submit get the value and push it to the firebase to store  
$(".submit-button").on("click",function(event){
          event.preventDefault();
         
          trainName=$("#train-name").val().trim();
          destination=$("#destination").val().trim();
          firstTrainTime=$("#train-time").val().trim();
          frequency=$("#frequency").val().trim();
          
          console.log(trainName);
         console.log(destination);
         console.log(firstTrainTime);
       console.log(frequency);
        
       database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
        
        
        });
        //empitying the form 
        $("#train-name").val("");
          $("#destination").val("");
          $("#train-time").val("");
          $("#frequency").val("");
     ////////     
       return false;   
    });
   
    //function on add child get snapshot of the data
    database.ref().on("child_added", function(Snapshot) {
   
      console.log("Train name" + Snapshot.val().trainName);
      console.log("Destination" + Snapshot.val().destination);
      console.log("First train time" + Snapshot.val().firstTrainTime);
       console.log("Frequency" + Snapshot.val().frequency);
      
      
          var trainName=Snapshot.val().trainName;
          var destination=Snapshot.val().destination;
          var firstTrainTime=Snapshot.val().firstTrainTime;
          var frequency=Snapshot.val().frequency;
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
      var c=$("<tr>")
        c.append($("<td>").html(trainName));
        c.append($("<td>").html(destination));
        c.append($("<td>").html(frequency)); 
        c.append($("<td>").html(nextarrival));
        c.append($("<td>").html(minAway));
        
       
        //append table row in id train-output 
        $(".table #train-output").append(c);
        
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
     
        
 });