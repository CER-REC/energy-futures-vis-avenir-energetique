# Shim for array.includes, which isn't present in IE.
unless [].includes?
  includes = require 'array-includes'
  includes.shim()

# Similarly, find isn't available before Edge 12
unless [].find?
  find = require 'array.prototype.find'
  find.shim()

# element.remove, not present in IE <= 11
unless Element.prototype.remove?
  Element.prototype.remove = ->
    @parentNode.removeChild @ if @parentNode

