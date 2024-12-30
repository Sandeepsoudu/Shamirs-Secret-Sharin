const fs = require('fs');

// Function to decode the y-value based on its base
function decodeY(value, base) {
    return parseInt(value, base);
}

// Function to compute Lagrange Interpolation
function lagrangeInterpolation(points, k) {
    let constantTerm = 0;

    for (let i = 0; i < k; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let term = yi;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j][0];
                term *= xj / (xj - xi);
            }
        }

        constantTerm += term;
    }

    return Math.round(constantTerm); // Round to avoid floating-point errors
}

// Main function to solve the problem
function findConstantTerm(filePath) {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (let testCaseIndex = 0; testCaseIndex < data.length; testCaseIndex++) {
        console.log(`Processing Test Case ${testCaseIndex + 1}:`);

        const keys = data[testCaseIndex].keys;
        const n = keys.n;
        const k = keys.k;

        if (n < k) {
            console.log("Invalid input: n must be >= k.");
            return;
        }

        const roots = data[testCaseIndex].roots; // Corrected to access the roots section
        const points = [];

        // Decode roots into (x, y) points
        for (const [x, root] of Object.entries(roots)) {
            const decodedY = decodeY(root.value, root.base);
            points.push([parseInt(x), decodedY]);
        }

        if (points.length < k) {
            console.log("Not enough points to calculate the polynomial.");
            return;
        }

        // Solve for the constant term (c) using Lagrange interpolation
        const constantTerm = lagrangeInterpolation(points, k);
        console.log(`Constant term (c): ${constantTerm}`);
    }
}

// Run the program with the JSON file as input
findConstantTerm('testcase.json');
