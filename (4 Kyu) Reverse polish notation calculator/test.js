// Test.assertEquals(calc(""), 0, "Should work with empty string");
// Test.assertEquals(calc("1 2 3"), 3, "Should parse numbers");
// Test.assertEquals(calc("1 2 3.5"), 3.5, "Should parse float numbers");
// Test.assertEquals(calc("1 3 +"), 4, "Should support addition");
// Test.assertEquals(calc("1 3 *"), 3, "Should support multiplication");
// Test.assertEquals(calc("1 3 -"), -2, "Should support subtraction");
// Test.assertEquals(calc("4 2 /"), 2, "Should support division");
// Test.assertEquals(calc("10000 123 +"), 10123, "Should work with numbers longer than 1 digit");
// Test.assertEquals(calc("5 1 2 + 4 * + 3 -"), 14, "Should work with complex expressions");

describe("Parsing", function () {
  it("should work with empty strings", function () {
    expect(calc("")).toBe(0);
  });

  it("should parse numbers", function () {
    expect(calc("1 2 3")).toBe(3);
  });

  it("should parse numbers", function () {
    expect(calc("1 2 3")).toBe(3);
  });
});