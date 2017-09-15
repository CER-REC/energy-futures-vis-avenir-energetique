Platform = require './Platform.coffee'

# Shim for array.includes, which isn't present in IE.
unless [].includes?
  includes = require 'array-includes'
  includes.shim()

# Similarly, find isn't available before Edge 12
unless [].find?
  find = require 'array.prototype.find'
  find.shim()

# element.remove, not present in IE <= 11
#if Platform.name == 'browser'
#  unless Element.prototype.remove?
#    Element.prototype.remove = ->
#      @parentNode.removeChild @ if @parentNode

