window.UNITS = window.UNITS || [];
UNITS.push({
  id: 'window', title: 'Sliding window', blurb: 'Contiguous subarrays and substrings in one pass: grow the right edge, shrink the left.',
  items: [
    { type: 'lesson', title: 'Fixed and variable windows', body: [
      'A window is a contiguous range <code>[l, r]</code>. Instead of recomputing each subarray from scratch (O(n·k) or O(n²)), you <b>update</b> the window: add the element entering, remove the element leaving.',
      '<h3>Fixed size k</h3>',
      { code: `function maxSumOfK(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let r = k; r < nums.length; r++) {
    sum += nums[r] - nums[r - k];   // add new, drop old
    best = Math.max(best, sum);
  }
  return best;
}` },
      '<h3>Variable size: expand, then shrink while invalid</h3>',
      { code: `function longestValid(s) {
  const state = new Map();     // what's inside the window
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    // 1. add s[r] to state
    // 2. while (window is invalid) { remove s[l] from state; l++; }
    // 3. window [l, r] is valid: record r - l + 1
  }
  return best;
}` },
      'For "shortest window that satisfies X", flip it: shrink <b>while the window is valid</b>, recording the length each time.',
      { tip: 'Signals: "contiguous subarray/substring", "longest/shortest/max sum of a window", "at most k distinct", "without repeating". Each pointer only moves forward, so it is O(n).' },
      { tip: 'Sliding window needs a monotonic validity rule (shrinking can only help). With negative numbers in sum problems, use prefix sums instead.' },
    ]},
    { type: 'mcq', kind: 'pattern', prompt: 'Find the length of the longest substring with no repeated characters. Which pattern?', options: ['Two pointers from both ends', 'Variable sliding window with a Set/Map', 'Binary search', 'Prefix sums'], answer: 1, explain: 'Contiguous + "longest" + a validity rule (no repeats) is the variable window pattern.' },
    { type: 'mcq', kind: 'pattern', prompt: 'Array contains negative numbers. Count subarrays whose sum equals k. Does sliding window work?', options: ['Yes, shrink when the sum exceeds k', 'No: with negatives, shrinking does not reliably reduce the sum. Use prefix sums + a hash map', 'Yes, but only with a fixed size', 'No, it requires backtracking'], answer: 1, explain: 'Sliding window relies on "shrinking makes it smaller". Negatives break that. Prefix sums handle it (next unit).' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `function maxSumOfK(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let r = k; r < nums.length; r++) {
    sum += nums[r] - nums[r - k];
    best = Math.max(best, sum);
  }
  return best;
}
console.log(maxSumOfK([2, 1, 5, 1, 3, 2], 3));`, options: ['8', '9', '6', '11'], answer: 1, check: true, explain: 'Windows: 2+1+5=8, 1+5+1=7, 5+1+3=9, 1+3+2=6. Best is 9.' },
    { type: 'mcq', kind: 'bug', prompt: 'This "best time to buy and sell stock" returns wrong answers. What is the bug?', code: `function maxProfit(prices) {
  let minPrice = 0, best = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    best = Math.max(best, p - minPrice);
  }
  return best;
}`, options: ['best should start at -Infinity', 'minPrice should start at Infinity (or prices[0]); starting at 0 means you "buy" for free', 'It should loop backward', 'Math.min should be Math.max'], answer: 1, explain: 'With minPrice = 0, every p - 0 counts as profit. [7, 1, 5] would return 7 instead of 4. Initialize min to Infinity.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity?', code: `function minSubArrayLen(target, nums) {
  let l = 0, sum = 0, best = Infinity;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    while (sum >= target) {
      best = Math.min(best, r - l + 1);
      sum -= nums[l++];
    }
  }
  return best === Infinity ? 0 : best;
}`, options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(target · n)'], answer: 1, explain: 'l and r each move forward at most n times in total, so it is O(n) despite the nested while.' },
    { type: 'parsons', title: 'Longest substring without repeats', prompt: 'Order the lines for the variable-window solution.', lines: [
      'function lengthOfLongestSubstring(s) {', '  const seen = new Set();', '  let l = 0, best = 0;', '  for (let r = 0; r < s.length; r++) {', '    while (seen.has(s[r])) {', '      seen.delete(s[l]);', '      l++;', '    }', '    seen.add(s[r]);', '    best = Math.max(best, r - l + 1);', '  }', '  return best;', '}'],
      distractors: ['    if (seen.has(s[r])) l = r;', '      seen.delete(s[r]);'], explain: 'Expand with r; while the new char is a duplicate, evict from the left; then record the window size.' },
    { type: 'code', title: 'Best time to buy and sell stock', difficulty: 'easy', fn: 'maxProfit',
      prompt: 'prices[i] is the price on day i. Buy once and sell once later. Return the maximum profit, or 0 if no profit is possible.',
      starter: `function maxProfit(prices) {
  
}`,
      tests: [{ args: [[7, 1, 5, 3, 6, 4]], expected: 5 }, { args: [[7, 6, 4, 3, 1]], expected: 0 }, { args: [[1]], expected: 0 }, { args: [[2, 4, 1]], expected: 2 }, { args: [[3, 2, 6, 5, 0, 3]], expected: 4 }],
      hints: ['Track the lowest price seen so far.', 'At each day, the best sale today is price - lowestSoFar.'],
      solution: `function maxProfit(prices) {
  let minPrice = Infinity, best = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    best = Math.max(best, p - minPrice);
  }
  return best;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Longest substring without repeating characters', difficulty: 'medium', fn: 'lengthOfLongestSubstring',
      prompt: 'Return the length of the longest substring with all distinct characters.',
      starter: `function lengthOfLongestSubstring(s) {
  
}`,
      tests: [{ args: ['abcabcbb'], expected: 3 }, { args: ['bbbbb'], expected: 1 }, { args: ['pwwkew'], expected: 3 }, { args: [''], expected: 0 }, { args: ['dvdf'], expected: 3 }, { args: ['abba'], expected: 2 }],
      hints: ['Window [l, r] always holds distinct characters, tracked in a Set.', 'Before adding s[r], remove s[l] and advance l while s[r] is already in the set.'],
      solution: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) {
      seen.delete(s[l]);
      l++;
    }
    seen.add(s[r]);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`, complexity: 'O(n) time, O(min(n, alphabet)) space' },
    { type: 'code', title: 'Minimum size subarray sum', difficulty: 'medium', fn: 'minSubArrayLen',
      prompt: 'Given positive integers and a target, return the length of the shortest contiguous subarray whose sum is ≥ target, or 0 if none.',
      starter: `function minSubArrayLen(target, nums) {
  
}`,
      tests: [{ args: [7, [2, 3, 1, 2, 4, 3]], expected: 2 }, { args: [4, [1, 4, 4]], expected: 1 }, { args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0 }, { args: [15, [1, 2, 3, 4, 5]], expected: 5 }],
      hints: ['Grow the window by adding nums[r] to a running sum.', 'While sum ≥ target: record the length, then subtract nums[l] and move l.'],
      solution: `function minSubArrayLen(target, nums) {
  let l = 0, sum = 0, best = Infinity;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    while (sum >= target) {
      best = Math.min(best, r - l + 1);
      sum -= nums[l++];
    }
  }
  return best === Infinity ? 0 : best;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Longest repeating character replacement', difficulty: 'medium', fn: 'characterReplacement',
      prompt: 'You may change up to k characters of uppercase string s. Return the length of the longest substring that can be made of one repeated letter.',
      starter: `function characterReplacement(s, k) {
  
}`,
      tests: [{ args: ['ABAB', 2], expected: 4 }, { args: ['AABABBA', 1], expected: 4 }, { args: ['A', 0], expected: 1 }, { args: ['ABCDE', 1], expected: 2 }, { args: ['AAAA', 0], expected: 4 }],
      hints: ['A window is valid if (window length - count of its most frequent letter) ≤ k.', 'Keep counts in an array of 26 and track maxCount as you add letters.', 'If invalid, shrink from the left by one. (maxCount never needs to decrease for the answer to stay right.)'],
      solution: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let l = 0, maxCount = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s.charCodeAt(r) - 65;
    maxCount = Math.max(maxCount, ++count[c]);
    while (r - l + 1 - maxCount > k) {
      count[s.charCodeAt(l) - 65]--;
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`, complexity: 'O(n) time, O(1) space' },
  ]
});

UNITS.push({
  id: 'prefix', title: 'Prefix sums', blurb: 'Precompute running totals so any range sum is O(1). Pair with a Map for "subarray sums to k".',
  items: [
    { type: 'lesson', title: 'Running totals answer range questions', body: [
      'Let <code>pre[i]</code> be the sum of the first i elements (so <code>pre[0] = 0</code>). Then the sum of <code>nums[l..r]</code> is <code>pre[r + 1] - pre[l]</code>: one subtraction instead of a loop.',
      { code: `const pre = [0];
for (const x of nums) pre.push(pre[pre.length - 1] + x);
const rangeSum = (l, r) => pre[r + 1] - pre[l];` },
      '<h3>Prefix sum + hash map</h3>A subarray ending at r sums to k exactly when some earlier prefix equals <code>current - k</code>. Count earlier prefixes in a Map. This works with negative numbers, unlike sliding window.',
      { code: `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]); // empty prefix
  let sum = 0, count = 0;
  for (const x of nums) {
    sum += x;
    count += seen.get(sum - k) || 0;
    seen.set(sum, (seen.get(sum) || 0) + 1);
  }
  return count;
}` },
      '<h3>Prefix and suffix products</h3>"Product of everything except me" = (product of everything to my left) × (product of everything to my right). Two passes, no division.',
      { tip: 'Signals: "sum of range", many range queries, "subarray sum equals k", "pivot/balance index", "except self". Variations: prefix XOR, prefix counts, 2D prefix sums for grids.' },
    ]},
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const nums = [3, 1, 4, 1, 5];
const pre = [0];
for (const x of nums) pre.push(pre[pre.length - 1] + x);
console.log(pre[4] - pre[1]);`, options: ['6', '9', '5', '10'], answer: 0, check: true, explain: 'pre = [0, 3, 4, 8, 9, 14]. pre[4] - pre[1] = 9 - 3 = 6, which is nums[1..3] = 1 + 4 + 1.' },
    { type: 'mcq', kind: 'bug', prompt: 'This subarraySum misses subarrays that start at index 0. Why?', code: `function subarraySum(nums, k) {
  const seen = new Map();
  let sum = 0, count = 0;
  for (const x of nums) {
    sum += x;
    count += seen.get(sum - k) || 0;
    seen.set(sum, (seen.get(sum) || 0) + 1);
  }
  return count;
}`, options: ['sum should start at 1', 'The Map must start with the empty prefix: new Map([[0, 1]])', 'It should check seen.get(k - sum)', 'It should set before getting'], answer: 1, explain: 'A subarray from index 0 to r needs an earlier prefix of 0 (the empty prefix). Seeding {0: 1} represents it.' },
    { type: 'mcq', kind: 'complexity', prompt: 'You build the prefix array once, then answer q range-sum queries. Total time?', options: ['O(n · q)', 'O(n + q)', 'O(q log n)', 'O(n²)'], answer: 1, explain: 'O(n) to build, then O(1) per query.' },
    { type: 'mcq', kind: 'pattern', prompt: 'Return an array where out[i] is the product of all elements except nums[i], without using division. Approach?', options: ['Nested loops', 'Left products pass, then right products pass', 'Sort then multiply', 'Sliding window'], answer: 1, explain: 'out[i] = (product left of i) × (product right of i). Two linear passes, O(1) extra space besides the output.' },
    { type: 'parsons', title: 'Running sum', prompt: 'Order the lines to return the running (prefix) sum array.', lines: ['function runningSum(nums) {', '  const out = [];', '  let sum = 0;', '  for (const x of nums) {', '    sum += x;', '    out.push(sum);', '  }', '  return out;', '}'], distractors: ['    out.push(x);', '  let sum = nums[0];'], explain: 'Keep the running total and push it after adding each element.' },
    { type: 'code', title: 'Running sum of 1D array', difficulty: 'easy', fn: 'runningSum',
      prompt: 'Return an array where <code>out[i] = nums[0] + … + nums[i]</code>.',
      starter: `function runningSum(nums) {
  
}`,
      tests: [{ args: [[1, 2, 3, 4]], expected: [1, 3, 6, 10] }, { args: [[1, 1, 1, 1, 1]], expected: [1, 2, 3, 4, 5] }, { args: [[3, 1, 2, 10, 1]], expected: [3, 4, 6, 16, 17] }, { args: [[]], expected: [] }],
      hints: ['Keep a running total.'],
      solution: `function runningSum(nums) {
  const out = [];
  let sum = 0;
  for (const x of nums) {
    sum += x;
    out.push(sum);
  }
  return out;
}`, complexity: 'O(n) time, O(n) output' },
    { type: 'code', title: 'Find pivot index', difficulty: 'easy', fn: 'pivotIndex',
      prompt: 'Return the leftmost index where the sum of elements strictly to the left equals the sum strictly to the right, or -1.',
      starter: `function pivotIndex(nums) {
  
}`,
      tests: [{ args: [[1, 7, 3, 6, 5, 6]], expected: 3 }, { args: [[1, 2, 3]], expected: -1 }, { args: [[2, 1, -1]], expected: 0 }, { args: [[0]], expected: 0 }],
      hints: ['Compute the total once.', 'Walk with a running leftSum; rightSum = total - leftSum - nums[i].'],
      solution: `function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let left = 0;
  for (let i = 0; i < nums.length; i++) {
    if (left === total - left - nums[i]) return i;
    left += nums[i];
  }
  return -1;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Subarray sum equals K', difficulty: 'medium', fn: 'subarraySum',
      prompt: 'Return the number of contiguous subarrays whose sum equals k. Numbers may be negative.',
      starter: `function subarraySum(nums, k) {
  
}`,
      tests: [{ args: [[1, 1, 1], 2], expected: 2 }, { args: [[1, 2, 3], 3], expected: 2 }, { args: [[1, -1, 0], 0], expected: 3 }, { args: [[3, 4, 7, 2, -3, 1, 4, 2], 7], expected: 4 }, { args: [[1], 0], expected: 0 }],
      hints: ['Running sum S. A subarray ending here sums to k if some earlier prefix equals S - k.', 'Count prefixes in a Map; seed it with {0: 1}.'],
      solution: `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (const x of nums) {
    sum += x;
    count += seen.get(sum - k) || 0;
    seen.set(sum, (seen.get(sum) || 0) + 1);
  }
  return count;
}`, complexity: 'O(n) time, O(n) space' },
    { type: 'code', title: 'Product of array except self', difficulty: 'medium', fn: 'productExceptSelf',
      prompt: 'Return <code>out</code> where out[i] is the product of every element except nums[i]. O(n) time, no division.',
      starter: `function productExceptSelf(nums) {
  
}`,
      tests: [{ args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] }, { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }, { args: [[2, 3]], expected: [3, 2] }],
      hints: ['First pass left to right: out[i] = product of everything before i.', 'Second pass right to left with a running suffix product: out[i] *= suffix.'],
      solution: `function productExceptSelf(nums) {
  const n = nums.length, out = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { out[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }
  return out;
}`, complexity: 'O(n) time, O(1) extra space besides output' },
  ]
});

