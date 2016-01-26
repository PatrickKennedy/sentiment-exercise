var FixedClient = function(config) {
  var self = this;
  self.config = config;
};

FixedClient.prototype.get_content = function(options, cb) {
  cb(null, [
    "You make it feel like home",
    "I love good a fireside conversation",
    "This chicken potpie is a disgrace",
    "I just witnessed the most amazing sight",
    "Please, allow me to take your coat",
    "Ain't this just the saddest thing you've laid eyes on?"
  ]);
};

module.exports = FixedClient;
