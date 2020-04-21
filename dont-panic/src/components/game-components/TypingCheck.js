import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import KeyPress from "./KeyPress";
import { currentTime } from "../../game-utility/time";
import { generate } from "../../game-utility/words";
import FailureDisplay from "./FailureDisplay";
const initialWords = generate();

export default function TypingCheck({
  handleWPM,
  handleLevel,
  handleWordCount,
  wordCount,
  level,
  playerScore,
  handlePlayerScore,
  randomWord
}) {
  const [indexLetter, setIndexLetter] = useState(1);
  const [word, setWord] = useState("");
  const [letter, setLetter] = useState('');
  const [startTime, setStartTime] = useState();
  const [keyInput, setKeyInput] = useState();
  const [failures, setFailures] = useState(-1);
  console.log('hey look here', randomWord.word)
  const handleTypedChar = (input) => {
    setKeyInput(input);
  };
  // if(randomWord){
  setWord(randomWord.word)
  setLetter(word.charAt(0))
  // console.log('peanuts',word.word)
  // }
  console.log('peanuts',word)
  useEffect(() => {
    if (!startTime) {
      setStartTime(currentTime());
    }
    
    if (keyInput === letter) {
      setLetter(word[0].word.charAt(indexLetter));
      let newIndex = indexLetter + 1;
      setIndexLetter(newIndex);
    } else if (keyInput !== letter) {
      setFailures(failures + 1);
      console.log("failure", failures);
    }
    if (word.charAt(indexLetter) === "" && keyInput === letter) {
      handleWordCount(wordCount + 1);
      let newWord = randomWord.word;
      setWord(newWord);
      setIndexLetter(1);
      setLetter(newWord.charAt(0));
    }
    if (wordCount === 10*(level)) {
      const durationInMinutes = (currentTime() - startTime) / 60000.0;
      let wpm = ((wordCount + 1) / durationInMinutes).toFixed(2);
      handleWPM(wpm);
      handleLevel(level + 1);
      handleWordCount(0);
    }
    if(failures>5){
      handlePlayerScore();
    }
    setKeyInput(keyInput);
  }, [keyInput]);

  return (
      <div className="typing-check">
        <div className="failure-display">
          <FailureDisplay failures={failures} />
          {failures === 6 && <Redirect push to="/userInput" playerScore={playerScore}/>}
        </div>
        <p className="letters">
          <span className="current-letter glitch-game" data-text={letter}>
            {letter}
          </span>
          <span className="current-word">{word.substr(indexLetter)}</span>
        </p>
        <KeyPress handleTypedChar={handleTypedChar} keyInput={keyInput} />
      </div>
  );
}
