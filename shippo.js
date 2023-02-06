function loadStates(){
                  
    const selectDrop = document.getElementById('countries');
    const selectDropStates = document.getElementById('state');
             
    fetch('https://gist.githubusercontent.com/manishtiwari25/0fa055ee14f29ee6a7654d50af20f095/raw/5d9d70dbdfc9015e393c020d93a3f341d5185fc9/country_state.json').then(res => {
      return res.json();
    }).then(data => {

      var array = [];
      array.push(`<option value="">Choose a Country</option>`); 

      data.forEach(country => {       
        selectDrop.addEventListener('change', function() {
     
            if(selectDrop.value == country.name)
            {
                var arrState = [];
                var keys = country.stateProvinces;
                arrState.push(`<option value="">Choose a State</option>`);
                for (let value of Object.values(keys)) {
                    arrState.push(`<option value="${value.name}">${value.name}</option>`);  
                } 
                selectDropStates.innerHTML = arrState.sort();    
            }            
        });   
        array.push(`<option value="${country.name}">${country.name}</option>`);                
      });
      
      selectDrop.innerHTML = array.sort();
    }).catch(err => {
      console.log(err);
    })
}

function form_validation(){
  const user_name = document.getElementById('Name');
  
    console.log("working "+user_name.value)
    var letters = /^[A-Za-z]+$/;
    if(user_name.value.match(letters))
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

function validate_submit(){
  console.log("Jjjskkk");
  const user_name = document.getElementById('Name');
 console.log("hooly "+user_name.value)
}