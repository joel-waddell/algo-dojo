window.UNITS = window.UNITS || [];
UNITS.push({
  id: 'greedy', title: 'Intervals & greedy', blurb: 'Sort, then make the locally best choice. Merge, schedule, and Kadane\'s max subarray.',
  items: [
    { type: 'lesson', title: 'Sort first, then sweep', body: [
      'Interval problems almost always start with <b>sorting by start</b> (or by end, for scheduling). After sorting, overlaps are only possible between neighbors.',
      { code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of intervals) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e); // overlap: extend
    else out.push([s, e]);
  }
  return out;
}` },
      '<h3>Greedy</h3>A greedy algorithm commits to the best-looking choice at each step and never revisits it. It is correct only when you can argue the local choice never hurts (an "exchange argument"). Classic greedy choices: earliest end time (fit the most meetings), farthest reach (jump game), drop the running sum when it goes negative (Kadane).',
      { code: `function maxSubArray(nums) {      // Kadane's algorithm
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]); // extend or restart
    best = Math.max(best, cur);
  }
  return best;
}` },
      { tip: 'If you cannot convince yourself a greedy choice is safe, try a small counterexample. If one exists, the problem probably needs DP.' },
    ]},
    { type: 'mcq', kind: 'pattern', prompt: 'Maximum number of non-overlapping meetings you can attend. Which greedy rule is correct?', options: ['Pick the shortest meeting first', 'Pick the meeting that starts earliest', 'Pick the meeting that ends earliest', 'Pick the longest meeting first'], answer: 2, explain: 'Ending earliest leaves the most room for the rest. Starting earliest fails on one long meeting that blocks many short ones.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const iv = [[1, 3], [8, 10], [2, 6], [15, 18]];
iv.sort((a, b) => a[0] - b[0]);
const out = [];
for (const [s, e] of iv) {
  const last = out[out.length - 1];
  if (last && s <= last[1]) last[1] = Math.max(last[1], e);
  else out.push([s, e]);
}
console.log(out);`, options: ['[[1,6],[8,10],[15,18]]', '[[1,3],[2,6],[8,10],[15,18]]', '[[1,10],[15,18]]', '[[1,6],[8,18]]'], answer: 0, check: true, explain: '[1,3] and [2,6] overlap → [1,6]. The others do not touch.' },
    { type: 'mcq', kind: 'bug', prompt: 'This Kadane returns 0 for [-3, -1, -2] instead of -1. Why?', code: `function maxSubArray(nums) {
  let cur = 0, best = 0;
  for (const x of nums) {
    cur = Math.max(0, cur + x);
    best = Math.max(best, cur);
  }
  return best;
}`, options: ['It should sort first', 'Starting best at 0 (and clamping cur to 0) assumes an empty subarray is allowed; with all negatives the answer must be the largest element', 'cur should be multiplied', 'The loop is off by one'], answer: 1, explain: 'Initialize both to nums[0] and use <code>cur = Math.max(x, cur + x)</code>.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Merging n intervals as above. Time complexity?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1, explain: 'The sort dominates. The sweep itself is O(n).' },
    { type: 'code', title: 'Maximum subarray', difficulty: 'medium', fn: 'maxSubArray',
      prompt: 'Return the largest sum of any non-empty contiguous subarray.',
      starter: `function maxSubArray(nums) {
  
}`,
      tests: [{ args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 }, { args: [[1]], expected: 1 }, { args: [[5, 4, -1, 7, 8]], expected: 23 }, { args: [[-3, -1, -2]], expected: -1 }],
      hints: ['At each index: either extend the previous subarray or start fresh here.', 'cur = max(x, cur + x); best = max(best, cur).'],
      solution: `function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Merge intervals', difficulty: 'medium', fn: 'merge',
      prompt: 'Merge all overlapping intervals (touching counts as overlapping) and return them sorted by start.',
      starter: `function merge(intervals) {
  
}`,
      tests: [{ args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] }, { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] }, { args: [[[1, 4], [0, 4]]], expected: [[0, 4]] }, { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] }],
      hints: ['Sort by start.', 'If the next start ≤ last end, extend last end to max(last end, next end); else push.'],
      solution: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of intervals) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}`, complexity: 'O(n log n) time, O(n) output' },
    { type: 'code', title: 'Jump game', difficulty: 'medium', fn: 'canJump',
      prompt: 'nums[i] is the max jump length from index i. Starting at index 0, return true if you can reach the last index.',
      starter: `function canJump(nums) {
  
}`,
      tests: [{ args: [[2, 3, 1, 1, 4]], expected: true }, { args: [[3, 2, 1, 0, 4]], expected: false }, { args: [[0]], expected: true }, { args: [[2, 0, 0]], expected: true }, { args: [[1, 0, 1]], expected: false }],
      hints: ['Track the farthest index reachable so far.', 'If i ever exceeds farthest, you are stuck.'],
      solution: `function canJump(nums) {
  let far = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > far) return false;
    far = Math.max(far, i + nums[i]);
  }
  return true;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Non-overlapping intervals', difficulty: 'medium', fn: 'eraseOverlapIntervals',
      prompt: 'Return the minimum number of intervals to remove so the rest do not overlap. Intervals that only touch ([1,2] and [2,3]) do not overlap.',
      starter: `function eraseOverlapIntervals(intervals) {
  
}`,
      tests: [{ args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 }, { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2 }, { args: [[[1, 2], [2, 3]]], expected: 0 }, { args: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expected: 2 }],
      hints: ['Keep as many as possible = classic "earliest end" greedy.', 'Sort by end. Keep an interval if its start ≥ the last kept end; otherwise remove it.'],
      solution: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let end = -Infinity, removed = 0;
  for (const [s, e] of intervals) {
    if (s >= end) end = e;
    else removed++;
  }
  return removed;
}`, complexity: 'O(n log n) time, O(1) extra space' },
  ]
});