UNITS.push({
  id: 'stack', title: 'Stacks & monotonic stacks', blurb: 'Matching pairs, undo-style processing, and "next greater element" in O(n).',
  items: [
    { type: 'lesson', title: 'Last in, first out', body: [
      'In JS a stack is just an array with <code>push</code> and <code>pop</code> (both O(1)). Reach for a stack when the most recent unfinished thing must be resolved first: brackets, nested structures, undo, evaluating expressions, DFS.',
      { code: `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else stack.push(ch);
  }
  return stack.length === 0;
}` },
      '<h3>Monotonic stack</h3>Keep the stack sorted (e.g. decreasing). When a new element breaks the order, pop: each popped element has just found its <b>next greater element</b>. Every index is pushed and popped once, so it is O(n).',
      { code: `function nextGreater(nums) {
  const out = new Array(nums.length).fill(-1);
  const stack = []; // indexes, values decreasing
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      out[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return out;
}` },
      { tip: 'Signals: matching brackets, "nested", "evaluate expression", "next greater/smaller", "days until warmer", "span", "largest rectangle". Store indexes on the stack when you need distances.' },
    ]},
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const s = [];
s.push(1); s.push(2); s.push(3);
s.pop();
s.push(4);
console.log(s[s.length - 1], s.length);`, options: ['4 3', '3 3', '4 4', '2 2'], answer: 0, check: true, explain: 'After the pop the stack is [1, 2]; pushing 4 makes [1, 2, 4]. Top is 4, length 3.' },
    { type: 'mcq', kind: 'bug', prompt: 'This bracket checker returns true for "((" . Why?', code: `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else stack.push(ch);
  }
  return true;
}`, options: ['pairs is reversed', 'It never checks that the stack is empty at the end', 'pop() on an empty stack throws', 'The in operator does not work on objects'], answer: 1, explain: 'Unclosed openers stay on the stack. Return <code>stack.length === 0</code>.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity of the monotonic stack nextGreater (nested while inside for)?', code: `for (let i = 0; i < nums.length; i++) {
  while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
    out[stack.pop()] = nums[i];
  }
  stack.push(i);
}`, options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(1)'], answer: 1, explain: 'Each index is pushed once and popped at most once: at most 2n stack operations in total.' },
    { type: 'mcq', kind: 'pattern', prompt: 'For each day, find how many days until a warmer temperature. Best approach?', options: ['For each day scan forward: O(n²)', 'Monotonic decreasing stack of indexes: O(n)', 'Sort temperatures', 'Prefix sums'], answer: 1, explain: 'Classic "next greater element", answered by popping when a warmer day arrives.' },
    { type: 'parsons', title: 'Valid parentheses', prompt: 'Order the lines for the bracket validator.', lines: ['function isValid(s) {', "  const pairs = { ')': '(', ']': '[', '}': '{' };", '  const stack = [];', '  for (const ch of s) {', '    if (ch in pairs) {', '      if (stack.pop() !== pairs[ch]) return false;', '    } else stack.push(ch);', '  }', '  return stack.length === 0;', '}'], distractors: ['  return true;', '      if (stack.shift() !== pairs[ch]) return false;'], explain: 'Push openers; on a closer, pop and confirm it matches; finish with an empty stack.' },
    { type: 'code', title: 'Valid parentheses', difficulty: 'easy', fn: 'isValid',
      prompt: 'Given a string of <code>()[]{}</code>, return true if every bracket is closed by the same type in the correct order.',
      starter: `function isValid(s) {
  
}`,
      tests: [{ args: ['()'], expected: true }, { args: ['()[]{}'], expected: true }, { args: ['(]'], expected: false }, { args: ['([)]'], expected: false }, { args: ['{[]}'], expected: true }, { args: ['(('], expected: false }, { args: [']'], expected: false }],
      hints: ['Push opening brackets.', 'On a closing bracket, the top of the stack must be its matching opener.', 'At the end the stack must be empty.'],
      solution: `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else stack.push(ch);
  }
  return stack.length === 0;
}`, complexity: 'O(n) time, O(n) space' },
    { type: 'code', title: 'Daily temperatures', difficulty: 'medium', fn: 'dailyTemperatures',
      prompt: 'Return <code>answer</code> where answer[i] is the number of days after day i until a warmer temperature, or 0 if none.',
      starter: `function dailyTemperatures(temps) {
  
}`,
      tests: [{ args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] }, { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] }, { args: [[30, 60, 90]], expected: [1, 1, 0] }, { args: [[90, 80, 70]], expected: [0, 0, 0] }],
      hints: ['Keep a stack of indexes whose warmer day has not been found yet.', 'When temps[i] is warmer than the top index, pop it and set answer[top] = i - top. Repeat.'],
      solution: `function dailyTemperatures(temps) {
  const ans = new Array(temps.length).fill(0);
  const stack = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[stack[stack.length - 1]] < temps[i]) {
      const j = stack.pop();
      ans[j] = i - j;
    }
    stack.push(i);
  }
  return ans;
}`, complexity: 'O(n) time, O(n) space' },
    { type: 'code', title: 'Evaluate reverse Polish notation', difficulty: 'medium', fn: 'evalRPN',
      prompt: 'Evaluate tokens in postfix order, e.g. <code>["2","1","+","3","*"]</code> = (2 + 1) × 3. Operators are + - * /, and division truncates toward zero.',
      starter: `function evalRPN(tokens) {
  
}`,
      tests: [{ args: [['2', '1', '+', '3', '*']], expected: 9 }, { args: [['4', '13', '5', '/', '+']], expected: 6 }, { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expected: 22 }, { args: [['7', '-2', '/']], expected: -3 }],
      hints: ['Numbers get pushed.', 'An operator pops b then a (order matters!) and pushes a op b.', 'Use Math.trunc for division.'],
      solution: `function evalRPN(tokens) {
  const st = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = st.pop(), a = st.pop();
      if (t === '+') st.push(a + b);
      else if (t === '-') st.push(a - b);
      else if (t === '*') st.push(a * b);
      else st.push(Math.trunc(a / b));
    } else st.push(Number(t));
  }
  return st.pop();
}`, complexity: 'O(n) time, O(n) space' },
  ]
});

UNITS.push({
  id: 'bsearch', title: 'Binary search', blurb: 'Halve the search space each step: sorted arrays, boundaries, and "search on the answer".',
  items: [
    { type: 'lesson', title: 'One template to rule them all', body: [
      'Binary search works whenever you can ask a yes/no question that is <b>false, false, …, false, true, true, …</b> across the range. Find the first true.',
      { code: `// first index in [lo, hi) where ok(i) is true (hi if none)
