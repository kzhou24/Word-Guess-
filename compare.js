"use strict"
function compare(word,guess){

    function solve(s){
          
        const res = {};
        s.toUpperCase().split("").forEach(letter => {
            res[letter] = res[letter]+1||1;

        });
        
        return res;
    }
    const ans1 = solve(word);
    const ans2 = solve(guess);
    let count = 0;

    for(let t in ans1){

        const a = ans1[t]||0;
        const b = ans2[t]||0;
        count+=Math.min(a,b);
    }

    return count;
}

module.exports = compare;