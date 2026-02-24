import { isProfane } from 'no-profanity';

//Changes difficulty changes password length and possible password letters
export function set_difficulty(new_difficulty:number)
{
  console.log(`Set Difficulty to ${new_difficulty}`);
  difficulty=new_difficulty;
  generate_password();
}

//Toggles password visibility when you click on a button
export function toggle_password_visibility()
{
  console.log("Toggling password visibility");
  if(password_input.type=="text")
  {
    console.log("Password is now hidden");
    password_input.type="password";
  }
  else
  {
    console.log("Password is now visible");
    password_input.type="text";
  }
}
export function attempt_login()
{

  let entered_password=password_input.value;

  //Success
  if(entered_password==password)
  {
    const audio = new Audio("sounds/dragon-studio-correct-472358.mp3");
    audio.play();

    results_element.style.backgroundColor="#c6efce";
    results_element.style.color="#006100";
    document.getElementById("results_messsage")!.innerHTML="You Logged In!<br>Generating New Password";

    password_input.disabled=true;
    setTimeout(generate_password,3000);
  }
  //Incorrect
  else
  {

    const audio = new Audio("sounds/freesound_community-wrong-buzzer-6268.mp3");
    audio.play();

    results_element.style.backgroundColor="#ffc7ce";
    results_element.style.color="#9c0006";
    document.getElementById("results_messsage")!.innerHTML="Your Passowrd is Incorrect. Try Again.";
  }
}
export function generate_password()
{
  password_input.disabled=false;
  console.log("Generate Password");
  results_element.style.backgroundColor="#ffeb9c";
  results_element.style.color="#9c6500";
  document.getElementById("results_messsage")!.innerHTML="Enter the shown password and then click Login.";


  while(true)
  {
    password="";
    for(let i=0;i<password_lengths[difficulty];i++)
    {
      const index=Math.floor(Math.random()*valid_characters[difficulty].length);
      const letter=valid_characters[difficulty][index];
      password+=letter;
    }
    document.getElementById("original_password")!.innerHTML=`Password ${password}`;
    
    //Repeat password generation is password is profane.
    if(!isProfane(password))
    {
      break;
    }
  }
}

let password_input:HTMLInputElement = document.getElementById("password_input") as HTMLInputElement;
password_input.addEventListener("paste", function(event) 
{
    alert("No using copy and paste");
    event.preventDefault(); // Prevents the default paste behavior
});

//Turn password back on after someone types a key in.
password_input.addEventListener("keydown",function(event){
  if(password_input.type=="text")
  {
    password_input.type="password";
  }
})

let results_element=document.getElementById("results") as HTMLDivElement;
results_element.style.backgroundColor="#ffeb9c";
results_element.style.color="#9c6500";

let password="";
let difficulty=0;
let valid_characters=["abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@!_$#","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789~!@#$%^&*()_-+={[}]|:;'<,>/"];
let password_lengths=[8,10,12,16];
generate_password();

