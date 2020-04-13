const Stream = require("stream");
const Path = require("path");

function extractVersion(contents) {
  // The first result is the entire match, the second is only the version string
  const versionRegEx = new RegExp("@" + key + " ([^ ]*)", "i");
  return contents.match(versionRegEx)[1].trim();
}

module.exports = function (options) {
  const stream = new Stream.Transform({ objectMode: true });

  options = options || {};

  stream._transform = function (file, filetype, callback) {
    let contents = file.contents.toString();

    // Load up option parameters
    let key = options.key || "version";

    // indexOf is faster than running regex. As we are dealing with files
    // of an unknown size, check if the key exists first
    if (contents.indexOf("@" + key) < 0) {
      // If user wants to ignore files without the key, don't make a fuss
      if (options.silent) return callback(null, file);
      // Otherwise, raise hell
      return stream.emit(
        "error",
        new Error("Missing version key @" + key + " in " + file.relative)
      );
    }

    const version = extractVersion(contents);

    // Break up the file name to splice in our version
    const components = file.relative.split(".");

    // File extension should be the final component, add the version to the
    // segment before it
    components[components.length - 2] += "-" + version;
    file.path = Path.join(file.base, components.join(".")).replace("\n", "");

    // Rename sourcemap if present
    if (file.sourceMap) {
      file.sourceMap.file = file.relative;
    }

    callback(null, file);
  };

  return stream;
};
