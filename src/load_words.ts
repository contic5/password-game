
export async function get_words(min_length:number,max_length:number)
{
    if(!words||words.length==0)
    {
        await load_words();
    }
    let filtered_words:string[]=[...words];
    filtered_words=filtered_words.filter(word=>word.length>=min_length);
    filtered_words=filtered_words.filter(word=>word.length<=max_length);
    return filtered_words;
}

async function load_words()
{
    let response=await fetch('common_english_words.txt');
    let data=await response.text();
    words=data.split("\r\n")
}
let words:string[]=[];