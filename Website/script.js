var success;
async function listener() {
  const type = document.getElementById("type");
  const tense = document.getElementById("tense");
  const toxicity = document.getElementById("toxic");
  const sentiment = document.getElementById("sentiment");
  const sentence = document.getElementById("inputsentence").value;
  const prompt = document.getElementsByClassName("tx")[0];
  if (sentence === undefined) {
    prompt.innerHTML = "Please Provide Sentence";
    return;
  }
  if (sentence.split(" ").length <= 1) {
    prompt.innerHTML = "Please Provide Sentence";
    return;
  }
  // const sentence = input.value
  (async () => {
    const rawResponse = await fetch(
      "monke (not gonna reveal lol)",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sentence: sentence })
      }
    );
    const content = await rawResponse.json();

    console.log(content);
    type.innerHTML = "Sentence Type: " + content.type;
    tense.innerHTML = "Tense: " + content.tense;
    toxicity.innerHTML = "Toxicity: " + content.toxicity;
    sentiment.innerHTML = "Sentiment: " + content.sentiment;
  })();
  await calculate(sentence, prompt);
  }

async function calculate(sentence, prompt) {
  const letters = document.getElementById("letters");
  const caps = document.getElementById("caps");
  const words = document.getElementById("words");
  const punctuations = document.getElementById("punctuations");
  console.log(sentence);
  letters.innerHTML = `Letters: ${sentence.length}`;
  caps.innerHTML = `Capital Letters: ${
    (sentence.match(/[A-Z]/g) || []).length
  }`;
  words.innerHTML = `Words: ${sentence.split(" ").length}`;
  if (sentence.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g) === null) {
    punctuations.innerHTML = "Punctuations: 0";
    return;
  }
  punctuations.innerHTML = `Punctuations: ${
    sentence.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g).length
  }`;
}
