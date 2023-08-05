const { log } = require('console');
const { Worker } = require('worker_threads');
const jobs = Array.from({ length: 100 }, () => 1e9);

const tick = performance.now();
let completedWorkers = 0;

function chunkify(arr, n) {
    let chunk = []
    for (let i = n; i > 0; i--) {
        chunk.push(arr.splice(0, Math.ceil(arr.length / i)));
    }
    return chunk;
}

function run(jobs, concurrentWorkers) {
    const chunks = chunkify(jobs, concurrentWorkers);

    chunks.forEach((data, i) => {
        const worker = new Worker("./worker.js");
        worker.postMessage(data);
        worker.on("message", () => {
            console.log(`Worker ${i} completed.`);

            completedWorkers++;

            if (completedWorkers === concurrentWorkers) {
                const tock = performance.now();
                console.log(`Time elapsed: ${(tock - tick)} ms.`);
                process.exit();
            }
        });
    });
}

run(jobs, 20);