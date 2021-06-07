form = document.querySelector(".convert");
feedback = form.querySelector(".feedback");
result = document.querySelector(".result");

let DIGITS, TEENS, TENS, THOUSANDS;

fetch("numbers.json")
  .then(response => response.json())
  .then(data => {
    DIGITS = data["numbers"]["digits"];
    TEENS = data["numbers"]["teens"];
    TENS = data["numbers"]["tens"];
    THOUSANDS = data["numbers"]["thousands"];
  });

const validateNumber = number => {
  const numberPattern = /^-?\d{1,9}$/;

  if (numberPattern.test(number)) {
    return true;
  }
};

const splitNumber = (number, divider) => {
  const splitedNumberArray = [];

  let splitIterations = Math.ceil(parseFloat(number.length / divider));

  for (let i = 1; i <= splitIterations; i++) {
    splitedNumberArray.unshift(number % 10 ** divider);
    number = parseInt(number / 10 ** divider);
  }

  return splitedNumberArray;
};

const getNumberInWords = number => {
  let numberInWords = null;
  switch (number.toString().length) {
    case 1:
      numberInWords = DIGITS[number];
      break;
    case 2:
      if (Object.keys(TENS).includes(number.toString())) {
        numberInWords = TENS[number];
      } else if (number < 20) {
        numberInWords = TEENS[number.toString()];
      } else {
        let twoDigitSplitedNumber = splitNumber(number.toString(), 1);
        numberInWords = [
          TENS[twoDigitSplitedNumber[0] * 10],
          DIGITS[twoDigitSplitedNumber[1]]
        ].join(" ");
      }
      break;
    case 3:
      let threeDigitSplitedNumber = splitNumber(number.toString(), 2);
      if (threeDigitSplitedNumber[1] == 0) {
        numberInWords = [DIGITS[threeDigitSplitedNumber[0]], "hundred"].join(" ");
      } else {
        numberInWords = [
          DIGITS[threeDigitSplitedNumber[0]],
          "hundred",
          getNumberInWords(threeDigitSplitedNumber[1])
        ].join(" ");
      }

      break;
  }
  return numberInWords;
};

const convertNumToWords = number => {
  const chunkOfThousands = splitNumber(number, 3);

  return chunkOfThousands
    .map((num, index) => {
      if (index == 0) {
        return getNumberInWords(num);
      } else {
        return [THOUSANDS[index], getNumberInWords(num)].join(" ");
      }
    })
    .join(" ");
};

form.addEventListener("submit", e => {
  e.preventDefault();
  const number = form.number.value.trim();

  if (validateNumber(number)) {
    result.innerHTML = convertNumToWords(number);
    result.classList.remove("d-none");
    result.classList.remove("text-danger");
    result.classList.add("text-primary");
  } else {
    result.innerHTML = "Please enter a number less than a billion";
    result.classList.remove("d-none");
    result.classList.remove("text-primary");
    result.classList.add("text-danger");
  }
});
