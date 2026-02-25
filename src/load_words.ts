//Only return words that are between min_length and max_length letters long.
export async function get_words(min_length:number,max_length:number)
{
    //Make sure all words are loaded;
    if(!words||words.length==0)
    {
        await load_words();
    }
    let filtered_words:string[]=[...words];
    filtered_words=filtered_words.filter(word=>word.length>=min_length);
    filtered_words=filtered_words.filter(word=>word.length<=max_length);
    return filtered_words;
}

//Load words from common_english_words.txt
async function load_words()
{
    let response=await fetch('common_english_words.txt');
    let data=await response.text();
    words=data.split("\r\n")
}
let words:string[]=[];