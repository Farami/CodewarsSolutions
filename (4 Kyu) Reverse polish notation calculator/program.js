function calc(expr) {
  var interpreter = new Interpreter(expr);
  return interpreter.calculate();
}

function Interpreter(expr) {
  this.stack = [];
  this.expression = expr;
  this.tokens = this.tokenize(expr);

  this.operations = {
    "+": function(a, b) { return b + a; },
    "-": function(a, b) { return b - a; },
    "*": function(a, b) { return b * a; },
    "/": function(a, b) { return b / a; },
  }
}

Interpreter.prototype.calculate = function() {
  for (var token of this.tokens) {
    if (this.handleOperation(token)) {
      continue;
    }

    this.stack.push(parseFloat(token));
  }

  return this.stack.pop() || 0;
}

Interpreter.prototype.handleOperation = function(token) {
  if (/[+\-\/*]/.test(token)) {
    var result = this.operations[token](this.stack.pop(), this.stack.pop());
    this.stack.push(result);

    return true;
  }

  return false;
}

Interpreter.prototype.tokenize = function (program) {
    if (program === "") {
      return [];
    }

    var regex = /\s*([-+*\/\%\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)\s*/g;
    return program.split(regex).filter(function (s) { return !s.match(/^\s*$/); });
};