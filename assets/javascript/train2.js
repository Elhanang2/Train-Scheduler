var config = {
    apiKey: "AIzaSyC5_bIdWSruFN-5Msy_rpjIQTN-mdbhsrs",
    authDomain: "train-schedule-f8b18.firebaseapp.com",
    databaseURL: "https://train-schedule-f8b18.firebaseio.com",
    projectId: "train-schedule-f8b18",
    storageBucket: "train-schedule-f8b18.appspot.com",
    messagingSenderId: "1091618328222"
  };
  firebase.initializeApp(config);

  var d= new Date();
  var t = d.getTime();
  var counter = t;
  var database = firebase.database();
   
    $("#submit-button").on("click", function(event){
            event.preventDefault();
            var  trainName=$("#train-name").val().trim();
            var  destination=$("#destination").val().trim();
            var  firstTrainTime=$("#train-time").val().trim();
            var   frequency=$("#frequency").val().trim();
            // console.log(trainName, destination, frequency, firstTrainTime)
            createTrainSchedule(trainName, destination, firstTrainTime, frequency);
            // $(form).reset();

    })

    function createTrainSchedule(trainName, destination, firstTrainTime, frequency){
        counter+=1;
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
    function reset(){
        //empitying the form 
      $("#train-name").val("");
      $("#destination").val("");
      $("#train-time").val("");
      $("#frequency").val("");
    }
    readTrainSchedule();
    function readTrainSchedule(){
        var train= database.ref("trains/");
        train.on("child_added", function(Snapshot){
            var trainData= Snapshot.val();
            var tName=trainData.trainName;
            var dest=trainData.destination;
            var fTrainTime=trainData.firstTrainTime;
            var freq=trainData.frequency;
            console.log("train data 1"+ trainData.trainName)
            //to calculate next arrival using moment 
            //take current time and first train time & change it to minutes .
            //to get next arrival take time difference between curret time and 
            //first train arrival   
            var firstTrainHour= moment(fTrainTime,"HH:mm").format("HH");
            var  firstTrainMinute=moment(fTrainTime,"HH:mm").format("mm");
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
                var nextarrival=fTrainTime;
                var minAway=firstTrainInMinutes-currentInMinutes;
            }
                
            //create table colomn tag and append to new created table row
            var c=$("<tr>");
                c.append($("<td>").html(tName));
                c.append($("<td>").html(dest));
                c.append($("<td>").html(freq)); 
                c.append($("<td>").html(nextarrival));
                c.append($("<td>").html(minAway));
                c.append($(
                    '<td><button type="button" onclick="updateTrain($(this).trainData)" id="edit-btn" class="btn btn-warning btn-sm " >Edit</button>'+
                    '<button type="button" class="btn btn-danger btn-sm delete-btn" >Delete</button></td>'))
                
                //append table row in id train-output 
                $(".table #train-output").append(c);
                
                })
                
    }

    function updateTrain(tData){
        console.log("name is aynalem");
        $("#form").html('<h2>Add Train</h2>' +
            '<form>' +
                '<div class="form-group">'+
                        
               ' <label for="train-name">Train Name</label>'+
                '<input type="text" class="form-control" id="train-name"  placeholder="Trenton Express">'+
                '<small id="emailHelp" class="form-text text-muted"></small>'+
                '</div>'+
                '<div class="form-group">'+
                '<label for="destination">Destination</label>'+
                '<input type="text" class="form-control" id="destination" placeholder="Trenton">'+
                '</div>'+
                '<div class="form-group">'+
                    '<label for="train-time">First Train Time (HH:mm-military time)</label>'+
                    '<input type="text" class="form-control" id="train-time" placeholder="HH:mm">'+
                '</div>'+
                '<div class="form-group">'+
                    '<label for="frequency">Frequency (min)</label>'+
                    '<input type="text" class="form-control" id="frequency" placeholder="20min">'+
                '</div>'+
                
                '<button style="display: none" type="submit" id="submit-button" class="btn btn-primary ">Submit</button>'+
                    '<button style="display: inline-block" id="submit-button1" class="btn btn-primary ">Update</button>'+
                    '<button style="display: inline-block" id="submit-button2" class="btn btn-primary ">Cancel</button>'+
                
            '</form>')
        console.log("rrrrrrrrrrrrrrrrr"+tData.trainName)
        // $("#train-name").val(trainData.trainName);
        // $("#destination").val(trainData.destination);
        // $("#train-time").val(trainData.firstTrainTime);
        // $("#frequency").val(trainData.frequency);

    }