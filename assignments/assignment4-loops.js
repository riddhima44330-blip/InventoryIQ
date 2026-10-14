
console.log("Assignment 4: Loop Control Structures\n");

// For loop: multiplication table of 5
console.log("-- Multiplication Table of 5 --");

for (let i = 1; i <= 5; i++) {
    console.log(`5 x ${i} = ${5 * i}`);
}

// While loop: find the first number greater than 10
// that is divisible by 6
console.log("\n-- First number > 10 divisible by 6 --");

let number = 11;

while (number > 10) {
    if (number % 6 === 0) {
        console.log(`Found: ${number}`);
        break;
    }

    number++;
}

// Do...while loop: skip numbers using continue
console.log("\n-- do...while with continue --");

let count = 0;

do {
    count++;

    if (count === 2 || count === 4) {
        continue;
    }

    console.log(`Number: ${count}`);
} while (count < 5);
