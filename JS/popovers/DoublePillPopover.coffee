_ = require 'lodash'

# The popover manager is designed to show just one popover at a time.
# So, this 'double pill popover' stands in for the two open pill popovers in comparison
# view.
class DoublePillPopover


  # Options:
  #   leftPopover, a popover
  #   rightPopover, a popover
  #   closeCallback, a function
  #   source, a string
  constructor: (options) ->
    @options = _.extend {}, options

  show: (showOptions) ->
    @options.leftPopover.show showOptions.left
    @options.rightPopover.show showOptions.right

  close: ->
    @options.leftPopover.close()
    @options.rightPopover.close()
    if @options.closeCallback?
      @options.closeCallback()



  focus: ->
    # TODO: Inadequate from an accessibility point of view!
    @options.leftPopover.focus()

  container: ->
    # TODO: Inadequate from an accessibility point of view!
    @options.leftPopover.container()




















module.exports = DoublePillPopover