UNITS.push({
  id: 'backtrack', title: 'Backtracking', blurb: 'Generate every subset, permutation, or combination with choose, explore, un-choose.',
  items: [
    { type: 'lesson', title: 'Choose, explore, un-choose', body: [
      'Backtracking builds candidates one decision at a time and undoes each decision after exploring it. It is DFS over a tree of choices.',
      { code: `function subsets(nums) {
  const out = [], path = [];
  function go(i) {
    if (i === nums.length) { out.push([...path]); return; } // copy!
    path.push(nums[i]);   // choose: include nums[i]
    go(i + 1);            // explore
    path.pop();           // un-choose
    go(i + 1);            // explore: exclude nums[i]
  }
  go(0);
  return out;
}` },
      '<h3>Permutations: track what is used</h3>',
      { code: `function permute(nums) {
  const out = [], path = [], used = new Array(nums.length).fill(false);
  function go() {
    if (path.length === nums.length) { out.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      go();
      path.pop(); used[i] = false;
    }
  }
  go();
  return out;
}` },
      '<b>Cost:</b> subsets O(n·2ⁿ), permutations O(n·n!). That is why these problems have tiny constraints (n ≤ 10 to 20). <b>Pruning</b> (stop early when a partial path can never work) is what makes them fast in practice.',
      { tip: 'The #1 bug: pushing path itself instead of a copy. Every saved answer ends up as the same (empty) array.' },
    ]},
    { type: 'mcq', kind: 'bug', prompt: 'This returns [[], [], [], [], [], [], [], []] for [1,2,3]. Why?', code: `function subsets(nums) {
  const out = [], path = [];
  function go(i) {
    if (i === nums.length) { out.push(path); return; }
    path.push(nums[i]); go(i + 1); path.pop();
    go(i + 1);
  }
  go(0);
  return out;
}`, options: ['The base case is wrong', 'It pushes the same path array each time, which ends empty after all pops; push a copy [...path]', 'It should use a Set', 'go(i + 1) is called too many times'], answer: 1, explain: 'Arrays are references. All 8 entries point at one array, which is empty at the end.' },
    { type: 'mcq', kind: 'complexity', prompt: 'How many results does permute return for n distinct numbers, and so what is the minimum time?', options: ['2ⁿ results, O(2ⁿ)', 'n! results, at least O(n · n!) to write them', 'n² results, O(n²)', 'n results, O(n)'], answer: 1, explain: 'There are n! orderings, each n long to copy.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const out = [];
function go(open, close, s, n) {
  if (s.length === 2 * n) { out.push(s); return; }
  if (open < n) go(open + 1, close, s + '(', n);
  if (close < open) go(open, close + 1, s + ')', n);
}
go(0, 0, '', 2);
console.log(out);`, options: ['["(())","()()"]', '["()()","(())"]', '["(())","()()","())("]', '["()"]'], answer: 0, check: true, explain: 'It tries "(" first, so "(())" is found before "()()". The close < open rule prunes invalid strings.' },
    { type: 'mcq', kind: 'pattern', prompt: 'Find all combinations of candidates (reusable) that sum to a target. How do you avoid duplicates like [2,3] and [3,2]?', options: ['Sort the output and dedupe with a Set of strings', 'Pass a start index so each level only picks candidates at index ≥ start', 'Use BFS', 'Use a heap'], answer: 1, explain: 'Choosing in non-decreasing index order generates each combination exactly once. Passing i (not i + 1) allows reuse.' },
    { type: 'parsons', title: 'Subsets', prompt: 'Order the lines of the include/exclude subsets generator.', lines: ['function subsets(nums) {', '  const out = [], path = [];', '  function go(i) {', '    if (i === nums.length) { out.push([...path]); return; }', '    path.push(nums[i]);', '    go(i + 1);', '    path.pop();', '    go(i + 1);', '  }', '  go(0);', '  return out;', '}'], distractors: ['    if (i === nums.length) { out.push(path); return; }', '    go(i);'], explain: 'Include, recurse, undo, then recurse again without it.' },
    { type: 'code', title: 'Subsets', difficulty: 'medium', fn: 'subsets',
      prompt: 'Return all subsets (the power set) of distinct integers, in any order.',
      starter: `function subsets(nums) {
  
}`,
      tests: [{ args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] }, { args: [[0]], expected: [[], [0]] }, { args: [[]], expected: [[]] }],
      compare: 'unorderedDeep',
      hints: ['For each index decide: include it or not.', 'Record a copy of the path when i reaches nums.length.'],
      solution: `function subsets(nums) {
  const out = [], path = [];
  function go(i) {
    if (i === nums.length) { out.push([...path]); return; }
    path.push(nums[i]);
    go(i + 1);
    path.pop();
    go(i + 1);
  }
  go(0);
  return out;
}`, complexity: 'O(n · 2ⁿ) time and output' },
    { type: 'code', title: 'Permutations', difficulty: 'medium', fn: 'permute',
      prompt: 'Return all orderings of distinct integers, in any order.',
      starter: `function permute(nums) {
  
}`,
      tests: [{ args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] }, { args: [[0, 1]], expected: [[0, 1], [1, 0]] }, { args: [[1]], expected: [[1]] }],
      compare: 'unordered',
      hints: ['Keep a used[] array.', 'At each level, try every unused number: mark, recurse, unmark.'],
      solution: `function permute(nums) {
  const out = [], path = [], used = new Array(nums.length).fill(false);
  function go() {
    if (path.length === nums.length) { out.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      go();
      path.pop(); used[i] = false;
    }
  }
  go();
  return out;
}`, complexity: 'O(n · n!) time' },
    { type: 'code', title: 'Combination sum', difficulty: 'medium', fn: 'combinationSum',
      prompt: 'Distinct positive candidates may each be used unlimited times. Return all unique combinations that sum to target, in any order.',
      starter: `function combinationSum(candidates, target) {
  
}`,
      tests: [{ args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] }, { args: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] }, { args: [[2], 1], expected: [] }],
      compare: 'unorderedDeep',
      hints: ['go(start, remaining): loop i from start; recurse with go(i, remaining - c[i]) to allow reuse.', 'Stop when remaining is 0 (record) or negative (prune). Sorting lets you break early.'],
      solution: `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const out = [], path = [];
  function go(start, rem) {
    if (rem === 0) { out.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > rem) break;
      path.push(candidates[i]);
      go(i, rem - candidates[i]);
      path.pop();
    }
  }
  go(0, target);
  return out;
}`, complexity: 'Exponential in target / min candidate' },
    { type: 'code', title: 'Generate parentheses', difficulty: 'medium', fn: 'generateParenthesis',
      prompt: 'Return all well-formed strings of n pairs of parentheses, in any order.',
      starter: `function generateParenthesis(n) {
  
}`,
      tests: [{ args: [3], expected: ['((()))', '(()())', '(())()', '()(())', '()()()'] }, { args: [1], expected: ['()'] }, { args: [2], expected: ['(())', '()()'] }],
      compare: 'unordered',
      hints: ['Track how many "(" and ")" you have used.', 'You may add "(" if open < n, and ")" if close < open.'],
      solution: `function generateParenthesis(n) {
  const out = [];
  function go(open, close, s) {
    if (s.length === 2 * n) { out.push(s); return; }
    if (open < n) go(open + 1, close, s + '(');
    if (close < open) go(open, close + 1, s + ')');
  }
  go(0, 0, '');
  return out;
}`, complexity: 'O(4ⁿ / √n) results (Catalan numbers)' },
  ]
});

UNITS.push({
  id: 'dp1', title: 'Dynamic programming I', blurb: 'Recursion + memo = DP. Define the state, the transition, and the base case.',
  items: [
    { type: 'lesson', title: 'From brute force to DP in three steps', body: [
      'DP applies when a problem breaks into <b>overlapping subproblems</b> (the same smaller question is asked many times) with <b>optimal substructure</b> (the best answer is built from best sub-answers).',
      '<h3>Step 1: write the recursion</h3>Define <code>f(i)</code> in words: "the number of ways to reach step i". Write how it depends on smaller i.',
      { code: `// climbing stairs: 1 or 2 steps at a time
function ways(i) {
  if (i <= 1) return 1;
  return ways(i - 1) + ways(i - 2); // O(2ⁿ)
}` },
      '<h3>Step 2: memoize (top-down)</h3>',
      { code: `function climbStairs(n, memo = new Map()) {
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n);
  const v = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
  memo.set(n, v);
  return v;                        // O(n)
}` },
      '<h3>Step 3: tabulate (bottom-up), then shrink space</h3>',
      { code: `function climbStairs(n) {
  let a = 1, b = 1;               // ways(0), ways(1)
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;                        // O(n) time, O(1) space
}` },
      '<b>House Robber shape:</b> at each house, either skip it (keep best so far) or rob it (best from two back + this house): <code>dp[i] = max(dp[i-1], dp[i-2] + nums[i])</code>.',
      { tip: 'Signals: "number of ways", "minimum cost/coins/steps", "maximum value", "can you reach/form", and choices that depend on earlier choices. Complexity = (number of states) × (work per state).' },
    ]},
    { type: 'mcq', kind: 'concept', prompt: 'Why does memoizing fib turn O(2ⁿ) into O(n)?', options: ['Map lookups are faster than recursion', 'There are only n distinct subproblems; each is computed once and reused', 'It removes the base case', 'It switches to iteration'], answer: 1, explain: 'Without memo, fib(n-2) is recomputed inside fib(n-1), and so on. DP cost = states × work per state = n × O(1).' },
    { type: 'mcq', kind: 'complexity', prompt: 'Coin change DP: dp[a] = min over coins c of dp[a - c] + 1, for a from 1 to amount. Complexity with k coins?', options: ['O(amount)', 'O(amount × k)', 'O(k^amount)', 'O(amount²)'], answer: 1, explain: '(amount) states, each trying k coins.' },
    { type: 'mcq', kind: 'pattern', prompt: 'Coins [1, 3, 4], amount 6. A greedy "take the biggest coin" gives 4+1+1 (3 coins). Why do we need DP?', options: ['Greedy is too slow', 'Greedy is not always optimal: 3+3 uses only 2 coins; DP tries every last-coin choice', 'DP uses less memory', 'Greedy cannot handle the coin 1'], answer: 1, explain: 'This counterexample is the classic sign that you need DP instead of greedy.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `function rob(nums) {
  let prev = 0, cur = 0;
  for (const x of nums) [prev, cur] = [cur, Math.max(cur, prev + x)];
  return cur;
}
console.log(rob([2, 7, 9, 3, 1]));`, options: ['12', '11', '10', '19'], answer: 0, check: true, explain: 'Rob houses with 2, 9, 1 = 12. Adjacent houses cannot both be robbed.' },
    { type: 'mcq', kind: 'bug', prompt: 'This memoized function is still exponential. Why?', code: `function countWays(n) {
  const memo = new Map();
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n);
  const v = countWays(n - 1) + countWays(n - 2);
  memo.set(n, v);
  return v;
}`, options: ['The base case is wrong', 'A new empty memo is created on every call, so nothing is ever reused', 'Map cannot hold numbers', 'It should use an object'], answer: 1, explain: 'The cache must be shared: define it outside, or pass it down as a parameter.' },
    { type: 'parsons', title: 'Climbing stairs (O(1) space)', prompt: 'Order the lines of bottom-up climbing stairs.', lines: ['function climbStairs(n) {', '  let a = 1, b = 1;', '  for (let i = 2; i <= n; i++) {', '    [a, b] = [b, a + b];', '  }', '  return b;', '}'], distractors: ['    [a, b] = [a + b, a];', '  return a + b;'], explain: 'a and b hold ways(i-2) and ways(i-1); slide them forward.' },
    { type: 'code', title: 'Climbing stairs', difficulty: 'easy', fn: 'climbStairs',
      prompt: 'You can climb 1 or 2 steps at a time. How many distinct ways to reach step n?',
      starter: `function climbStairs(n) {
  
}`,
      tests: [{ args: [2], expected: 2 }, { args: [3], expected: 3 }, { args: [1], expected: 1 }, { args: [10], expected: 89 }, { args: [45], expected: 1836311903, hidden: true }],
      hints: ['ways(n) = ways(n-1) + ways(n-2).', 'Plain recursion will time out at n = 45. Memoize or iterate.'],
      solution: `function climbStairs(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'House robber', difficulty: 'medium', fn: 'rob',
      prompt: 'Each house has some money. You cannot rob two adjacent houses. Return the maximum you can rob.',
      starter: `function rob(nums) {
  
}`,
      tests: [{ args: [[1, 2, 3, 1]], expected: 4 }, { args: [[2, 7, 9, 3, 1]], expected: 12 }, { args: [[5]], expected: 5 }, { args: [[2, 1, 1, 2]], expected: 4 }, { args: [[]], expected: 0 }],
      hints: ['best(i) = max(best(i-1), best(i-2) + nums[i]).', 'Two variables are enough.'],
      solution: `function rob(nums) {
  let prev = 0, cur = 0;
  for (const x of nums) [prev, cur] = [cur, Math.max(cur, prev + x)];
  return cur;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Coin change', difficulty: 'medium', fn: 'coinChange',
      prompt: 'Return the fewest coins needed to make <code>amount</code> (unlimited coins of each value), or -1 if impossible.',
      starter: `function coinChange(coins, amount) {
  
}`,
      tests: [{ args: [[1, 2, 5], 11], expected: 3 }, { args: [[2], 3], expected: -1 }, { args: [[1], 0], expected: 0 }, { args: [[1, 3, 4], 6], expected: 2 }, { args: [[186, 419, 83, 408], 6249], expected: 20 }],
      hints: ['dp[a] = fewest coins for amount a. dp[0] = 0, others start at Infinity.', 'For each a, for each coin c ≤ a: dp[a] = min(dp[a], dp[a - c] + 1).'],
      solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`, complexity: 'O(amount × k) time, O(amount) space' },
    { type: 'code', title: 'Longest increasing subsequence', difficulty: 'medium', fn: 'lengthOfLIS',
      prompt: 'Return the length of the longest strictly increasing subsequence (elements need not be adjacent).',
      starter: `function lengthOfLIS(nums) {
  
}`,
      tests: [{ args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 }, { args: [[0, 1, 0, 3, 2, 3]], expected: 4 }, { args: [[7, 7, 7, 7]], expected: 1 }, { args: [[4, 10, 4, 3, 8, 9]], expected: 3 }],
      hints: ['dp[i] = length of the LIS that ends at index i.', 'dp[i] = 1 + max(dp[j]) over j < i with nums[j] < nums[i]. O(n²) is fine here.', 'Bonus: an O(n log n) version keeps a "tails" array and binary-searches it.'],
      solution: `function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}`, complexity: 'O(n²) time, O(n) space' },
    { type: 'code', title: 'Word break', difficulty: 'medium', fn: 'wordBreak',
      prompt: 'Return true if s can be split into a sequence of one or more dictionary words (words may be reused).',
      starter: `function wordBreak(s, wordDict) {
  
}`,
      tests: [{ args: ['leetcode', ['leet', 'code']], expected: true }, { args: ['applepenapple', ['apple', 'pen']], expected: true }, { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false }, { args: ['aaaaaaaaaaaaaaaaaaaaaaaaaaaaab', ['a', 'aa', 'aaa', 'aaaa']], expected: false, hidden: true }],
      hints: ['dp[i] = can the first i characters be split?', 'dp[0] = true. dp[i] is true if some j < i has dp[j] and s.slice(j, i) in a Set of words.'],
      solution: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}`, complexity: 'O(n³) worst case with slicing (n² states/checks × O(n) slice), O(n) space' },
  ]
});

UNITS.push({
  id: 'dp2', title: 'Dynamic programming II', blurb: 'Grids and two strings: 2D tables for paths, LCS, edit distance, and knapsack.',
  items: [
    { type: 'lesson', title: '2D state', body: [
      'When the state needs two numbers (row and column, or a position in each of two strings), use a 2D table: <code>dp[i][j]</code>.',
      '<h3>Grid paths</h3>',
      { code: `function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1]; // from above + from left
  return dp[m - 1][n - 1];
}` },
      '<h3>Two strings</h3><code>dp[i][j]</code> = answer for the first i chars of a and first j chars of b. Compare the last characters: if they match, extend <code>dp[i-1][j-1]</code>; otherwise take the best of dropping one char from either side.',
      { code: `function lcs(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}` },
      '<h3>0/1 knapsack</h3>Each item is used at most once. With a 1D array, loop capacity <b>downward</b> so an item is not reused in the same round.',
      { tip: 'Use a (length + 1) table so row/column 0 mean "empty prefix" and base cases fall out naturally. Space can usually be cut to one or two rows.' },
    ]},
    { type: 'mcq', kind: 'complexity', prompt: 'LCS of strings with lengths n and m via the 2D table. Time and space?', options: ['O(n + m) time, O(1) space', 'O(n · m) time, O(n · m) space', 'O(2^(n+m)) time', 'O(n log m) time'], answer: 1, explain: 'One O(1) cell per pair (i, j). Space can be reduced to O(min(n, m)) with two rows.' },
    { type: 'mcq', kind: 'output', prompt: 'What does this print?', code: `const m = 3, n = 3;
