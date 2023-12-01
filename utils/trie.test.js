const Trie = require('./trie');

describe('trie', () => {
  const trie = new Trie();
  trie.insert('one');
  trie.insert('two');
  trie.insert('three');

  it('finds a word in a trie', () => {
    expect(trie.contain('two')).toEqual(true);
    expect(trie.contain('four')).toEqual(false);
    expect(trie.contain('twocat')).toEqual(false);
  });

  it('finds a prefix of the word in a trie', () => {
    expect(trie.findPrefix('twocat')).toEqual('two');
    expect(trie.findPrefix('one')).toEqual('one');
    expect(trie.findPrefix('four')).toEqual(null);
  });
});