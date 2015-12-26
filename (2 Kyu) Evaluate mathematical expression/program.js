"use strict";

var calc = function (expression) {
  var calculator = new Calculator();

  return calculator.solve(expression);
};

function Calculator() {
  this.operation = null;
  this.buffer = [];
  this.prefix = null;

  this.operations = {
    "+": function (a, b) { return a + b; },
    "-": function (a, b) { return a - b; },
    "*": function (a, b) { return a * b; },
    "/": function (a, b) { return a / b; },
    "%": function (a, b) { return a % b; }
  }
}

/**
 * Solves the given expression.
 * @param  {any} expression The expression to solve.
 * @returns {Number} The solved expression.
 */
Calculator.prototype.solve = function(expression) {
  var result = 0;

  // solve brackets first
  expression = this.solveBrackets(expression);

  // solve divisions next
  expression = this.solveMultiplicationsAndDivisions(expression);

  // finish when there's just one left
  var tokens = tokenize(expression);
  if (tokens.length === 1) {
    return parseFloat(tokens[0]);
  }

  result = this.processAllTokens(tokens);

  // when there's something left in the buffer we had an uneven amount
  // of operations
  result = this.handleUnevenOperations(result);

  return result;
}

Calculator.prototype.solveBrackets = function(expression) {
 var innerMostBracket = findFirstInnerMostBracket(expression);

  while (innerMostBracket !== null) {
    var bracketResult = this.solve(innerMostBracket);

    expression = expression.replace("(" + innerMostBracket + ")", bracketResult);

    innerMostBracket = findFirstInnerMostBracket(expression);
  }

  return expression;
}

Calculator.prototype.solveMultiplicationsAndDivisions = function(expression) {
  var division = this.getNextDivisionOperation(expression);

  while (division !== null && expression !== division) {
    var divisionResult = this.solve(division);

    expression = expression.replace(division, divisionResult);

    division = this.getNextDivisionOperation(expression);
  }

  return expression;
}

Calculator.prototype.processAllTokens = function(tokens) {
  var result = 0;

  for (var token of tokens) {
    this.processToken(token);
    result += this.evaluate();
  }

  return result;
}

Calculator.prototype.handleUnevenOperations = function(result) {
  if (this.buffer.length > 0) {
    // this is kind of hacky, when there's an operation left perform the operation on the buffer
    if (this.operation !== null) {
      this.buffer.unshift(result);
      return this.evaluate();
    } else {
      // if there's no operation left just add the buffer to the result
      result += this.buffer.shift();
    }
  }

  return result;
}

Calculator.prototype.getNextDivisionOperation = function(expression) {
  var regex = /(\d+(\.\d+)?)\s*[*\/%]{1}\s*(\d+(\.\d+)?)/;
  var matches = expression.match(regex);

  return matches != null ? matches[0] : null;
}

Calculator.prototype.evaluate = function () {
  // this.operations contains all possible operations
  // the current operation has been stored in this.operation
  // we shift two values from our buffer and perform the stored operation
  var result = 0;

  if (this.buffer.length > 1 && this.operation !== null) {
    result = this.operations[this.operation](this.buffer.shift(), this.buffer.shift());
    this.operation = null;
  }

  return result;
}

Calculator.prototype.processToken = function(token) {
  var isOperator = /[-+*\/\%]/.test(token);

  if (isOperator) {
    this.handleOperator(token);
  } else {
    this.addBuffer(token);
  }
}

Calculator.prototype.handleOperator = function (token) {
  // TODO: Rewrite this, I don't like it
  if (this.operation != null) {
    if (this.prefix != null) {
      if (this.prefix == "+" && token == "-" || this.prefix == "-" && token == "+") {
        this.prefix = "-";
        return;
      }

      if (this.prefix == "-" && token == "-") {
        this.prefix = "+";
        return;
      }
    }

    if (this.prefix == "-" && this.operation == "-") {
      this.operation = "+";
      this.prefix = null;
      return;
    }

    if (this.prefix == "+" && this.operation == "-" || this.prefix == "-" && this.operation == "+") {
      this.operation = "-";
      this.prefix = null;
      return;
    }

    this.prefix = token;
    return;
  }

  if (this.buffer.length == 0) {
    if (this.prefix == "+" && token == "-" || this.prefix == "-" && token == "+") {
      this.prefix = "-";
      return;
    }

    if (this.prefix == "-" && token == "-") {
      this.prefix = "+";
      return;
    }

    this.prefix = token;
    return;
  }

  this.operation = token;
  return;
}

Calculator.prototype.addBuffer = function(token) {
  if (this.prefix != null) {
    // add current prefix to number and clear prefix
    this.buffer.push(parseFloat(this.prefix + token));
    this.prefix = null;
    return;
  }

  this.buffer.push(parseFloat(token));
}

var tokenize = function (program) {
    if (program === "") {
      return [];
    }

    // replace all whitespaces with nothing
    program = program.replace(/\s*/g, "");

    // Tokenize the input by taking all possible characters and splitting by it
    var regex = /\s*([-+*\/\%\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)\s*/g;
    return program.split(regex).filter(function (s) { return !s.match(/^\s*$/); });
};
/**
 * @param  {any} expression Finds the first innermost bracket.
 * @returns {String} The expression in the innermost bracket.
 */
var findFirstInnerMostBracket = function(expression) {
  var regex = /(\((?:\(??[^\(]*?\)))/;
  var result = expression.match(regex);

  return result != null ? result[0].replace(/\(|\)/g, "") : null;
}