
- A "game" means one specific secret word is chosen and the user takes multiple turns making guesses
  - A "new game" means a new secret word is selected, the number of guesses made is reset to 0, and the list of possible words is reset to the full list
    - Statistics about previous games may be preserved
- "valid guess" means a guess that is one of the possible words that has not already been guessed this game
  - guess are not case-sensitive, so "these" is a valid guess if one of the possible words is "THESE"
- "invalid guess" means a guess that is not one of remaining possible words
  - This includes words that would never be valid (are not on the full list of possible words) and words that are on the list of possible words that have been previously guessed this game.
- "incorrect guess" means a valid guess that is not the secret word
- "correct guess" means a valid guess that IS the secret word (case-insensitive)
  - A guess that shares all of the letters of the secret word but is NOT the secret word (such as EAT vs TEA), is NOT a correct guess and does not win the game

