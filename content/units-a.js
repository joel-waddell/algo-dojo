window.UNITS = window.UNITS || [];
UNITS.push({
  id: 'toolkit', title: 'JavaScript toolkit', blurb: 'The JS features you lean on in every problem, plus the gotchas that sink people.',
  items: [
    { type: 'lesson', title: 'How you will get good fast', body: [
      'LeetCode-style problems look endless, but almost all of them are built from about <b>15 patterns</b>. Mastery means two skills: <b>recognizing</b> which pattern a problem (or a function) uses, and <b>executing</b> that pattern\'s template from memory.',
      'Each unit here teaches one pattern with: a short lesson, <b>analyze-this-function</b> drills, <b>line-ordering</b> puzzles, and <b>coding problems</b> with tests.',
      { tip: 'Daily routine (15 to 30 minutes): clear your Review queue first, then press Continue. Missed items come back on a schedule until they stick.' },
      '<h3>The UMPIRE method for any problem</h3><ul><li><b>U</b>nderstand: restate it; try a tiny example by hand; note edge cases (empty, one item, duplicates, negatives).</li><li><b>M</b>atch: which pattern? Check the constraints to know the target complexity.</li><li><b>P</b>lan: write the steps in plain words first.</li><li><b>I</b>mplement: code the template.</li><li><b>R</b>eview: trace your example through the code.</li><li><b>E</b>valuate: state time and space complexity.</li></ul>',
      { tip: 'Stuck for 15+ minutes? Open a hint. Still stuck? Read the solution, then close it and type it yourself. Spaced review will bring it back.' },
    ]},
    { type: 'lesson', title: 'Arrays, strings, Map and Set', body: [
      '<h3>Arrays</h3>Reading <code>a[i]</code>, <code>push</code> and <code>pop</code> are O(1). But <code>shift</code>, <code>unshift</code>, <code>splice</code>, <code>includes</code>, <code>indexOf</code>, <code>slice</code> and spread <code>[...a]</code> are all <b>O(n)</b>: they touch every element.',
      { code: `const a = [3, 1, 2];
a.push(4);              // O(1)  -> [3,1,2,4]
a.pop();                // O(1)  -> [3,1,2]
a.includes(2);          // O(n)  scans the whole array
const copy = a.slice(); // O(n)  copies
const grid = Array.from({ length: 3 }, () => Array(4).fill(0)); // 3x4 of zeros` },
      '<h3>Strings</h3>Strings are <b>immutable</b>: you can read <code>s[i]</code> but never assign to it. To build a string, push pieces to an array and <code>join(\'\')</code>, or use <code>+=</code>.',
      { code: `for (const ch of s) { /* each character */ }
const code = s.charCodeAt(i) - 97;  // 'a' -> 0 ... 'z' -> 25
const chars = s.split('');          // O(n) array of chars
const back = chars.reverse().join('');` },
      '<h3>Map and Set: your O(1) lookups</h3>',
      { code: `const count = new Map();
for (const x of nums) count.set(x, (count.get(x) || 0) + 1);
count.has(5); count.get(5); count.size;

const seen = new Set();
seen.add(x); seen.has(x); seen.delete(x);` },
      { tip: 'Prefer Map over a plain object for counting: object keys are always converted to strings, so obj[1] and obj["1"] are the same key.' },
    ]},
    { type: 'lesson', title: 'Gotchas that cost interviews', body: [
      '<b>1. Default sort compares as strings.</b> Always pass a comparator for numbers.',
      { code: `[10, 9, 1].sort();               // [1, 10, 9]  (string order!)
[10, 9, 1].sort((a, b) => a - b); // [1, 9, 10]
[10, 9, 1].sort((a, b) => b - a); // [10, 9, 1] descending` },
      '<b>2. <code>fill</code> with an object shares one object.</b>',
      { code: `const bad = Array(3).fill([]);          // 3 references to ONE array
const good = Array.from({ length: 3 }, () => []);` },
      '<b>3. Integer division.</b> Use <code>Math.floor(a / b)</code>. For non-negative ints, <code>(lo + hi) >> 1</code> also floors.',
      '<b>4. <code>for...in</code> on arrays gives string indexes.</b> Use <code>for...of</code> for values or a classic <code>for</code> loop for indexes.',
      '<b>5. Initial values for min/max.</b> Start with <code>Infinity</code> / <code>-Infinity</code>, not 0.',
    ]},
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const a = [10, 9, 1, 100];
a.sort();
console.log(a);`, options: ['[1,9,10,100]', '[1,10,100,9]', '[100,10,9,1]', '[10,9,1,100]'], answer: 1, check: true,
      explain: 'Without a comparator, sort converts elements to strings and compares them as text: "1" < "10" < "100" < "9". Use <code>a.sort((x, y) => x - y)</code>.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const grid = Array(2).fill([]);
grid[0].push(1);
console.log(grid);`, options: ['[[1],[]]', '[[1],[1]]', '[[1]]', 'TypeError'], answer: 1, check: true,
      explain: '<code>fill([])</code> evaluates <code>[]</code> once and puts the same array in every slot. Use <code>Array.from({ length: 2 }, () => [])</code>.' },
    { type: 'mcq', kind: 'concept', prompt: 'Which of these array operations is O(n)?', options: ['<code>arr.push(x)</code>', '<code>arr.pop()</code>', '<code>arr.shift()</code>', '<code>arr[i] = x</code>'], answer: 2,
      explain: '<code>shift</code> removes the first element, so every remaining element moves one index left. Queues built on <code>shift()</code> in a loop quietly become O(n²).' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const m = {};
m[1] = 'a';
m['1'] = 'b';
console.log(Object.keys(m).length);`, options: ['1', '2', '0', 'TypeError'], answer: 0, check: true,
      explain: 'Object keys are strings, so <code>1</code> becomes <code>"1"</code> and the second write overwrites the first. A <code>Map</code> would keep them separate.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const counts = new Map();
for (const ch of "banana") counts.set(ch, (counts.get(ch) || 0) + 1);
console.log(counts.get("a"), counts.size);`, options: ['3 3', '3 6', '2 3', 'undefined 3'], answer: 0, check: true,
      explain: '"banana" has a×3, n×2, b×1, so "a" maps to 3 and there are 3 distinct keys.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `console.log(Math.floor(7 / 2), 7 >> 1, -7 >> 1);`, options: ['3 3 -4', '3 3 -3', '3.5 3 -3', '3 3 -3.5'], answer: 0, check: true,
      explain: 'Both floor toward negative infinity: <code>Math.floor(-3.5)</code> is -4 and <code>-7 >> 1</code> is also -4. (<code>Math.trunc</code> would give -3.)' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `for (const i in ['a', 'b']) console.log(typeof i);`, options: ['number\nnumber', 'string\nstring', 'a\nb', 'undefined\nundefined'], answer: 1, check: true,
      explain: '<code>for...in</code> iterates property <i>names</i>, which are strings. <code>i + 1</code> would give "01", a classic bug.' },
    { type: 'parsons', title: 'Count characters', prompt: 'Arrange the lines to build a function that returns a Map of character counts.', lines: [
      'function charCount(s) {', '  const freq = new Map();', '  for (const ch of s) {', '    freq.set(ch, (freq.get(ch) || 0) + 1);', '  }', '  return freq;', '}'],
      distractors: ['  for (let i = 0; i <= s.length; i++) {', '    freq[ch]++;'],
      explain: 'Counting with <code>(get || 0) + 1</code> is the single most reused idiom in this course.' },
    { type: 'code', title: 'Fizz Buzz', difficulty: 'easy', fn: 'fizzBuzz',
      prompt: 'Return an array of strings for 1..n: "FizzBuzz" if divisible by 3 and 5, "Fizz" if by 3, "Buzz" if by 5, otherwise the number as a string.',
      starter: `function fizzBuzz(n) {
  const out = [];
  
  return out;
}`,
      tests: [{ args: [3], expected: ['1', '2', 'Fizz'] }, { args: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'] }, { args: [15], expected: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'] }, { args: [1], expected: ['1'] }],
      hints: ['Loop i from 1 to n inclusive.', 'Check the "divisible by 15" case first, or build the string by appending "Fizz" then "Buzz".', 'Use String(i) for the number case.'],
      solution: `function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    let s = '';
    if (i % 3 === 0) s += 'Fizz';
    if (i % 5 === 0) s += 'Buzz';
    out.push(s || String(i));
  }
  return out;
}`, complexity: 'O(n) time, O(n) space for the output' },
    { type: 'code', title: 'Most frequent number', difficulty: 'easy', fn: 'mostFrequent',
      prompt: 'Given a non-empty array of integers, return the value that appears most often. If there is a tie, return the <b>smaller</b> value.',
      starter: `function mostFrequent(nums) {
  
}`,
      tests: [{ args: [[1, 3, 3, 2]], expected: 3 }, { args: [[4, 4, 1, 1]], expected: 1 }, { args: [[7]], expected: 7 }, { args: [[-1, -1, 2, 2, 2, -1, 5]], expected: -1 }, { args: [[5, 5, 5, 3, 3, 3, 9]], expected: 3 }],
      hints: ['Count every number with a Map.', 'Then walk the Map entries, tracking the best (count, value) pair.', 'Replace the best when count is higher, or count is equal and value is smaller.'],
      solution: `function mostFrequent(nums) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);
  let best = null, bestCount = 0;
  for (const [x, c] of count) {
    if (c > bestCount || (c === bestCount && x < best)) {
      best = x;
      bestCount = c;
    }
  }
  return best;
}`, complexity: 'O(n) time, O(k) space for k distinct values' },
  ]
});

