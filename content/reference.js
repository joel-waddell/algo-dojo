window.REFERENCE = {
  signals: [
    ['Sorted array, pair/triplet sum, palindrome, in-place', 'Two pointers', 'twoptr'],
    ['"Have I seen it?", counts, anagrams, grouping, complements', 'Hash map / set', 'hashing'],
    ['Contiguous subarray/substring, longest/shortest window', 'Sliding window', 'window'],
    ['Range sums, "subarray sums to k", except-self', 'Prefix sums', 'prefix'],
    ['Matching brackets, nested, "next greater", undo', 'Stack / monotonic stack', 'stack'],
    ['Sorted + find, "minimum X that works", log n required', 'Binary search', 'bsearch'],
    ['Node pointers, middle, cycle, reverse', 'Linked list pointers', 'linked'],
    ['Hierarchy, subtree answers, per-level', 'Tree DFS / BFS', 'trees'],
    ['Connections, grid regions, fewest steps, dependencies', 'Graph BFS / DFS / topo sort', 'graphs'],
    ['k largest/smallest/closest, repeatedly take min', 'Heap', 'heaps'],
    ['Intervals, schedules, local best choice', 'Sort + greedy', 'greedy'],
    ['All subsets/permutations/combinations, n ≤ 20', 'Backtracking', 'backtrack'],
    ['Count ways, min/max cost, choices depend on earlier ones', 'Dynamic programming', 'dp1'],
    ['Two strings or a grid with min/max/count', '2D dynamic programming', 'dp2'],
  ],
  builtins: [
    ['arr[i], arr.length, push, pop', 'O(1)', 'push is amortized O(1)'],
    ['shift, unshift, splice', 'O(n)', 'Everything after the index moves'],
    ['includes, indexOf, find, findIndex, some, every', 'O(n)', 'Linear scan (stops early when found)'],
    ['map, filter, forEach, reduce', 'O(n)', '× the cost of the callback'],
    ['slice, concat, [...arr], Array.from', 'O(n)', 'Copies'],
    ['sort, toSorted', 'O(n log n)', 'Mutates (sort)! Default compares strings'],
    ['reverse, join, fill, flat', 'O(n)', ''],
    ['Map / Set: get, set, has, add, delete', 'O(1) average', 'Keys compared by value (primitives) or reference (objects)'],
    ['new Set(arr), new Map(entries)', 'O(n)', ''],
    ['Object.keys / values / entries', 'O(n)', 'Builds a new array'],
    ['{ ...obj }', 'O(keys)', 'Inside reduce it becomes O(n²)'],
    ['str[i], str.length', 'O(1)', ''],
    ['str.slice, substring, split, + concat, repeat', 'O(length)', 'Strings are immutable: these build new strings'],
    ['str.includes, indexOf (substring)', 'O(n·m) worst', 'Usually fast in practice'],
    ['JSON.stringify / parse', 'O(size)', ''],
    ['Math.max(...arr)', 'O(n)', 'Can throw on huge arrays (argument limit)'],
  ],
  constraints: [
    ['n ≤ 10', 'O(n!)', 'Permutations'],
    ['n ≤ 20', 'O(2ⁿ)', 'Subsets, bitmasks'],
    ['n ≤ 500', 'O(n³)', 'Triple loops, interval DP'],
    ['n ≤ 5,000', 'O(n²)', 'Double loops, 2D DP'],
    ['n ≤ 10⁶', 'O(n log n) or O(n)', 'Sort, heap, hash, two pointers, window'],
    ['n ≥ 10⁹', 'O(log n) / O(1)', 'Binary search, math'],
  ],
  checklist: [
    ['What is n?', 'Name every size: array length n, second input m, string length, number of nodes, or the numeric value itself.'],
    ['Loops', 'Sequential loops add. Nested loops multiply. Check whether inner bounds depend on n.'],
    ['Halving / doubling', 'i *= 2, n /= 2, mid, lo/hi narrowing → O(log n).'],
    ['Hidden loops', 'includes, indexOf, find, filter, slice, splice, shift, spread, Object.keys, sort, new Set(arr) inside a loop multiply the cost.'],
    ['Pointers that only move forward', 'A while inside a for is still O(n) total if the inner pointer never resets.'],
    ['Recursion', 'branches^depth without memo; states × work-per-state with memo. Stack depth counts as space.'],
    ['Space', 'New arrays, Maps, Sets, strings, and recursion depth that grow with n.'],
    ['Correctness', 'Empty input, single item, duplicates, negatives, off-by-one bounds, mutation of inputs, reference vs copy.'],
  ],
  templates: [
    ['Two pointers (opposite ends)', `let l = 0, r = a.length - 1;
while (l < r) {
  if (good(l, r)) return [l, r];
  if (needBigger) l++; else r--;
}`],
    ['Sliding window (variable)', `let l = 0, best = 0;
for (let r = 0; r < a.length; r++) {
  add(a[r]);
  while (invalid()) remove(a[l++]);
  best = Math.max(best, r - l + 1);
}`],
    ['Prefix sum + map', `const seen = new Map([[0, 1]]);
let sum = 0, count = 0;
for (const x of a) {
  sum += x;
  count += seen.get(sum - k) || 0;
  seen.set(sum, (seen.get(sum) || 0) + 1);
}`],
    ['Monotonic stack', `const st = [];
for (let i = 0; i < a.length; i++) {
  while (st.length && a[st[st.length - 1]] < a[i]) {
    const j = st.pop(); // a[i] is next greater for j
  }
  st.push(i);
}`],
    ['Binary search (first true)', `let lo = 0, hi = n;
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  if (ok(mid)) hi = mid; else lo = mid + 1;
}
return lo;`],
    ['Tree DFS', `function dfs(node) {
  if (!node) return BASE;
  const l = dfs(node.left), r = dfs(node.right);
  return combine(node.val, l, r);
}`],
    ['BFS (queue with head index)', `const q = [start], seen = new Set([start]);
for (let h = 0; h < q.length; h++) {
  const u = q[h];
  for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); q.push(v); }
}`],
    ['Backtracking', `function go(start) {
  out.push([...path]);
  for (let i = start; i < a.length; i++) {
    path.push(a[i]); go(i + 1); path.pop();
  }
}`],
    ['DP (bottom-up)', `const dp = new Array(n + 1).fill(INIT);
dp[0] = BASE;
for (let i = 1; i <= n; i++) {
  dp[i] = best over choices of (dp[smaller] + cost);
}
return dp[n];`],
  ],
};
