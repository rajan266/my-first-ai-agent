
const { pipeline } = require("@huggingface/transformers");

function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  return dotProduct / (
    Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)
  );
}

async function main() {
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  const question = "How much money did the project receive?";

  const passages = [
    "The initial budget was $2,400.",
    "The garden is beside the public library.",
    "Volunteers planted vegetables in raised beds."
  ];

  console.log("Embedding question...");
  const questionOutput = await extractor(question, {
    pooling: "mean",
    normalize: true
  });
  const questionVector = questionOutput.data;

  const results = [];

  for (const passage of passages) {
    const output = await extractor(passage, {
      pooling: "mean",
      normalize: true
    });

    const score = cosineSimilarity(
      questionVector,
      output.data
    );

    results.push({ passage, score });
  }

  results.sort((a, b) => b.score - a.score);

  console.log("\nSemantic search results:");

  for (const result of results) {
    console.log(
      result.score.toFixed(4),
      "-",
      result.passage
    );
  }
}

main().catch(console.error);
