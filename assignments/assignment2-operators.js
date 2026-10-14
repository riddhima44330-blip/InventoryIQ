
console.log("Assignment 2: Operators, Expressions, and Input Handling");

const billInput = prompt("Enter bill amount:", "100");
const tipInput = prompt("Enter tip percentage:", "15");

if (
    billInput === null ||
    tipInput === null ||
    billInput.trim() === "" ||
    tipInput.trim() === ""
) {
    console.log("Error: Both values are required.");
} else {
    const billAmount = Number(billInput);
    const tipPercentage = Number(tipInput);

    if (
        !Number.isFinite(billAmount) ||
        !Number.isFinite(tipPercentage) ||
        billAmount < 0 ||
        tipPercentage < 0
    ) {
        console.log("Error: Enter valid non-negative numbers.");
    } else {
        const calculatedTip = billAmount * tipPercentage / 100;
        let totalAmount = billAmount;
        totalAmount += calculatedTip;

        console.log(`Subtotal: $${billAmount}`);
        console.log(`Tip Percentage: ${tipPercentage}%`);
        console.log(`Calculated Tip: $${calculatedTip}`);
        console.log(`Total Amount to Pay: $${totalAmount}`);
    }
}