function firstTrue(lo, hi, ok) {
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (ok(mid)) hi = mid;   // mid might be the answer; keep it
    else lo = mid + 1;       // mid is not; discard it
  }
  return lo;
}
// lower bound: first index with nums[i] >= target
const idx = firstTrue(0, nums.length, i => nums[i] >= target);` },
      '<h3>Classic exact match</h3>',
      { code: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}` },
      '<h3>Binary search on the answer</h3>When asked for the minimum speed/capacity/time such that something is feasible, and feasibility is monotonic, binary search over the answer value and check feasibility each time: O(n log range).',
      { tip: 'Pitfalls: infinite loops from lo = mid (always use mid + 1 when discarding mid), and mismatched bounds (lo <= hi pairs with hi = mid - 1; lo < hi pairs with hi = mid).' },
    ]},
    { type: 'mcq', kind: 'bug', prompt: 'This loops forever on some inputs. Why?', code: `function firstAtLeast(nums, t) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] >= t) hi = mid;
    else lo = mid;
  }
  return lo;
}`, options: ['mid should round up', 'lo = mid never makes progress when hi = lo + 1; it must be lo = mid + 1', 'hi should start at nums.length - 1', 'It should use lo <= hi'], answer: 1, explain: 'When lo and hi are adjacent, mid = lo; if nums[mid] < t, lo stays the same forever. Discard mid: <code>lo = mid + 1</code>.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity, where n = piles.length and M = max pile?', code: `function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const k = (lo + hi) >> 1;
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    if (hours <= h) hi = k;
    else lo = k + 1;
  }
  return lo;
}`, options: ['O(n log n)', 'O(n log M)', 'O(M)', 'O(n · M)'], answer: 1, explain: 'log M rounds of binary search over speeds, each with an O(n) feasibility check.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const nums = [1, 3, 3, 3, 5, 8];
let lo = 0, hi = nums.length;
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  if (nums[mid] >= 3) hi = mid;
  else lo = mid + 1;
}
console.log(lo);`, options: ['1', '2', '3', '0'], answer: 0, check: true, explain: 'This is lower bound: the first index with value ≥ 3, which is index 1.' },
    { type: 'mcq', kind: 'pattern', prompt: 'A sorted array was rotated (e.g. [4,5,6,7,0,1,2]). Find the minimum in O(log n). What do you compare nums[mid] against?', options: ['nums[0] only', 'nums[hi]: if nums[mid] > nums[hi] the minimum is to the right of mid', 'The target', 'nums[mid - 1] and nums[mid + 1] only'], answer: 1, explain: 'If nums[mid] > nums[hi], the rotation point (minimum) is in (mid, hi]. Otherwise it is in [lo, mid].' },
    { type: 'mcq', kind: 'concept', prompt: 'Which signal suggests "binary search on the answer"?', options: ['The input is a linked list', '"Find the minimum X such that it is possible to …" and bigger X is always at least as feasible', 'You need all permutations', 'The array is unsorted and you need the max'], answer: 1, explain: 'Monotonic feasibility (once possible, always possible for larger values) is exactly what binary search needs.' },
    { type: 'parsons', title: 'Binary search', prompt: 'Order the lines of classic binary search.', lines: ['function search(nums, target) {', '  let lo = 0, hi = nums.length - 1;', '  while (lo <= hi) {', '    const mid = (lo + hi) >> 1;', '    if (nums[mid] === target) return mid;', '    if (nums[mid] < target) lo = mid + 1;', '    else hi = mid - 1;', '  }', '  return -1;', '}'], distractors: ['    if (nums[mid] < target) lo = mid;', '  while (lo < hi - 1) {'], explain: 'Inclusive bounds [lo, hi] pair with lo <= hi and moving past mid on both sides.' },
    { type: 'code', title: 'Binary search', difficulty: 'easy', fn: 'search',
      prompt: 'Return the index of target in the sorted array, or -1. O(log n).',
      starter: `function search(nums, target) {
  
}`,
      tests: [{ args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 }, { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 }, { args: [[5], 5], expected: 0 }, { args: [[], 1], expected: -1 }, { args: [[1, 2], 2], expected: 1 }],
      hints: ['lo = 0, hi = n - 1, loop while lo <= hi.', 'Compare nums[mid] to target and discard half.'],
      solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`, complexity: 'O(log n) time, O(1) space' },
    { type: 'code', title: 'Search insert position', difficulty: 'easy', fn: 'searchInsert',
      prompt: 'Sorted distinct array. Return the index of target, or the index where it would be inserted to keep order.',
      starter: `function searchInsert(nums, target) {
  
}`,
      tests: [{ args: [[1, 3, 5, 6], 5], expected: 2 }, { args: [[1, 3, 5, 6], 2], expected: 1 }, { args: [[1, 3, 5, 6], 7], expected: 4 }, { args: [[1, 3, 5, 6], 0], expected: 0 }, { args: [[], 3], expected: 0 }],
      hints: ['This is exactly lower bound: the first index with nums[i] >= target.', 'Use lo = 0, hi = n (not n - 1) and while (lo < hi).'],
      solution: `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] >= target) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`, complexity: 'O(log n) time, O(1) space' },
    { type: 'code', title: 'Find minimum in rotated sorted array', difficulty: 'medium', fn: 'findMin',
      prompt: 'A sorted array of distinct values was rotated. Return its minimum in O(log n).',
      starter: `function findMin(nums) {
  
}`,
      tests: [{ args: [[3, 4, 5, 1, 2]], expected: 1 }, { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 }, { args: [[11, 13, 15, 17]], expected: 11 }, { args: [[2, 1]], expected: 1 }, { args: [[1]], expected: 1 }],
      hints: ['Compare nums[mid] with nums[hi].', 'If nums[mid] > nums[hi], the min is right of mid: lo = mid + 1. Else hi = mid.'],
      solution: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`, complexity: 'O(log n) time, O(1) space' },
    { type: 'code', title: 'Koko eating bananas', difficulty: 'medium', fn: 'minEatingSpeed',
      prompt: 'Koko eats from one pile per hour at speed k bananas/hour (a pile smaller than k still takes the full hour). Return the minimum integer k that lets her finish all piles within h hours.',
      starter: `function minEatingSpeed(piles, h) {
  
}`,
      tests: [{ args: [[3, 6, 7, 11], 8], expected: 4 }, { args: [[30, 11, 23, 4, 20], 5], expected: 30 }, { args: [[30, 11, 23, 4, 20], 6], expected: 23 }, { args: [[1], 1], expected: 1 }, { args: [[1000000000], 2], expected: 500000000 }],
      hints: ['Answer is between 1 and max(piles).', 'hoursNeeded(k) = sum of Math.ceil(p / k). It only goes down as k grows.', 'Binary search for the first k where hoursNeeded(k) <= h.'],
      solution: `function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const k = Math.floor((lo + hi) / 2);
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    if (hours <= h) hi = k;
    else lo = k + 1;
  }
  return lo;
}`, complexity: 'O(n log M) time, O(1) space' },
  ]
});