UNITS.push({
  id: 'bigo', title: 'Big-O by reading code', blurb: 'Look at any JS function and state its time and space cost, including hidden loops.',
  items: [
    { type: 'lesson', title: 'What Big-O measures', body: [
      'Big-O describes how work <b>grows</b> as the input size <i>n</i> grows. Drop constants and smaller terms: <code>3n + 50</code> is O(n); <code>n² + n</code> is O(n²).',
      '<table><tr><th>Class</th><th>Typical code</th><th>n = 100,000</th></tr><tr><td>O(1)</td><td>index, Map.get</td><td>1</td></tr><tr><td>O(log n)</td><td>binary search, halving loop</td><td>~17</td></tr><tr><td>O(n)</td><td>one loop</td><td>100k</td></tr><tr><td>O(n log n)</td><td>sort</td><td>~1.7M</td></tr><tr><td>O(n²)</td><td>nested loops</td><td>10 billion ✗</td></tr><tr><td>O(2ⁿ)</td><td>branching recursion</td><td>impossible</td></tr></table>',
      '<h3>Constraints tell you the target</h3>Judges do about 10⁷ to 10⁸ simple operations per second. So:',
      '<table><tr><th>n up to</th><th>Aim for</th></tr><tr><td>~20</td><td>O(2ⁿ), backtracking</td></tr><tr><td>~500</td><td>O(n³)</td></tr><tr><td>~5,000</td><td>O(n²)</td></tr><tr><td>~10⁵ to 10⁶</td><td>O(n log n) or O(n)</td></tr><tr><td>10⁹+</td><td>O(log n) or O(1)</td></tr></table>',
      '<b>Space</b> counts extra memory you allocate (new arrays, Maps, strings, and the recursion call stack), not the input itself.',
    ]},
    { type: 'lesson', title: 'The function-analysis checklist', body: [
      'Use these six questions on <b>any</b> JavaScript function, at work or in an interview. The Lab tab runs a version of this checklist for you on code you paste.',
      '<ol><li><b>What is n?</b> Name every input size (n, m, length of a string, number of nodes, the value of a number).</li><li><b>Loops:</b> sequential loops <i>add</i> (O(n + m)); nested loops <i>multiply</i> (O(n·m)).</li><li><b>Halving or doubling?</b> If a loop variable is divided or multiplied by 2 (or a range is halved), that loop is O(log n).</li><li><b>Hidden loops:</b> <code>includes</code>, <code>indexOf</code>, <code>find</code>, <code>filter</code>, <code>map</code>, <code>slice</code>, <code>splice</code>, <code>shift</code>, <code>[...spread]</code>, <code>Object.keys</code>, <code>JSON.stringify</code>, <code>new Set(arr)</code> are all O(n). <code>sort</code> is O(n log n).</li><li><b>Recursion:</b> cost ≈ (branches)^(depth). With memoization: (number of distinct states) × (work per state).</li><li><b>Space:</b> what grows with n? Include the recursion depth.</li></ol>',
      { code: `function slow(users, ids) {
  return ids.map(id => users.find(u => u.id === id)); // map O(m) × find O(n) = O(n·m)
}
function fast(users, ids) {
  const byId = new Map(users.map(u => [u.id, u])); // O(n)
  return ids.map(id => byId.get(id));              // O(m)
}                                                  // total O(n + m)` },
      { tip: 'The most common real-world performance bug in JS is a hidden O(n) call (find, includes, filter, indexOf) inside a loop. The fix is almost always a Map or Set built once up front.' },
    ]},
    { type: 'lesson', title: 'Tricky cases', body: [
      '<b>Pointers that never move backward.</b> A <code>while</code> inside a <code>for</code> is not automatically O(n²). If the inner pointer only ever moves forward, it moves at most n times in total, so the whole thing is O(n). This is why sliding window and two pointers are linear.',
      '<b>Amortized O(1).</b> <code>push</code> occasionally resizes the array (O(n)), but averaged over many pushes it is O(1).',
      '<b>Digits and square roots.</b> Looping over the digits of n is O(log n). Looping <code>i * i <= n</code> is O(√n).',
      '<b>Two inputs.</b> Looping over <code>a</code> inside a loop over <code>b</code> is O(a·b), not O(n²). Name both sizes.',
      '<b>Strings are copies.</b> <code>s.slice(i)</code> inside a loop over s is O(n²) total work.',
    ]},
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity?', code: `function hasDuplicate(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}`, options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 2, explain: 'The inner loop runs n-1, n-2, … 1 times: about n²/2 comparisons, which is O(n²).' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity? (Look carefully.)', code: `function hasDuplicate(nums) {
  const seen = [];
  for (const x of nums) {
    if (seen.includes(x)) return true;
    seen.push(x);
  }
  return false;
}`, options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 2, explain: '<code>includes</code> on an array is a hidden loop over up to n items, run n times: O(n²). Swap the array for a <code>Set</code> and it becomes O(n).' },
    { type: 'mcq', kind: 'complexity', prompt: 'Space complexity?', code: `function hasDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`, options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, explain: 'In the worst case (no duplicates) the Set ends up holding all n values. Time is O(n) too: the classic trade of space for time.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity in terms of n?', code: `function countSteps(n) {
  let steps = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    steps++;
  }
  return steps;
}`, options: ['O(1)', 'O(log n)', 'O(n)', 'O(√n)'], answer: 1, explain: 'n halves each iteration, so the loop runs about log₂(n) times.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity?', code: `function allPairs(a, b) {
  const out = [];
  for (const x of a) {
    for (const y of b) out.push([x, y]);
  }
  return out;
}`, options: ['O(n²)', 'O(a + b)', 'O(a · b)', 'O(a²)'], answer: 2, explain: 'Two different inputs: the inner loop runs b times for each of a items. Say O(a·b) and name both sizes.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity?', code: `function maxGap(nums) {
  nums.sort((a, b) => a - b);
  let best = 0;
  for (let i = 1; i < nums.length; i++) {
    best = Math.max(best, nums[i] - nums[i - 1]);
  }
  return best;
}`, options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1, explain: 'Sorting is O(n log n), then one O(n) pass. The larger term wins: O(n log n). (Note it also mutates the caller\'s array.)' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity? (There is a loop inside a loop.)', code: `function longestUnique(s) {
  const seen = new Set();
  let j = 0, best = 0;
  for (let i = 0; i < s.length; i++) {
    while (seen.has(s[i])) {
      seen.delete(s[j]);
      j++;
    }
    seen.add(s[i]);
    best = Math.max(best, i - j + 1);
  }
  return best;
}`, options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'], answer: 0, explain: '<code>j</code> only moves forward and can move at most n times in total across the whole run. So the inner while does O(n) work overall: O(n) total. This is the sliding window pattern.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity?', code: `function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`, options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(log n)'], answer: 2, explain: 'Each call branches into two, about n levels deep: roughly 2ⁿ calls (more precisely ~1.6ⁿ). Memoization fixes it.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time and space complexity?', code: `function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const v = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, v);
  return v;
}`, options: ['O(2ⁿ) time, O(n) space', 'O(n) time, O(n) space', 'O(n) time, O(1) space', 'O(log n) time, O(n) space'], answer: 1, explain: 'There are only n distinct states and each is computed once with O(1) work: O(n) time. The Map and the call stack are both O(n) space.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity in terms of the number n?', code: `function sumDigits(n) {
  let s = 0;
  for (const ch of String(n)) s += Number(ch);
  return s;
}`, options: ['O(1)', 'O(log n)', 'O(n)', 'O(√n)'], answer: 1, explain: 'A number n has about log₁₀(n) digits, so the loop runs O(log n) times.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity?', code: `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}`, options: ['O(n)', 'O(log n)', 'O(√n)', 'O(n²)'], answer: 2, explain: 'The loop stops when i² exceeds n, i.e. after √n iterations.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity?', code: `function reverseCopy(arr) {
  const out = [];
  for (const x of arr) out.unshift(x);
  return out;
}`, options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 2, explain: '<code>unshift</code> moves every existing element over by one, so it is O(current length), done n times: O(n²). Use <code>push</code> and iterate backwards, or <code>arr.slice().reverse()</code>.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity?', code: `function allSuffixes(s) {
  const out = [];
  for (let i = 0; i < s.length; i++) out.push(s.slice(i));
  return out;
}`, options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 2, explain: 'Each <code>slice(i)</code> copies n - i characters: n + (n-1) + … + 1 = O(n²) time, and the output also takes O(n²) space.' },
    { type: 'mcq', kind: 'concept', prompt: 'Constraints say 1 ≤ n ≤ 10⁵. Which approach is the slowest that will still reliably pass?', options: ['O(n³)', 'O(n²)', 'O(n log n)', 'O(2ⁿ)'], answer: 2, explain: 'n² = 10¹⁰ operations is far too many. n log n ≈ 1.7 million is easy. When you see 10⁵, think sorting, hashing, two pointers, or a heap.' },
    { type: 'mcq', kind: 'concept', prompt: 'Constraints say 1 ≤ n ≤ 20. What does that hint?', options: ['You must use O(log n)', 'Exponential search (subsets/backtracking) is fine', 'The input must be sorted', 'Use a hash map'], answer: 1, explain: '2²⁰ ≈ one million, so trying every subset is allowed. Tiny limits are a deliberate hint toward backtracking or bitmasks.' },
    { type: 'code', title: 'Contains duplicate (make it fast)', difficulty: 'easy', fn: 'containsDuplicate',
      prompt: 'Return <code>true</code> if any value appears at least twice. The slow version below is O(n²) and will time out on the big hidden test. Rewrite it in O(n).',
      starter: `function containsDuplicate(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums.indexOf(nums[i]) !== i) return true; // hidden O(n) inside a loop
  }
  return false;
}`,
      tests: [{ args: [[1, 2, 3, 1]], expected: true }, { args: [[1, 2, 3, 4]], expected: false }, { args: [[]], expected: false }, { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }, { big: 'distinct', n: 300000, expected: false, hidden: true }],
      hints: ['What data structure answers "have I seen this before?" in O(1)?', 'Walk the array once with a Set. Check has() before add().'],
      solution: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}
// One-liner alternative: return new Set(nums).size !== nums.length;`, complexity: 'O(n) time, O(n) space' },
    { type: 'code', title: 'Intersection of two arrays', difficulty: 'easy', fn: 'intersection',
      prompt: 'Return the unique values that appear in both arrays, in any order. Aim for O(n + m), not O(n·m).',
      starter: `function intersection(a, b) {
  
}`,
      tests: [{ args: [[1, 2, 2, 1], [2, 2]], expected: [2] }, { args: [[4, 9, 5], [9, 4, 9, 8, 4]], expected: [9, 4] }, { args: [[1, 2], [3]], expected: [] }, { args: [[], [1]], expected: [] }],
      compare: 'unordered',
      hints: ['Put one array in a Set.', 'Walk the other array; collect values that are in the first Set, using a second Set to avoid duplicates.'],
      solution: `function intersection(a, b) {
  const inA = new Set(a);
  const out = new Set();
  for (const x of b) if (inA.has(x)) out.add(x);
  return [...out];
}`, complexity: 'O(n + m) time, O(n) space' },
  ]
});

