var isPromise = require('./lib/is-promise')

module.exports = {
  create: function (context) {
    return {
      CallExpression: function (node) {
        if (isPromise(node)) {
          if (node.callee && node.callee.property && node.callee.property.name === 'finally') {
            if (node.arguments && node.arguments[0] && node.arguments[0].body) {
              if (node.arguments[0].body.body && node.arguments[0].body.body.some((statement) => statement.type === 'ReturnStatement')) {
                context.report(node.callee.property, 'No return in finally');
              }
              if (node.arguments[0].type === 'ArrowFunctionExpression' && node.arguments[0].body.type !== 'BlockStatement') {
                context.report(node.callee.property, 'No return in finally');
              }
            }
          }
        }
      }
    }
  }
}
