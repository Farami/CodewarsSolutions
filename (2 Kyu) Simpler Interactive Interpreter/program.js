function Interpreter() {
  this.vars = {};
  this.functions = {};
  this.buffer = [];
  this.operation = null;
  this.prefix = null;
  this.assignmentVariable = null;
  this.operations = {
    "+": function (a, b) { return a + b; },
    "-": function (a, b) { return a - b; },
    "*": function (a, b) { return a * b; },
    "/": function (a, b) { return a / b; },
    "%": function (a, b) { return a % b; }
  }
}

Interpreter.prototype.input = function (expr) {
  for (var i in this.vars) {
    var regex = new RegExp(i, "g");
    expr = expr.replace(regex, this.vars[i]);
  }

  if (/^[a-zA-Z]+((?!(=)).)*$/.test(expr)) {
    throw "Unknown variable";
  }

  return this.solve(expr);
};

Interpreter.prototype.solve = function (expression) {
  if (expression === "") {
    return expression;
  }

  var result = 0;

  expression = this.handleAssignment(expression);

  // solve brackets first
  expression = this.solveBrackets(expression);

  // solve divisions next
  expression = this.solveMultiplicationsAndDivisions(expression);

  // finish when there's just one left
  var tokens = this.tokenize(expression);
  if (tokens.length === 1) {
    if (this.assignmentVariable != null) {
      this.vars[this.assignmentVariable] = parseFloat(tokens[0]);
      this.assignmentVariable = null;
    }

    return parseFloat(tokens[0]);
  }

  result = this.processAllTokens(tokens);

  // when there's something left in the buffer we had an uneven amount
  // of operations
  result = this.handleUnevenOperations(result);

  this.assignVariable(result);

  return result;
}

Interpreter.prototype.assignVariable = function (value) {
    if (this.assignmentVariable != null) {
    this.vars[this.assignmentVariable] = value;
    this.assignmentVariable = null;
  }
}

Interpreter.prototype.handleAssignment = function (expression) {
  if (expression.indexOf("=") != -1) {
    this.assignmentVariable = expression.split("=")[0].replace(/\s*/g, "");

    return expression.split("=")[1];
  }

  return expression;
}

Interpreter.prototype.solveBrackets = function (expression) {
  var innerMostBracket = findFirstInnerMostBracket(expression);

  while (innerMostBracket !== null) {
    var bracketResult = this.solve(innerMostBracket);

    expression = expression.replace("(" + innerMostBracket + ")", bracketResult);

    innerMostBracket = findFirstInnerMostBracket(expression);
  }

  return expression;
}

Interpreter.prototype.solveMultiplicationsAndDivisions = function (expression) {
  var division = this.getNextDivisionOperation(expression);

  while (division !== null && expression !== division) {
    var divisionResult = this.solve(division);

    expression = expression.replace(division, divisionResult);

    division = this.getNextDivisionOperation(expression);
  }

  return expression;
}

Interpreter.prototype.processAllTokens = function (tokens) {
  var result = 0;

  for (var token of tokens) {
    this.processToken(token);

    if (this.buffer.length > 1 && this.operation !== null) {
      result += this.evaluate();
    }
  }

  if (this.assignment) {
    this.vars[this.assignmentVariable] = result;
    this.assignment = false;
    this.assignmentVariable = null;
  }

  return result;
}

Interpreter.prototype.handleUnevenOperations = function (result) {
  if (this.buffer.length > 0) {
    if (this.operation !== null) {
      this.buffer.unshift(result);
      return this.evaluate();
    } else {
      result += this.buffer.shift();
    }
  }

  return result;
}

Interpreter.prototype.getNextDivisionOperation = function (expression) {
  var regex = /(\d+(\.\d+)?)\s*[*\/%]{1}\s*(\d+(\.\d+)?)/;
  var matches = expression.match(regex);

  return matches != null ? matches[0] : null;
}

Interpreter.prototype.evaluate = function () {
  var result = 0;

  if (this.buffer.length > 1 && this.operation !== null) {
    result = this.operations[this.operation](this.buffer.shift(), this.buffer.shift());
    this.operation = null;
  }

  return result;
}

Interpreter.prototype.processToken = function (token) {
  var isOperator = /[-+*\/\%]/.test(token);

  if (isOperator) {
    this.handleOperator(token);
    return;
  }

  this.addBuffer(token);
}

Interpreter.prototype.handleOperator = function (token) {
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

Interpreter.prototype.addBuffer = function (token) {
  if (this.prefix != null) {
    this.buffer.push(parseFloat(this.prefix + token));
    this.prefix = null;
    return;
  }

  this.buffer.push(parseFloat(token));
}

Interpreter.prototype.tokenize = function (program) {
  if (program === "")
    return [];

  program = program.replace(/\s*/g, "");

  var regex = /\s*([-+*\/\%=\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)\s*/g;
  return program.split(regex).filter(function (s) { return !s.match(/^\s*$/); });
};

var findFirstInnerMostBracket = function (expression) {
  var regex = /(\((?:\(??[^\(]*?\)))/;
  var result = expression.match(regex);

  return result != null ? result[0].replace(/\(|\)/g, "") : null;
}