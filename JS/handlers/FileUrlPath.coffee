###
The PNG image export process writes an HTML file representing the image (with an embedded SVG for the visualization), and then directs Phantom to load the HTML with a file:/// scheme URL. This process needs to succeed on in unix like environments (our primary development environment) and Windows (our prod environment).

To write the file, we want to use OS native file paths, so we use the output of the node path API.

To load the file, on OSX, all of the filename fragments use forward slashes, so just using the path API is fine also.

To load the file, on Windows, we need to produce a url like 'file:///C:/path/to/file.html'. Mixing forward slashes and backslashes in the URL does not work. We need to use forward slashes because resources in the HTML file (font files and images) are referenced with relative URLs containing forward slashes (like src="IMG/CER_Logos/logo large.jpg"), and using a URL containing backslashes seems to break these relative URLs. So, we can't use the output of path.join on Windows. We also can't use path.posix.join to create a path with forward slashes, because it does not understand the Windows drive letter.
###

# Input is a string containing an absolute file path, e.g. as produced by path.join.
module.exports = (path) ->

  if process.platform == 'win32' # identifies both 32 and 64 bit windows
    path = path.replace /\\/g, '/'

  "file:///#{path}"
