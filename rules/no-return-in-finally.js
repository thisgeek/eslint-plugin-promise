var isPromise = require('./lib/is-promise')

function couldBePromise (node) {
  return node.type !== 'CallExpression' && node.type !== 'Identifier'
}

module.exports = {
  create: function (context) {
    return {
      CallExpression: function (node) {
        if (isPromise(node)) {
          if (node.callee && node.callee.property && node.callee.property.name === 'finally') {
            if (node.arguments && node.arguments[0] && node.arguments[0].body) {
              if (node.arguments[0].body.body && node.arguments[0].body.body.some((statement) => statement.type === 'ReturnStatement' && couldBePromise(statement.argument))) {
                context.report(node.callee.property, 'No return in finally')
              }
              if (node.arguments[0].type === 'ArrowFunctionExpression' && node.arguments[0].body.type !== 'BlockStatement' && couldBePromise(node.arguments[0].body)) {
                context.report(node.callee.property, 'No return in finally')
              }
            }
          }
        }
      }
    }
  }
}
