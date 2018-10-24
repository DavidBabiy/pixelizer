function loopExample() {
    let results = [];
    let x = 2;
    let y;
    for (x = 2; x < 10; x += 2) {
        y = 3 * x * x;
        results.push(y)
    }
    return results
}

function ifExample() {
    let results = [];
    let x = 2;
    let y;
    if (x == 2) {
        y = 3 * x * x;
        x += 2;
        results.push(y);
    }
    if (x == 4) {
        y = 3 * x * x;
        x += 2;
        results.push(y);
    }
    if (x == 6) {
        y = 3 * x * x;
        x += 2;
        results.push(y);
    }
    if (x == 8) {
        y = 3 * x * x;
        results.push(y);
    }
    return results;
}

function singleIfExample() {
    let results = [];
    let x = 2;
    let y;
    if (x < 10) {
        y = 3 * x * x;
        results.push(y)
    }
    return results;
}

function singleIfRecursiveExample(x, arr) {
    let y;
    if (x < 10) {
        y = 3 * x * x;
        arr.push(y);
        x += 2;
        singleIfRecursiveExample(x, arr);
    }
    return arr
}

let correctResult = loopExample();

if (JSON.stringify(correctResult) === JSON.stringify(ifExample())) {
    console.log("ifExample function test passed")
} else {
    console.error("ifExample function test failed");
    console.error("correctResult => " + correctResult + " | function returned => " + ifExample())
}

if (JSON.stringify(correctResult) === JSON.stringify(singleIfExample())) {
    console.log("singleIfExample function test passed")
} else {
    console.error("singleIfExample function test failed");
    console.error("correctResult => " + correctResult + " | function returned => " + singleIfExample())
}

if (JSON.stringify(correctResult) === JSON.stringify(singleIfRecursiveExample(2, []))) {
    console.log("singleIfRecursiveExample function test passed")
} else {
    console.error("singleIfRecursiveExample function test failed");
    console.error("correctResult => " + correctResult + " | function returned => " + singleIfRecursiveExample(2, []))
}
