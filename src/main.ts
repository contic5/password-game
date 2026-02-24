import { isProfane } from 'no-profanity';
import { get_words } from './load_words';

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
    document.getElementById("toggle_password_visibility_button")!.textContent="Show Password";
  }
  else
  {
    console.log("Password is now visible");
    password_input.type="text";
    document.getElementById("toggle_password_visibility_button")!.textContent="Hide Password";
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
function to_title_case(string:string) {
  if (string.length === 0) {
    return ""; // Handle empty strings
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function generate_random_passphrase()
{
  while(true)
  {
    password="";
    for(let i=0;i<3;i++)
    {
      const index=Math.floor(Math.random()*words.length);
      password+=to_title_case(words[index]);
    }

    //Repeat password generation is password is profane.
    if(!isProfane(password))
    {
      break;
    }
  }

  /*
Common substitutions are from https://wmich.edu/arts-sciences/technology-password-tips
  */
  password=password.replace("s","$");
  password=password.replace("i","!");
  password=password.replace("a","@");
  password=password.replace("7","t");
  password=password.replace("e","3");
  password=password.replace("g","6");
  password=password.replace("o","0");
  password=password.replace("b","8");


  document.getElementById("original_password")!.innerHTML=`Password ${password}`;
}
function generate_random_password()
{
  password_input.value="";
  while(true)
  {
    password="";
    for(let i=0;i<password_lengths[difficulty];i++)
    {
      const index=Math.floor(Math.random()*valid_characters[difficulty].length);
      const letter=valid_characters[difficulty][index];
      password+=letter;
    }
    
    //Repeat password generation is password is profane.
    if(!isProfane(password))
    {
      break;
    }
  }

  document.getElementById("original_password")!.innerHTML=`Password ${password}`;
}
export function generate_password()
{
  password_input.disabled=false;
  results_element.style.backgroundColor="#ffeb9c";
  results_element.style.color="#9c6500";
  document.getElementById("results_messsage")!.innerHTML="Enter the shown password and then click Login.";

  if(difficulty<4)
  {
    generate_random_password();
  }
  else
  {
    generate_random_passphrase();
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
async function setup()
{
  words=await get_words(5,10);
  console.log(words);
}

let results_element=document.getElementById("results") as HTMLDivElement;
results_element.style.backgroundColor="#ffeb9c";
results_element.style.color="#9c6500";

let password="";
let difficulty=0;
let valid_characters=["abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@!_$#","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789~!@#$%^&*()_-+={[}]|:;'<,>/"];
let password_lengths=[8,10,12,16];

let words:string[]=[];
setup();
generate_password();

