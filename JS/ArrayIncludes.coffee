
# Shim for array.includes, which isn't present in IE.
unless [].includes?
  includes = require 'array-includes'
  includes.shim()


