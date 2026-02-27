import { isProfane } from 'no-profanity';
import { get_extremely_long_words, get_words } from './load_words';

//Changes difficulty changes password length and possible password letters
export function set_difficulty(new_difficulty:number)
{
  console.log(`Set Difficulty to ${new_difficulty}`);
  difficulty=new_difficulty;
  correct_answers=0;
  wrong_answers=0;
  generate_password();
}

//Toggles password visibility when you click on a button
export function toggle_password_visibility()
{
  console.log("Toggling password visibility");
  //Make password go from visible to hidden
  if(password_input.type=="text")
  {
    console.log("Password is now hidden");
    password_input.type="password";
    document.getElementById("toggle_password_visibility_button")!.textContent="Show Password";
  }
  //Make password go from hidden to visible
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

  //Success. Show results and play sound.
  if(entered_password==password)
  {
    const audio = new Audio("sounds/dragon-studio-correct-472358.mp3");
    audio.play();

    results_element.style.backgroundColor="#c6efce";
    results_element.style.color="#006100";
    correct_answers+=1;
    wrong_answers=0;

    if(correct_answers>=3)
    {
      if(difficulty<password_lengths.length+1)
      {
        document.getElementById("results_messsage")!.innerHTML="You Logged In!<br>Increasing Level!<br>Generating New Password";
        correct_answers=0;
        difficulty+=1;
      }
      else
      {
        document.getElementById("results_messsage")!.innerHTML="You Logged In!<br>You've completed the game!<br>Generating New Password";
      }
    }
    else
    {
      document.getElementById("results_messsage")!.innerHTML="You Logged In!<br>Generating New Password";
    }

    password_input.disabled=true;
    reset_button.disabled=true;
    login_button.disabled=true;
    setTimeout(generate_password,3000);
  }
  //Incorrect. Show results and play sound.
  else
  {

    const audio = new Audio("sounds/freesound_community-wrong-buzzer-6268.mp3");
    audio.play();

    results_element.style.backgroundColor="#ffc7ce";
    results_element.style.color="#9c0006";

    wrong_answers+=1;
    if(wrong_answers>=3)
    {
      wrong_answers=0;
      correct_answers=0;
      if(difficulty>0)
      {
        
        document.getElementById("results_messsage")!.innerHTML="Your Password is Incorrect.<br>Lowering Difficulty.<br>Try Again.";
        difficulty-=1;

        password_input.disabled=true;
        reset_button.disabled=true;
        login_button.disabled=true;
        setTimeout(generate_password,3000);
      }
      else
      {
        document.getElementById("results_messsage")!.innerHTML="Your Password is Incorrect.<br>Asking for help is ok.<br>Try Again.";
      }
    }
    else
    {
        document.getElementById("results_messsage")!.innerHTML="Your Password is Incorrect.<br>Try Again.";
    }
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
    //Add three words to the password.
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
  Perform common letter symbol substitutions.
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
function fisherYatesShuffle(my_string:string) 
{
    let arr:string[]=my_string.split("");
  	for (let i = arr.length - 1; i > 0; i--) {
    	const j = Math.floor(Math.random() * (i + 1));
    	[arr[i], arr[j]] = [arr[j], arr[i]];
  	}
  	return arr.join("");
}
function generate_random_password()
{
  password_input.value="";
  while(true)
  {
    password="";
    const counts = difficulty_character_counts[difficulty];
    //Generate each type of letter (lowercase, uppercase, number, common symbol, rare symbol)
    for(let key in counts)
    {
      const character_count_key=key as keyof CharacterCount;
      const letter_count = counts[character_count_key] ?? 0;
      const letters=character_groups[character_count_key];
      for(let i=0;i<letter_count;i++)
      {
        let index=Math.floor(Math.random()*letters.length);
        password+=letters[index];
      }
    }

    password=fisherYatesShuffle(password);
    //Repeat password generation is password is profane.
    if(!isProfane(password))
    {
      break;
    }
  }

  document.getElementById("original_password")!.innerHTML=`Password ${password}`;
}
export async function use_random_extremely_long_word()
{
  let extremely_long_words=await get_extremely_long_words();
  let index=Math.floor(Math.random()*extremely_long_words.length);
  password=extremely_long_words[index];
  document.getElementById("original_password")!.innerHTML=`Password ${password}`;
}
export function generate_password()
{
  //Let user try to enter password
  password_input.value="";
  password_input.disabled=false;
  reset_button.disabled=false;
  login_button.disabled=false;
  results_element.style.backgroundColor="#ffeb9c";
  results_element.style.color="#9c6500";
  document.getElementById("results_messsage")!.innerHTML="Enter the shown password and then click Login.";
  document.getElementById("difficulty")!.innerHTML=difficulties[difficulty]+" Difficulty";

  if(difficulty<password_lengths.length)
  {
    generate_random_password();
  }
  else if(difficulty==password_lengths.length)
  {
    generate_random_passphrase();
  }
  //Joke difficulty that uses an extremely long word.
  else
  {
    use_random_extremely_long_word();
  }
}

async function setup()
{
  //Passphrasw words should be 5 to 10 letters long
  words=await get_words(5,10);
  console.log(words);
}

//Prevent copy and past
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
    document.getElementById("toggle_password_visibility_button")!.textContent="Show Password";
  }
})

let results_element=document.getElementById("results") as HTMLDivElement;
results_element.style.backgroundColor="#ffeb9c";
results_element.style.color="#9c6500";


let password="";
let difficulty=0;
let difficulties=["Tutorial","Easy","Medium","Hard","Government","PassPhrase","Ludicrous"];

//Definition for each character type.
let character_groups:{ [key: string]: string }={
  "numbers":"1234567890",
  "lowercase_letters":"abcdefghijklmnopqrstuvwxyz",
  "uppercase_letters":"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "common_symbols":"@?!_$#",
  "rare_symbols":"~&*()_-+*={[}]|:;'<,>/"
}

//Different types of characters
type CharacterCount = {
  numbers?: number;
  lowercase_letters?: number;
  uppercase_letters?: number;
  common_symbols?: number;
  rare_symbols?: number;
};

//Array of dictionaries where each dictionary contains the types of characters for that difficulty level.
let difficulty_character_counts:CharacterCount[]=
[
  {"numbers":4},
  {"lowercase_letters":8},
  {"lowercase_letters":8,"uppercase_letters":2},
  {"lowercase_letters":6,"uppercase_letters":2,"numbers":2,"common_symbols":2},
  {"lowercase_letters":4,"uppercase_letters":4,"numbers":2,"common_symbols":3,"rare_symbols":3},
]

//Password lengths for each difficulty
let password_lengths=[4,8,10,12,16];

let correct_answers=0;
let wrong_answers=0;

let reset_button=document.getElementById("reset_button") as HTMLButtonElement;
let login_button=document.getElementById("attempt_login_button") as HTMLButtonElement;

let words:string[]=[];
setup();
generate_password();
