class TrieNode {
  constructor(key) {
    this.key = key;
    this.children = new Map();
    this.end = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    if (!word) return false;

    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode(char));
      }
      currentNode = currentNode.children.get(char);
    }

    currentNode.end = true;
    return true;
  }

  contain(word,node = this.root) {
    if (!word) return false;
    let currentNode = node;
    for (const char of word) {
      if (!currentNode.children.has(char)) return false;
      currentNode = currentNode.children.get(char);
    }

    return currentNode.end;
  }

  findPrefix(word, node = this.root) {
    if (!word) return null;
    let currentNode = node;
    let prefix = '';
    for (const char of word) {
      if (!currentNode.children.has(char)) return null;
      prefix += char;
      currentNode = currentNode.children.get(char);
      if (currentNode.end) return prefix;
    }
  }
}

module.exports = Trie;