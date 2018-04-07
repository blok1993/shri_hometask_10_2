/* eslint-disable valid-jsdoc */
import roads from './roads';

/**
 * Возвращаем подходящие варианты из roads.
 * Сложность метода ограничивается кол-вом выводимых результатов - limit,
 * а также кол-вом слов в строке C = array.length.
 * O(limit * C), где C <= 4 в данной конкретной задаче с улицами.
 */
const intersection = (arrays) => {
    const firstArray = arrays[0];
    const limit = 10;

    let result = [];
    let candidate;
    let found;

    for (let i = 0; i < firstArray.length && result.length < limit; i++) {
        candidate = firstArray[i];
        found = true;

        for (let k = 1; k < arrays.length; k++) {
            if (arrays[k].indexOf(candidate) === -1) {
                found = false;
                break;
            }
        }

        if (found) {
            result[result.length] = candidate;
        }
    }

    return result;
};

const createPrefixTrie = (dictionary) => {
    const data = dictionary;
    const trie = {};
    const spaceSymbolRegexp = /\s+/;

    /**
     * Сложность метода O(N), где N - длина слова.
     */
    const addWord = (word, id, wordIndex) => {
        let node = trie;

        // Создаем prefix trie
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];

            if (!node[letter]) {
                node[letter] = {
                    ids: [],
                };
            }

            if (!node[letter].ids[wordIndex]) {
                node[letter].ids[wordIndex] = [];
            }

            node[letter].ids[wordIndex].push(id);

            node = node[letter];
        }
    };

    /**
     * Каждую новую строку разбиваем на отдельные слова,
     * и строим из них prefix trie.
     * Сложность метода O(P), где P - кол-во слов во фразе.
     */
    const addPhrase = (phrase, id) => {
        const words = phrase.trim().toLowerCase().split(spaceSymbolRegexp);

        for (let i = 0; i < words.length; i++) {
            addWord(words[i], id, i);
        }
    };

    /**
     * Сложность метода O(N + M), где N - длина слова,
     * M - длина массива node.ids.
     */
    const getWordIndexes = (word) => {
        let node = trie;

        for (let i = 0; i < word.length; i++) {
            if (node[word[i]]) {
                node = node[word[i]];
            } else {
                return [];
            }
        }

        const ids = node.ids;
        let result = [];

        for (let i = 0; i < ids.length; i++) {
            if (ids[i]) {
                result = result.concat(ids[i]);
            }
        }

        return result;
    };

    /**
     * Сложность метода O(K*L), где K - кол-во слов в строке
     * (для данной задачи это максимум 3-4 слова),
     * L = (N + M) из метода getWordIndexes.
     */
    const getPhraseIndexes = (phrase) => {
        /**
         * Делим фразу по пробелам на слова,
         * при этом отсекая строки с нулевой длиной.
          */
        const words = phrase.toLowerCase()
            .split(spaceSymbolRegexp).filter(Boolean);

        const wordsCount = words.length;

        if (wordsCount === 0) {
            return [];
        }

        let indexesArray = [];

        // Заполняем массив с индексами для каждого слова во введенной строке.
        for (let i = 0; i < wordsCount; i++) {
            indexesArray[i] = getWordIndexes(words[i]);
        }

        return intersection(indexesArray);
    };

    const suggest = (query) => {
        // Замеряем время работы метода suggest
        let timeSuggest = performance.now();

        const indexes = getPhraseIndexes(query);
        let result = [];

        for (let i = 0; i < indexes.length; i++) {
            result[i] = data[indexes[i]];
        }

        timeSuggest = performance.now() - timeSuggest;
        console.log('suggest выдал результат за: ',
            timeSuggest.toFixed(2) + ' ms');

        drawSuggestions(result);
        return result;
    };

    const itemsCount = dictionary.length;

    // Замеряем время построения prefix trie
    let timePrefixTrie = performance.now();

    for (let i = 0; i < itemsCount; i++) {
        addPhrase(dictionary[i], i);
    }

    timePrefixTrie = performance.now() - timePrefixTrie;
    console.log('Время построения prefix trie: ',
        timePrefixTrie.toFixed(2) + ' ms');

    return {
        suggest,
    };
};

const drawSuggestions = (results) => {
    // Очищаем блок с результатами при каждом изменении input.
    document.querySelector('.suggestions-block').innerHTML = '';

    let list = document.createElement('ol');

    for (let i = 0; i < results.length; i++) {
        let listElement = document.createElement('li');
        listElement.innerText = results[i];

        list.appendChild(listElement);
    }

    document.querySelector('.suggestions-block').appendChild(list);
};

// Создали prefix tree.
const trie = createPrefixTrie(roads);

document.querySelector('.street-name').addEventListener('input', (e) => {
    trie.suggest(e.target.value);
});
