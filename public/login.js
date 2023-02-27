(function(){
    const formEl = document.querySelector(".login");
    const errorEL = document.querySelector(".error");
    const username = document.querySelector(".username");
    const submitButton = document.querySelector(".send button");
    submitButton.disabled = !username?.value;
    username.addEventListener("input",(e)=>{
        submitButton.disabled = !e.target.value;
    })

    formEl.addEventListener("submit",(e)=>{

        if(username.value.trim()==="dog"||!username||!/^[A-Za-z0-9]*$/.test(username?.value)){

            errorEL.innerHTML =  `<strong>Invalid Input Value! Please Input Another One</strong>`

            e.preventDefault(); 
        }
    })



})()