var animalArray=[];

$(document).ready(function(){
    // do some setup
    initialize();
});

function initialize(){
    // set the listeners for buttons and submit animal
    //call to db and display existing animals
    setListeners();
    displayAnimals();
}

function displayAnimals(){
    // get all animals from database and put in array.
    // loop through array and display.
    $.ajax({
      type: 'GET',
      url: '/zoo',
      success: function(response){
        console.log("in display animals",response);
        // append animals to the dom
        appendAnimals(response);
      }
    });
}
function setListeners(){
    // set listeners for buttons, and default operation on form submit
    // on submit, prevent default, call save animal to post and insert to the database
    $("#animal-form").on("submit", function(event){
        event.preventDefault();
        saveAnimal();
    });

}

function appendAnimals(response){
    // empty the existing div calc-container
    $('.animal-container').empty();
    // empty global animal array
    animalArray=[];
    // zero out total animal display
    var animalCount = 0;
    //loop through response and put each returned animal object into an array
    response.forEach(function(animal){

        // push these into an array
            animalArray.push(animal);
        });

        if (animalArray.length==0){
            // if no results GTFO
            return;
        }

        var animalRow;
        for (var i=0; i<animalArray.length; i++){
            // loop through returned animal array and stick them on the dom
            animalRow = animalArray[i];
            animalCount = animalCount + animalRow.animal_count;
            $('.animal-container').append('<p>Type of Animal:  '+ animalRow.animal_type + '</p>');
            $('.animal-container').append('<p>Quantity of Animal:  '+ animalRow.animal_count + '</p>');
      }
      // update zoo population
      console.log("animalCount =", animalCount);
      $('#showAnimals').text(animalCount);
}

function saveAnimal(){

    console.log("I am in function save Animal");

    //initialize variables
    var values = {};
    var animalData = false;
    var strCheck = "";

    //fetch form values by stepping through the form object, storing each key value
    // pair in an object.
    $.each($("#animal-form").serializeArray(), function(i, field){
        values[field.name] = field.value;
        //check to see if the data entry form was empty when submit happened
        strCheck = field.value;
        if (strCheck.length >0){
            animalData = true;
        };
    });

    //if data was entered, push object to array
    if (animalData){
      animalArray.push(values);

      // post call
      $.ajax({
        type: 'POST',
        url: '/zoo',
        data: values,
        success: function(response){
          console.log(response);
          displayAnimals();
        }
      });
    };
    //clear out form values
    $('#animal-form').find('input[type=text]').val('');
}
