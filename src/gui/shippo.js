function loadScripts() {
  loadStates()
  loadEventListeners()
}

function loadStates(){
                  
  const selectDrop1 = document.getElementById('countries1');
  const selectDropStates1 = document.getElementById('state1');
  const selectDrop2 = document.getElementById('countries2');
  const selectDropStates2 = document.getElementById('state2');
  const sender_country = document.getElementById('country_code1');
  const sender_state = document.getElementById('state_code1');
  const receiver_country = document.getElementById('country_code2');
  const receiver_state = document.getElementById('state_code2');
  const input_residential = document.getElementById('residential');
  const checkbox_residential = document.getElementById('select_residential');

 
  fetch('countrycodes.json').then(res => {
    return res.json();
  }).then(data => {

    var array = [];
    array.push(`<option value="">Choose a Country</option>`); 

    data.forEach(country => {    

      selectDrop1.addEventListener('change', function() {
        if(selectDrop1.value == country.name)
        {
          sender_country.value = country.countryCode;
            var arrState = [];
            var keys = country.stateProvinces;
            arrState.push(`<option value="">Choose a State</option>`);
            for (let value of Object.values(keys)) {
                arrState.push(`<option value="${value.name}">${value.name}</option>`);  
            } 
            selectDropStates1.innerHTML = arrState.sort();    
            selectDropStates1.addEventListener('change', function() {
              for (let state of country.stateProvinces) {
                if(selectDropStates1.value == state.name)
                {
                  sender_state.value = state.code;
                }
            } 
              
            });

        }            
      }); 

      selectDrop2.addEventListener('change', function() {
        if(selectDrop2.value == country.name)
        {
          receiver_country.value=country.countryCode;
            var arrState = [];
            var keys = country.stateProvinces;
            arrState.push(`<option value="">Choose a State</option>`);
            for (let value of Object.values(keys)) {
                arrState.push(`<option value="${value.name}">${value.name}</option>`);  
            } 
            selectDropStates2.innerHTML = arrState.sort(); 
            
            selectDropStates2.addEventListener('change', function() {
              for (let state of country.stateProvinces) {
                if(selectDropStates2.value == state.name)
                {
                  receiver_state.value = state.code;
                }
            } 
            });
        }            
      }); 

      checkbox_residential.addEventListener('change', function() {
        if(checkbox_residential.checked){
          input_residential.value = "true";
        }else{
          input_residential.value = "false";
        }
      });
      
      array.push(`<option value="${country.name}">${country.name}</option>`);                
    });
    
    selectDrop1.innerHTML = array.sort();
    selectDrop2.innerHTML = array.sort();
  }).catch(err => {
    console.log(err);
  })
}

function form_validation(){
  const user_name = document.getElementById('Name');
  
    console.log("working "+user_name.value)
    if(isLetterAndWhitespace(user_name.value))
      {
        //alert("it work");
       return true;
      }
    else
      {
      alert("Please use only characters");
      return false;
      }
      
}

function isLetterAndWhitespace(str) {
  return /^[a-zA-Z\s]+$/.test(str);
}


function loadEventListeners() {
var menus = document.getElementsByClassName("dropdown-menu");
var buttons = document.getElementsByClassName("dropdownMenuButton");

for (let index = 0; index < menus.length; index++) {
  element = menus[index];
  
// add a click event listener to the menu
  element.addEventListener("click", function(e) {
  // prevent the default link behavior
  e.preventDefault();

  // get the selected option value and text
  var selectedOptionValue = e.target.getAttribute("data-value");
  var selectedOptionText = e.target.textContent;

  // update the button text
  buttons[index].textContent = selectedOptionText;
});


}

}