UNITS.push({
  id: 'hashing', title: 'Hash maps & sets', blurb: 'Trade memory for speed: seen-before, counting, and grouping by key.',
  items: [
    { type: 'lesson', title: 'The three hash map moves', body: [
      'Whenever a brute-force solution asks "is there an earlier element that…", a Map or Set can usually answer in O(1), turning O(n²) into O(n).',
      '<h3>1. Complement lookup</h3>Store what you have seen; for each new item ask whether its partner is already stored.',
      { code: `function twoSum(nums, target) {
  const indexOf = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (indexOf.has(need)) return [indexOf.get(need), i];
    indexOf.set(nums[i], i);   // store AFTER checking
  }
  return [];
}` },
      '<h3>2. Frequency count</h3>',
      { code: `const freq = new Map();
for (const x of items) freq.set(x, (freq.get(x) || 0) + 1);` },
      '<h3>3. Group by a canonical key</h3>Turn each item into a key that equal items share (sorted letters, a count signature, a rounded value) and bucket by it.',
      { code: `const groups = new Map();
for (const w of words) {
  const key = [...w].sort().join('');
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(w);
}
return [...groups.values()];` },
      { tip: 'Signals: "pair/complement", "duplicate", "anagram", "how many times", "first unique", "group". Cost: O(n) extra space.' },
    ]},
    { type: 'mcq', kind: 'bug', prompt: 'This twoSum sometimes returns the same index twice. Why?', code: `function twoSum(nums, target) {
  const idx = new Map();
  for (let i = 0; i < nums.length; i++) {
    idx.set(nums[i], i);
    const need = target - nums[i];
    if (idx.has(need)) return [idx.get(need), i];
  }
  return [];
}`, options: ['The Map should be an object', 'It stores the current number before checking, so a number can pair with itself (e.g. 3 + 3 = 6 with one 3)', 'need should be nums[i] - target', 'It should return as soon as the Map has two entries'], answer: 1,
      explain: 'For nums = [3, 2, 4], target = 6 it returns [0, 0]. Check first, then store. That ordering guarantees the partner came from an earlier index.' },
    { type: 'mcq', kind: 'pattern', prompt: 'Given a string, return the index of the first character that appears only once. Best approach?', options: ['Two nested loops comparing every pair', 'Count all characters in a Map, then scan the string again for the first count of 1', 'Sort the string, then scan', 'Binary search'], answer: 1, explain: 'Two passes, O(n): one to count, one to find. Sorting would lose the original order.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const words = ['eat', 'tea', 'tan', 'ate', 'nat'];
const g = new Map();
for (const w of words) {
  const k = [...w].sort().join('');
  g.set(k, (g.get(k) || 0) + 1);
}
console.log(g.size, g.get('aet'));`, options: ['5 1', '2 3', '3 2', '2 2'], answer: 1, check: true, explain: 'Keys: eat/tea/ate → "aet" (3), tan/nat → "ant" (2). Two groups.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity, where n = number of words and k = max word length?', code: `function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}`, options: ['O(n)', 'O(n · k log k)', 'O(n² · k)', 'O(n log n)'], answer: 1, explain: 'Each word is sorted: O(k log k), done n times. A 26-letter count key would make it O(n·k).' },
    { type: 'mcq', kind: 'bug', prompt: 'What is wrong with this anagram check?', code: `function isAnagram(s, t) {
  const count = {};
  for (const ch of s) count[ch] = (count[ch] || 0) + 1;
  for (const ch of t) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}`, options: ['Nothing, it is correct', 'It returns true when t is shorter than s, e.g. ("ab", "a")', 'Objects cannot be used for counting', 'It fails on repeated letters'], answer: 1, explain: 'If t uses a subset of s\'s letters, every check passes. Add <code>if (s.length !== t.length) return false;</code> at the top.' },
    { type: 'parsons', title: 'Two Sum', prompt: 'Order the lines to build the O(n) two-sum.', lines: [
      'function twoSum(nums, target) {', '  const seen = new Map();', '  for (let i = 0; i < nums.length; i++) {', '    const need = target - nums[i];', '    if (seen.has(need)) return [seen.get(need), i];', '    seen.set(nums[i], i);', '  }', '  return [];', '}'],
      distractors: ['    seen.set(i, nums[i]);', '    for (let j = 0; j < nums.length; j++) {'], explain: 'The Map maps value → index, and we check before we insert.' },
    { type: 'code', title: 'Two Sum', difficulty: 'easy', fn: 'twoSum',
      prompt: 'Return the indices <code>[i, j]</code> (i < j) of the two numbers that add up to <code>target</code>. Exactly one answer exists. Use O(n) time.',
      starter: `function twoSum(nums, target) {
  
}`,
      tests: [{ args: [[2, 7, 11, 15], 9], expected: [0, 1] }, { args: [[3, 2, 4], 6], expected: [1, 2] }, { args: [[3, 3], 6], expected: [0, 1] }, { args: [[-3, 4, 3, 90], 0], expected: [0, 2] }],
      hints: ['For each number x, the partner you need is target - x.', 'Keep a Map of value → index for everything you have already passed.'],
      solution: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`, complexity: 'O(n) time, O(n) space' },
    { type: 'code', title: 'Valid anagram', difficulty: 'easy', fn: 'isAnagram',
      prompt: 'Return <code>true</code> if <code>t</code> is a rearrangement of the letters of <code>s</code> (lowercase a to z).',
      starter: `function isAnagram(s, t) {
  
}`,
      tests: [{ args: ['anagram', 'nagaram'], expected: true }, { args: ['rat', 'car'], expected: false }, { args: ['ab', 'a'], expected: false }, { args: ['', ''], expected: true }, { args: ['aacc', 'ccac'], expected: false }],
      hints: ['Different lengths can never be anagrams.', 'Count letters of s up, letters of t down. All counts must end at zero. An array of 26 works well: index = charCodeAt - 97.'],
      solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every(c => c === 0);
}`, complexity: 'O(n) time, O(1) space (26 counters)' },
    { type: 'code', title: 'Group anagrams', difficulty: 'medium', fn: 'groupAnagrams',
      prompt: 'Group the words that are anagrams of each other. Return the groups in any order (order inside each group does not matter either).',
      starter: `function groupAnagrams(words) {
  
}`,
      tests: [{ args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] }, { args: [['']], expected: [['']] }, { args: [['a']], expected: [['a']] }, { args: [['ab', 'ba', 'abc', 'cab', 'x']], expected: [['ab', 'ba'], ['abc', 'cab'], ['x']] }],
      compare: 'unorderedDeep',
      hints: ['Anagrams share the same sorted letters.', 'Map from sorted key → array of words. Return [...map.values()].'],
      solution: `function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}`, complexity: 'O(n · k log k) time, O(n · k) space' },
    { type: 'code', title: 'Longest consecutive sequence', difficulty: 'medium', fn: 'longestConsecutive',
      prompt: 'Return the length of the longest run of consecutive integers (like 1, 2, 3, 4) that can be formed from the values in an unsorted array. Must be O(n), so no sorting.',
      starter: `function longestConsecutive(nums) {
  
}`,
      tests: [{ args: [[100, 4, 200, 1, 3, 2]], expected: 4 }, { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 }, { args: [[]], expected: 0 }, { args: [[1, 2, 0, 1]], expected: 3 }, { args: [[9, -1, -2, -3]], expected: 3 }],
      hints: ['Put everything in a Set for O(1) membership.', 'Only start counting from x when x - 1 is NOT in the set: x is the start of a run.', 'From each start, count up while x + 1, x + 2 … are present. Each number is visited at most twice overall.'],
      solution: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue; // not a run start
    let len = 1;
    while (set.has(x + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}`, complexity: 'O(n) time (each value is extended from at most once), O(n) space' },
  ]
});