const dp = Array.from({ length: m }, () => new Array(n).fill(1));
for (let r = 1; r < m; r++)
  for (let c = 1; c < n; c++)
    dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
console.log(dp[2][2]);`, options: ['4', '6', '9', '3'], answer: 1, check: true, explain: 'Table: [1,1,1],[1,2,3],[1,3,6]. Six right/down paths in a 3×3 grid.' },
    { type: 'mcq', kind: 'bug', prompt: 'In 1D 0/1 knapsack, why must the capacity loop go downward?', code: `for (const w of weights) {
  for (let cap = w; cap <= target; cap++) {   // upward!
    dp[cap] = dp[cap] || dp[cap - w];
  }
}`, options: ['Upward is slower', 'Going upward lets dp[cap - w] already include this same item, so it gets reused (that becomes unbounded knapsack)', 'It causes an index error', 'There is no difference'], answer: 1, explain: 'Iterating cap from high to low guarantees dp[cap - w] still reflects the previous round (items before this one).' },
    { type: 'mcq', kind: 'pattern', prompt: 'Minimum insertions, deletions, and replacements to turn word1 into word2. Which DP?', options: ['1D over word1', 'Edit distance: dp[i][j] over prefixes of both words', 'Knapsack', 'Greedy character matching'], answer: 1, explain: 'Two strings → 2D prefix table. If the last chars match, dp[i-1][j-1]; else 1 + min(insert, delete, replace).' },
    { type: 'code', title: 'Unique paths', difficulty: 'medium', fn: 'uniquePaths',
      prompt: 'A robot in an m × n grid moves only right or down from the top-left to the bottom-right. How many unique paths?',
      starter: `function uniquePaths(m, n) {
  
}`,
      tests: [{ args: [3, 7], expected: 28 }, { args: [3, 2], expected: 3 }, { args: [1, 1], expected: 1 }, { args: [10, 10], expected: 48620 }],
      hints: ['The first row and first column each have exactly one path.', 'dp[r][c] = dp[r-1][c] + dp[r][c-1].'],
      solution: `function uniquePaths(m, n) {
  const row = new Array(n).fill(1);
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++) row[c] += row[c - 1];
  return row[n - 1];
}`, complexity: 'O(m·n) time, O(n) space' },
    { type: 'code', title: 'Longest common subsequence', difficulty: 'medium', fn: 'longestCommonSubsequence',
      prompt: 'Return the length of the longest subsequence common to both strings.',
      starter: `function longestCommonSubsequence(a, b) {
  
}`,
      tests: [{ args: ['abcde', 'ace'], expected: 3 }, { args: ['abc', 'abc'], expected: 3 }, { args: ['abc', 'def'], expected: 0 }, { args: ['bsbininm', 'jmjkbkjkv'], expected: 1 }],
      hints: ['(len+1) × (len+1) table of zeros.', 'Match: dp[i-1][j-1] + 1. Else: max(dp[i-1][j], dp[i][j-1]).'],
      solution: `function longestCommonSubsequence(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}`, complexity: 'O(n·m) time and space' },
    { type: 'code', title: 'Edit distance', difficulty: 'hard', fn: 'minDistance',
      prompt: 'Return the minimum number of single-character inserts, deletes, or replacements to turn word1 into word2.',
      starter: `function minDistance(word1, word2) {
  
}`,
      tests: [{ args: ['horse', 'ros'], expected: 3 }, { args: ['intention', 'execution'], expected: 5 }, { args: ['', 'abc'], expected: 3 }, { args: ['abc', 'abc'], expected: 0 }],
      hints: ['dp[i][0] = i (delete everything), dp[0][j] = j (insert everything).', 'If chars match: dp[i-1][j-1]. Else 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)).'],
      solution: `function minDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => {
    const row = new Array(b.length + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[a.length][b.length];
}`, complexity: 'O(n·m) time and space' },
    { type: 'code', title: 'Partition equal subset sum', difficulty: 'medium', fn: 'canPartition',
      prompt: 'Return true if the array can be split into two subsets with equal sums.',
      starter: `function canPartition(nums) {
  
}`,
      tests: [{ args: [[1, 5, 11, 5]], expected: true }, { args: [[1, 2, 3, 5]], expected: false }, { args: [[2, 2]], expected: true }, { args: [[1]], expected: false }, { args: [[3, 3, 3, 4, 5]], expected: true }],
      hints: ['If the total is odd, impossible. Otherwise target = total / 2.', '0/1 knapsack: dp[s] = can some subset sum to s. dp[0] = true.', 'For each num, loop s from target down to num: dp[s] ||= dp[s - num].'],
      solution: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of nums)
    for (let s = target; s >= x; s--) dp[s] = dp[s] || dp[s - x];
  return dp[target];
}`, complexity: 'O(n · sum) time, O(sum) space' },
  ]
});

