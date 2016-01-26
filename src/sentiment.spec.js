describe('socialytics', function() {
  describe('sentiment', function() {
    var analyzer;
    var expect = require('chai').expect;

    before(function() {
      var dictionary = require('../dictionary.json');
      analyzer = require("./sentiment")(dictionary);
    });

    it('should have an Analyzer', function() {
      expect(analyzer).to.exist;
    });

    describe('analyzer', function() {
      describe('.format', function() {
        it('should return an array of words split by space', function(){
          expect(analyzer.format('bacon and eggs'))
            .to.have.members(['bacon', 'and', 'eggs']);
        });

        it('should return an array of words split by the passed delimiter', function(){
          expect(analyzer.format('bacon, and, eggs', {delimiter: ', '}))
            .to.have.members(['bacon', 'and', 'eggs']);
        });
      });

      describe('.clean', function() {
        var split_text = [];
        beforeEach(function(){
          split_text = analyzer.format("Bacon is #great ain't it?");
        });

        it('should return the array lowered and cleaned of non-word characters', function(){
          expect(analyzer.clean(split_text))
            .to.have.members(['bacon', 'is', 'great', 'aint', 'it']);
        });

        it('should return the array lowered and cleaned of custom characters', function(){
          expect(analyzer.clean(split_text, {regex: /[in]+/}))
            .to.have.members(['baco', 's', '#great', "a't", 't?']);
        });
      });

      describe('.process', function() {
        it('should return undefined for undocumented words', function(){
          expect(analyzer.process(['is']).score).to.be.undefined;
          expect(analyzer.process(["isn't"]).score).to.be.undefined;
          expect(analyzer.process(['the']).score).to.be.undefined;
          expect(analyzer.process(['math']).score).to.be.undefined;
        });

        it('should return 0 for neutral words', function(){
          expect(analyzer.process(['yeah']).score).to.equal(0);
        });

        it('should return 1 for positive words', function(){
          expect(analyzer.process(['dance']).score).to.equal(1);
          expect(analyzer.process(['dance']).hits['dance']).to.equal(1);
          expect(analyzer.process(['encouragingly']).score).to.equal(1);
        });

        it('should return -1 for negative words', function(){
          expect(analyzer.process(['dismal']).score).to.equal(-1);
          expect(analyzer.process(['dismal']).hits['dismal']).to.equal(-1);
          expect(analyzer.process(['unfortunately']).score).to.equal(-1);
          expect(analyzer.process(['futile']).score).to.equal(-1);
        });

        it('should return net negative for sentences with more negative than positive words', function(){
          expect(analyzer.process(['unfortunately', 'dance', 'futile']).score).to.equal(-1);
          expect(analyzer.process(['unfortunately', 'the', 'math', 'dance', 'is', 'futile']).score).to.equal(-1);
          expect(analyzer.process(['unfortunately', 'the', 'math', 'dance', 'is', 'futile']).hits)
            .to.include.keys(['unfortunately', 'dance', 'futile']);
        });

        it('should return net negative for sentences with more negative than positive words', function(){
          expect(analyzer.process(['encouragingly', 'dance', 'futile']).score).to.equal(1);
          expect(analyzer.process(['encouragingly', 'the', 'math', 'dance', "isn't", 'futile']).score).to.equal(1);
        });

        it('should return an object of sentimental words paired with their score', function(){
          expect(analyzer.process(['unfortunately', 'dance', 'futile']).score).to.equal(-1);
          expect(analyzer.process(['unfortunately', 'the', 'math', 'dance', 'is', 'futile']).hits)
            .to.include.keys(['unfortunately', 'dance', 'futile']);
        });

        it('should return no words if none are sentimental', function(){
          expect(analyzer.process(['the', 'math', 'is']).hits).to.be.empty;
        });
      });
    });
  });
});
