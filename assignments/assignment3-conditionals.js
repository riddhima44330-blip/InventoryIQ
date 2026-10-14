
console.log("Assignment 3: Conditional Logic Implementation\n");

const score = 85;
let grade;

// Determine grade using if...else
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else if (score >= 60) {
    grade = "D";
} else {
    grade = "F";
}

// Determine grade description using switch
switch (grade) {
    case "A":
        console.log("Excellent performance!");
        break;
    case "B":
        console.log("Good performance!");
        break;
    case "C":
        console.log("Average performance.");
        break;
    case "D":
        console.log("Needs improvement.");
        break;
    default:
        console.log("Failed the test.");
}

const status = score >= 40 ? "Passed" : "Failed";

console.log(`Score: ${score}`);
console.log(`Grade: ${grade}`);
console.log(`Status: ${status}`);