UNITS.push({
  id: 'twoptr', title: 'Two pointers', blurb: 'Walk inward from both ends, or run a slow and fast pointer, to avoid nested loops.',
  items: [
    { type: 'lesson', title: 'Two shapes of two pointers', body: [
      '<h3>Opposite ends (sorted input, pairs, palindromes)</h3>Start <code>l = 0</code>, <code>r = n - 1</code>. Each step, the sorted order (or symmetry) tells you which pointer to move. Every step discards a possibility, so it is O(n).',
      { code: `function pairWithSum(sorted, target) {
  let l = 0, r = sorted.length - 1;
  while (l < r) {
    const sum = sorted[l] + sorted[r];
    if (sum === target) return [l, r];
    if (sum < target) l++;   // need bigger
    else r--;                // need smaller
  }
  return null;
}` },
      '<h3>Same direction (read / write)</h3>A fast <code>read</code> pointer scans everything; a slow <code>write</code> pointer marks where the next kept item goes. Great for in-place filtering with O(1) space.',
      { code: `function removeValue(nums, val) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== val) nums[write++] = nums[read];
  }
  return write; // new length
}` },
      { tip: 'Signals: input is sorted, "pair/triplet with sum", "palindrome", "in place", "O(1) extra space", "reverse". 3Sum = sort + fix one + two-pointer the rest.' },
    ]},
    { type: 'mcq', kind: 'pattern', prompt: 'Sorted array, find whether any two numbers sum to a target, O(1) extra space. Best fit?', options: ['Hash set', 'Two pointers from both ends', 'Sliding window', 'Backtracking'], answer: 1, explain: 'A hash set works but uses O(n) space. Sorted input plus O(1) space points to two pointers.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const nums = [0, 1, 0, 3, 12];
let w = 0;
for (let r = 0; r < nums.length; r++) {
  if (nums[r] !== 0) {
    [nums[w], nums[r]] = [nums[r], nums[w]];
    w++;
  }
}
console.log(nums);`, options: ['[1,3,12,0,0]', '[0,0,1,3,12]', '[1,0,3,0,12]', '[12,3,1,0,0]'], answer: 0, check: true, explain: 'Read/write pointers: each non-zero is swapped into the next write slot, keeping order. This is "Move Zeroes".' },
    { type: 'mcq', kind: 'bug', prompt: 'This palindrome check returns false for "abba". Why?', code: `function isPal(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
  }
  return true;
}`, options: ['It should be l <= r', 'r is never decremented, so after the first step it compares the wrong pairs', 'Strings cannot be indexed', 'It needs to lowercase first'], answer: 1, explain: 'With r stuck at 3, the second step compares s[1] = "b" with s[3] = "a" and returns false. Both pointers must move: <code>l++; r--;</code>.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity of this 3Sum?', code: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (s < 0) l++;
      else if (s > 0) r--;
      else {
        out.push([nums[i], nums[l], nums[r]]);
        l++;
        while (l < r && nums[l] === nums[l - 1]) l++;
      }
    }
  }
  return out;
}`, options: ['O(n log n)', 'O(n²)', 'O(n³)', 'O(n)'], answer: 1, explain: 'The sort is O(n log n). Then for each of n values of i, the two pointers sweep O(n): O(n²) overall, much better than the brute force O(n³).' },
    { type: 'mcq', kind: 'pattern', prompt: 'In "Container With Most Water" (pick two walls to hold the most water), you start with l = 0, r = n-1. Which pointer do you move?', options: ['Always l', 'The taller wall', 'The shorter wall', 'Both every time'], answer: 2, explain: 'Area is limited by the shorter wall. Moving the taller one can never help (width shrinks, height cannot exceed the short wall), so move the shorter one.' },
    { type: 'parsons', title: 'Valid palindrome', prompt: 'Order the lines: check a string is a palindrome, ignoring non-alphanumerics and case.', lines: [
      'function isPalindrome(s) {', "  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');", '  let l = 0, r = t.length - 1;', '  while (l < r) {', '    if (t[l] !== t[r]) return false;', '    l++;', '    r--;', '  }', '  return true;', '}'],
      distractors: ['  while (l <= r && l++) {', '    if (t[l] === t[r]) return true;'], explain: 'Clean first, then compare mirrored characters while moving both pointers inward.' },
    { type: 'code', title: 'Valid palindrome', difficulty: 'easy', fn: 'isPalindrome',
      prompt: 'Return <code>true</code> if the string reads the same forward and backward after lowercasing and removing everything except letters and digits.',
      starter: `function isPalindrome(s) {
  
}`,
      tests: [{ args: ['A man, a plan, a canal: Panama'], expected: true }, { args: ['race a car'], expected: false }, { args: [' '], expected: true }, { args: ['0P'], expected: false }, { args: ['ab_a'], expected: true }],
      hints: ['Clean the string with toLowerCase() and a regex: /[^a-z0-9]/g.', 'Compare t[l] and t[r], moving both inward.'],
      solution: `function isPalindrome(s) {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = t.length - 1;
  while (l < r) {
    if (t[l] !== t[r]) return false;
    l++;
    r--;
  }
  return true;
}`, complexity: 'O(n) time, O(n) for the cleaned copy (skip-in-place pointers make it O(1))' },
    { type: 'code', title: 'Move zeroes (in place)', difficulty: 'easy', fn: 'moveZeroes', returnArg: 0,
      prompt: 'Move all 0s to the end of the array <b>in place</b>, keeping the relative order of the non-zero elements. You do not need to return anything; the test checks the array you were given.',
      starter: `function moveZeroes(nums) {
  
}`,
      tests: [{ args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] }, { args: [[0]], expected: [0] }, { args: [[1, 2]], expected: [1, 2] }, { args: [[0, 0, 1]], expected: [1, 0, 0] }],
      hints: ['Keep a write pointer w for the next non-zero position.', 'For each read index r, if nums[r] !== 0, swap nums[w] and nums[r] and advance w.'],
      solution: `function moveZeroes(nums) {
  let w = 0;
  for (let r = 0; r < nums.length; r++) {
    if (nums[r] !== 0) {
      [nums[w], nums[r]] = [nums[r], nums[w]];
      w++;
    }
  }
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Two Sum II (sorted input)', difficulty: 'medium', fn: 'twoSumSorted',
      prompt: 'The array is sorted ascending. Return the <b>1-based</b> indices <code>[i, j]</code> of two numbers that add to target. Use O(1) extra space.',
      starter: `function twoSumSorted(numbers, target) {
  
}`,
      tests: [{ args: [[2, 7, 11, 15], 9], expected: [1, 2] }, { args: [[2, 3, 4], 6], expected: [1, 3] }, { args: [[-1, 0], -1], expected: [1, 2] }, { args: [[1, 2, 3, 4, 4, 9, 56, 90], 8], expected: [4, 5] }],
      hints: ['l at the start, r at the end.', 'Sum too small → l++. Too big → r--.'],
      solution: `function twoSumSorted(numbers, target) {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    const sum = numbers[l] + numbers[r];
    if (sum === target) return [l + 1, r + 1];
    if (sum < target) l++;
    else r--;
  }
  return [];
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Container with most water', difficulty: 'medium', fn: 'maxArea',
      prompt: 'Given wall heights, pick two walls i < j to maximize <code>(j - i) * min(height[i], height[j])</code>. Return that maximum.',
      starter: `function maxArea(height) {
  
}`,
      tests: [{ args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 }, { args: [[1, 1]], expected: 1 }, { args: [[4, 3, 2, 1, 4]], expected: 16 }, { args: [[1, 2, 1]], expected: 2 }],
      hints: ['Start with the widest container.', 'Move the pointer at the shorter wall inward: it is the limiting side.'],
      solution: `function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, (r - l) * Math.min(height[l], height[r]));
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: '3Sum', difficulty: 'medium', fn: 'threeSum',
      prompt: 'Return all unique triplets <code>[a, b, c]</code> from the array with a + b + c = 0. No duplicate triplets. Any order.',
      starter: `function threeSum(nums) {
  
}`,
      tests: [{ args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] }, { args: [[0, 1, 1]], expected: [] }, { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]] }, { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] }],
      compare: 'unorderedDeep',
      hints: ['Sort first.', 'Fix nums[i], then run two pointers on the rest looking for -nums[i].', 'Skip duplicate values for i, and after a match skip duplicate values for l.'],
      solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (s < 0) l++;
      else if (s > 0) r--;
      else {
        out.push([nums[i], nums[l], nums[r]]);
        l++;
        while (l < r && nums[l] === nums[l - 1]) l++;
      }
    }
  }
  return out;
}`, complexity: 'O(n²) time, O(1) extra space besides output (sort may use O(log n))' },
  ]
});
