//Only return words that are between min_length and max_length letters long.
export async function get_words(min_length:number,max_length:number)
{
    //Make sure all words are loaded;
    if(!words||words.length==0)
    {
        await setup();
    }
    let filtered_words:string[]=[...words];
    filtered_words=filtered_words.filter(word=>word.length>=min_length);
    filtered_words=filtered_words.filter(word=>word.length<=max_length);
    return filtered_words;
}
export async function get_extremely_long_words()
{
    if(!words||words.length==0)
    {
        await setup();
    }
    return extremely_long_words;
}

//Load words from common_english_words.txt
async function setup()
{
    let response=await fetch('common_english_words.txt');
    let data=await response.text();
    words=data.split(/\s+/);


    let response_2=await fetch('extremely_long_words.txt');
    let data_2=await response_2.text();
    extremely_long_words=data_2.split(/\s+/);
}
let extremely_long_words:string[]=[];
let words:string[]=[];