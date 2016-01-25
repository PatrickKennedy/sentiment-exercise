describe('socialytics', function() {
  describe('sentiment', function() {
    var analyzer;
    var expect = require('chai').expect

    before(function() {
      var dictionary = require('./dictionary.json');
      analyzer = require("./sentiment")(dictionary);
    });

    it('should have an Analyzer', function() {
      expect(analyzer).not.to.be.undefined;
    });

    describe('analyzer', function() {
      it('should return undefined for undocumented words', function(){
        expect(analyzer.process(['is'])).to.be.undefined;
        expect(analyzer.process(["isn't"])).to.be.undefined;
        expect(analyzer.process(['the'])).to.be.undefined;
        expect(analyzer.process(['math'])).to.be.undefined;
      })

      it('should return 0 for neutral words', function(){
        expect(analyzer.process(['yeah'])).to.equal(0);
      })

      it('should return 1 for positive words', function(){
        expect(analyzer.process(['encouragingly'])).to.equal(1);
        expect(analyzer.process(['dance'])).to.equal(1);
      })

      it('should return -1 for negative words', function(){
        expect(analyzer.process(['dismal'])).to.equal(-1);
        expect(analyzer.process(['unfortunately'])).to.equal(-1);
        expect(analyzer.process(['futile'])).to.equal(-1);
      })

      it('should return net negative for sentences with more negative than positive words', function(){
        expect(analyzer.process(['unfortunately', 'dance', 'futile'])).to.equal(-1);
        expect(analyzer.process(['unfortunately', 'the', 'math', 'dance', 'is', 'futile'])).to.equal(-1);
      })

      it('should return net negative for sentences with more negative than positive words', function(){
        expect(analyzer.process(['encouragingly', 'dance', 'futile'])).to.equal(1);
        expect(analyzer.process(['encouragingly', 'the', 'math', 'dance', "isn't", 'futile'])).to.equal(1);
      })
    });
  });
});
