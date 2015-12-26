describe("Basic Expression Evaluation", function () {
  var interpreter = new Interpreter();

  it("Should handle empty input", function () {
    expect(interpreter.input("")).toBe("", "input: ''");
  });

  it("Should handle addition", function () {
    expect(interpreter.input("1 + 1")).toBe(2, "input: '1 + 1'");
    expect(interpreter.input("2+2")).toBe(4, "input: '2+2'");
  });

  it("Should handle subtraction", function () {
    expect(interpreter.input("2 - 1")).toBe(1, "input: '2 - 1'");
    expect(interpreter.input("4-6")).toBe(-2, "input: '4-6'");
  });

  it("Should handle multiplication", function () {
    expect(interpreter.input("2 * 3")).toBe(6, "input: '2 * 3'");
  });

  it("Should handle division", function () {
    expect(interpreter.input("8 / 4")).toBe(2, "input: '8 / 4'");
  });

  it("Should handle modulo", function () {
    expect(interpreter.input("7 % 4")).toBe(3, "input: '7 % 4'");
  });
});

describe("Complex Expression Evaluation", function () {
  var interpreter = new Interpreter();

  it("Should handle multiple operations", function () {
    expect(interpreter.input("4 + 2 * 3")).toBe(10, "input: '4 + 2 * 3'");
    expect(interpreter.input("4 / 2 * 3")).toBe(6, "input: '4 / 2 * 3'");
    expect(interpreter.input("7 % 2 * 8")).toBe(8, "input: '7 % 2 * 8'");
  });

  it("Should handle parentheses", function () {
    expect(interpreter.input("(4 + 2) * 3")).toBe(18, "input: '(4 + 2) * 3'");
    expect(interpreter.input("(7 + 3) / (2 * 2 + 1)")).toBe(2, "input: '(7 + 3) / (2 * 2 + 1)'");
  });

  it("Should handle nested parentheses", function () {
    expect(interpreter.input("(8 - (4 + 2)) * 3")).toBe(6, "input: '(8 - (4 + 2)) * 3'");
    expect(interpreter.input("(10 / (8 - (4 + 2))) * 3")).toBe(15, "input: '(10 / (8 - (4 + 2))) * 3'");
  });
});

describe("Variables", function () {
  var interpreter = new Interpreter();

  it("Should assign a constant to a variable", function () {
    expect(interpreter.input("x = 7")).toBe(7, "input: 'x = 7'");
  });

  it("Should read the value of a variable", function () {
    expect(interpreter.input("x")).toBe(7, "input: 'x'");
  });

  it("Should handle variables in expressions", function () {
    expect(interpreter.input("x + 3")).toBe(10, "input: 'x + 3'");
  });

  it("Should throw an error when variables don't exist", function () {
    expect(function () { interpreter.input("y"); }).toThrow();
  });

  it("Should continue to function if an error is thrown", function () {
    expect(interpreter.input("y = x + 5")).toBe(12, "input: 'y = x + 5'");
    expect(interpreter.input("y")).toBe(12, "input: 'y'");
  });
});