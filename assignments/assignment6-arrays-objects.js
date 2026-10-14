
console.log("Assignment 6: Arrays, Objects, and Core Methods\n");

const products = [
    { name: "Laptop", price: 800 },
    { name: "Mouse", price: 25 },
    { name: "Keyboard", price: 45 }
];

// forEach(): display all products
console.log("-- All Products (forEach) --");

products.forEach(product => {
    console.log(`Item: ${product.name} - Price: $${product.price}`);
});

// filter(): find products under $50
console.log("\n-- Filtered Products (Price < $50) --");

const affordableProducts = products.filter(product => product.price < 50);
console.log(affordableProducts);

// map(): create formatted product tags
console.log("\n-- Mapped Product Tags (map) --");

const productTags = products.map(
    product => `${product.name.toUpperCase()} costs $${product.price}`
);

console.log(productTags);