UNITS.push({
  id: 'realjs', title: 'Capstone: reviewing real JS', blurb: 'Apply every pattern to production-style JavaScript: spot hidden costs, bugs, and the fix.',
  items: [
    { type: 'lesson', title: 'Code review with an algorithms eye', body: [
      'Everything in this course shows up in everyday JavaScript, just without the LeetCode labels. When you read a function, run the checklist: <b>what is n, what loops (including hidden ones), what grows in memory, and what pattern would make it simpler?</b>',
      '<h3>Common smells and their fixes</h3><table><tr><th>Smell</th><th>Cost</th><th>Fix</th></tr><tr><td><code>find</code>/<code>includes</code>/<code>filter</code> inside <code>map</code>/loop</td><td>O(n·m)</td><td>Build a Map/Set once</td></tr><tr><td><code>arr.filter((x, i) => arr.indexOf(x) === i)</code></td><td>O(n²)</td><td><code>[...new Set(arr)]</code></td></tr><tr><td><code>reduce</code> with <code>[...acc, x]</code> or <code>{...acc}</code></td><td>O(n²)</td><td>Mutate the accumulator, or push</td></tr><tr><td><code>queue.shift()</code> in a loop</td><td>O(n²)</td><td>Head index</td></tr><tr><td><code>sort</code> inside a loop</td><td>O(n² log n)</td><td>Sort once, or use a heap</td></tr><tr><td>Recursive calls repeating work</td><td>exponential</td><td>Memoize</td></tr><tr><td>Deep recursion on user data</td><td>stack overflow</td><td>Iterative with an explicit stack</td></tr></table>',
      { tip: 'Use the Lab tab: paste any function, and it flags hidden loops and estimates complexity, then times it at growing n to confirm.' },
    ]},
    { type: 'mcq', kind: 'complexity', prompt: 'A React-style helper. Time complexity with n orders and m users?', code: `function attachUsers(orders, users) {
  return orders.map(o => ({
    ...o,
    user: users.find(u => u.id === o.userId),
  }));
}`, options: ['O(n)', 'O(n + m)', 'O(n · m)', 'O(n log m)'], answer: 2, explain: '<code>find</code> scans users for every order. Build <code>new Map(users.map(u => [u.id, u]))</code> first for O(n + m).' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity of this very common dedupe?', code: `const unique = items.filter((x, i) => items.indexOf(x) === i);`, options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 2, explain: 'indexOf is O(n), called n times. <code>[...new Set(items)]</code> is O(n) and keeps first-occurrence order too.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity of this "pretty" reduce?', code: `const byId = list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});`, options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 2, explain: 'Each step copies every key so far into a new object: 1 + 2 + … + n = O(n²). Write <code>acc[item.id] = item; return acc;</code> or use <code>Object.fromEntries</code> / a Map.' },
    { type: 'mcq', kind: 'bug', prompt: 'This helper should return the top 3 scores without changing the input. What is wrong?', code: `function top3(scores) {
  return scores.sort((a, b) => b - a).slice(0, 3);
}`, options: ['slice(0, 3) returns 4 items', 'sort mutates the caller\'s array; copy first ([...scores].sort or toSorted)', 'The comparator sorts ascending', 'Nothing'], answer: 1, explain: 'Array.prototype.sort sorts in place. Callers who reuse scores will see it reordered. Also: for big n and small k, a size-k heap is O(n log k).' },
    { type: 'mcq', kind: 'pattern', prompt: 'You need to check whether a user-typed string has balanced (), [], {} before sending it to an API. Which structure?', options: ['Hash set', 'Stack', 'Queue', 'Heap'], answer: 1, explain: 'Matching nested pairs is the stack pattern from Unit 7.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity in terms of n = total number of nested values?', code: `function flatten(arr) {
  let out = [];
  for (const x of arr) {
    out = out.concat(Array.isArray(x) ? flatten(x) : [x]);
  }
  return out;
}`, options: ['O(n)', 'O(n log n)', 'O(n²) in the worst case', 'O(2ⁿ)'], answer: 2, explain: '<code>concat</code> copies the whole growing output each time. Pushing into one shared array (or <code>arr.flat(Infinity)</code>) is O(n).' },
    { type: 'mcq', kind: 'bug', prompt: 'This memoize helper returns wrong results for different arguments. Why?', code: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    if (cache.has(args)) return cache.get(args);
    const v = fn(...args);
    cache.set(args, v);
    return v;
  };
}`, options: ['Maps cannot hold arrays', 'args is a new array on every call, so cache.has(args) is never true (it compares by reference); key by JSON.stringify(args) or a primitive', 'It should use a WeakMap', 'fn is called twice'], answer: 1, explain: 'It never returns wrong values, but it never hits the cache either (and leaks memory). Keys must be values that compare equal, like a string.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Time complexity, n = items.length?', code: `function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}`, options: ['O(n)', 'O(n · size)', 'O(n²)', 'O(n / size)'], answer: 0, explain: 'The loop runs n/size times and each slice copies size items: (n/size) × size = O(n). Not every slice-in-a-loop is quadratic; count total elements copied.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Space complexity of this deep clone for a tree-shaped object with n nodes and depth d?', code: `function deepClone(x) {
  if (x === null || typeof x !== 'object') return x;
  const out = Array.isArray(x) ? [] : {};
  for (const k of Object.keys(x)) out[k] = deepClone(x[k]);
  return out;
}`, options: ['O(1)', 'O(d)', 'O(n) for the copy plus O(d) call stack', 'O(n²)'], answer: 2, explain: 'It builds a full copy (O(n)) and recursion goes d levels deep. Note: it also loops forever on circular references; structuredClone handles those.' },
    { type: 'mcq', kind: 'pattern', prompt: 'A log viewer must show the 50 slowest requests from a stream of millions, using little memory. Approach?', options: ['Sort everything', 'Size-50 min-heap keyed by duration', 'Two pointers', 'Binary search'], answer: 1, explain: 'Top-K with a heap: O(n log 50) time and O(50) memory.' },
    { type: 'code', title: 'Fix: attach users to orders', difficulty: 'medium', fn: 'attachUsers',
      prompt: 'Return a new array where each order gets a <code>userName</code> field: the name of the user whose <code>id</code> equals <code>order.userId</code> (or <code>null</code> if none). The starter is O(n·m) and times out on the big hidden test. Make it O(n + m) and keep the original order.',
      starter: `function attachUsers(orders, users) {
  return orders.map(o => {
    const u = users.find(u => u.id === o.userId);
    return { ...o, userName: u ? u.name : null };
  });
}`,
      tests: [
        { args: [[{ id: 1, userId: 7 }, { id: 2, userId: 9 }], [{ id: 7, name: 'Ana' }, { id: 9, name: 'Bo' }]], expected: [{ id: 1, userId: 7, userName: 'Ana' }, { id: 2, userId: 9, userName: 'Bo' }] },
        { args: [[{ id: 1, userId: 3 }], [{ id: 7, name: 'Ana' }]], expected: [{ id: 1, userId: 3, userName: null }] },
        { args: [[], []], expected: [] },
        { big: 'orders', n: 80000, hidden: true },
      ],
      hints: ['Build a Map from user id to user once.', 'Then map over orders and look each one up in O(1).'],
      solution: `function attachUsers(orders, users) {
  const byId = new Map(users.map(u => [u.id, u]));
  return orders.map(o => {
    const u = byId.get(o.userId);
    return { ...o, userName: u ? u.name : null };
  });
}`, complexity: 'O(n + m) time, O(m) extra space' },
    { type: 'code', title: 'Fix: dedupe by key', difficulty: 'easy', fn: 'uniqueBy',
      prompt: 'Return the items with duplicate <code>item[key]</code> values removed, keeping the <b>first</b> occurrence and the original order. Must be O(n).',
      starter: `function uniqueBy(items, key) {
  return items.filter((x, i) => items.findIndex(y => y[key] === x[key]) === i);
}`,
      tests: [
        { args: [[{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }], 'id'], expected: [{ id: 1, v: 'a' }, { id: 2, v: 'b' }] },
        { args: [[{ t: 'x' }, { t: 'x' }, { t: 'y' }], 't'], expected: [{ t: 'x' }, { t: 'y' }] },
        { args: [[], 'id'], expected: [] },
        { big: 'uniqueBy', n: 100000, hidden: true },
      ],
      hints: ['Track seen key values in a Set.', 'filter: keep x only if its key was not seen; then add it.'],
      solution: `function uniqueBy(items, key) {
  const seen = new Set();
  return items.filter(x => {
    if (seen.has(x[key])) return false;
    seen.add(x[key]);
    return true;
  });
}`, complexity: 'O(n) time, O(n) space' },
  ]
});
