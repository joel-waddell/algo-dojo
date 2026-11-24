window.UNITS = window.UNITS || [];
UNITS.push({
  id: 'linked', title: 'Linked lists', blurb: 'Pointer surgery: dummy heads, reversal, and fast/slow pointers.',
  items: [
    { type: 'lesson', title: 'Nodes and pointers', body: [
      'A linked list is nodes that point to the next node. In these exercises (and on LeetCode) you get a <code>ListNode</code> class:',
      { code: `class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}
// Tests show lists as arrays: [1,2,3] means 1 -> 2 -> 3 -> null` },
      '<h3>Three moves cover most problems</h3><b>1. Dummy head:</b> start a new list with a placeholder node so you never special-case the first node.',
      { code: `const dummy = new ListNode();
let tail = dummy;
// tail.next = someNode; tail = tail.next;
return dummy.next;` },
      '<b>2. Reverse in place</b> with three pointers.',
      { code: `let prev = null, cur = head;
while (cur) {
  const next = cur.next; // save
  cur.next = prev;       // flip
  prev = cur;            // advance
  cur = next;
}
return prev;` },
      '<b>3. Fast and slow pointers:</b> fast moves 2, slow moves 1. When fast hits the end, slow is at the middle. If there is a cycle, they meet.',
      { code: `let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  // if (slow === fast) there is a cycle
}` },
      { tip: 'Draw boxes and arrows. Before writing cur.next = …, ask "will I lose the rest of the list?" If yes, save it first.' },
    ]},
    { type: 'mcq', kind: 'bug', prompt: 'This reversal loses most of the list. What is missing?', code: `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    cur.next = prev;
    prev = cur;
    cur = cur.next;
  }
  return prev;
}`, options: ['prev should start as head', 'cur.next is overwritten before being saved, so cur = cur.next moves backward to prev', 'It should return cur', 'The loop should be while (cur.next)'], answer: 1, explain: 'After <code>cur.next = prev</code>, <code>cur.next</code> no longer points forward. Save it first: <code>const next = cur.next;</code>.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Space complexity of the iterative reversal (prev/cur/next pointers)?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], answer: 1, explain: 'Only three pointers, regardless of length. A recursive reversal would use O(n) call stack.' },
    { type: 'mcq', kind: 'pattern', prompt: 'Detect whether a linked list has a cycle using O(1) memory. Approach?', options: ['Store visited nodes in a Set', 'Fast and slow pointers (Floyd): if they ever meet, there is a cycle', 'Reverse the list', 'Count nodes until null'], answer: 1, explain: 'A Set works but is O(n) memory. Inside a cycle the fast pointer gains one step per move and must land on slow.' },
    { type: 'mcq', kind: 'pattern', prompt: 'Remove the nth node from the end in one pass. Trick?', options: ['Count the length first', 'Move a lead pointer n steps ahead, then move both until lead hits the end; start both from a dummy node', 'Use a stack', 'Recursion only'], answer: 1, explain: 'The gap of n nodes means the trailing pointer stops right before the node to delete. The dummy handles removing the head.' },
    { type: 'parsons', title: 'Reverse a linked list', prompt: 'Order the lines to reverse a list in place.', lines: ['function reverseList(head) {', '  let prev = null, cur = head;', '  while (cur) {', '    const next = cur.next;', '    cur.next = prev;', '    prev = cur;', '    cur = next;', '  }', '  return prev;', '}'], distractors: ['    cur = cur.next;', '  return head;'], explain: 'Save, flip, advance, advance. At the end prev is the new head.' },
    { type: 'code', title: 'Reverse linked list', difficulty: 'easy', fn: 'reverseList', argTypes: ['list'], returnType: 'list',
      prompt: 'Reverse a singly linked list and return the new head. Input [1,2,3] means 1 → 2 → 3.',
      starter: `/* class ListNode { val; next } is available */
function reverseList(head) {
  
}`,
      tests: [{ args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] }, { args: [[1, 2]], expected: [2, 1] }, { args: [[]], expected: [] }, { args: [[7]], expected: [7] }],
      hints: ['Keep prev (starts null) and cur (starts head).', 'Each step: save next, point cur.next at prev, shift prev and cur forward.'],
      solution: `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Merge two sorted lists', difficulty: 'easy', fn: 'mergeTwoLists', argTypes: ['list', 'list'], returnType: 'list',
      prompt: 'Merge two sorted linked lists into one sorted list and return its head.',
      starter: `function mergeTwoLists(a, b) {
  
}`,
      tests: [{ args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] }, { args: [[], []], expected: [] }, { args: [[], [0]], expected: [0] }, { args: [[5], [1, 2, 3]], expected: [1, 2, 3, 5] }],
      hints: ['Use a dummy node and a tail pointer.', 'Attach the smaller head, advance that list. When one runs out, attach the rest of the other.'],
      solution: `function mergeTwoLists(a, b) {
  const dummy = new ListNode();
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}`, complexity: 'O(n + m) time, O(1) space' },
    { type: 'code', title: 'Middle of the linked list', difficulty: 'easy', fn: 'middleNode', argTypes: ['list'], returnType: 'list',
      prompt: 'Return the middle node (the second middle if the length is even). The test shows the list from that node onward.',
      starter: `function middleNode(head) {
  
}`,
      tests: [{ args: [[1, 2, 3, 4, 5]], expected: [3, 4, 5] }, { args: [[1, 2, 3, 4, 5, 6]], expected: [4, 5, 6] }, { args: [[1]], expected: [1] }],
      hints: ['Fast moves two steps, slow moves one.', 'Loop while fast && fast.next.'],
      solution: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`, complexity: 'O(n) time, O(1) space' },
    { type: 'code', title: 'Remove Nth node from end', difficulty: 'medium', fn: 'removeNthFromEnd', argTypes: ['list'], returnType: 'list',
      prompt: 'Remove the n-th node from the end of the list and return the head. Try to do it in one pass.',
      starter: `function removeNthFromEnd(head, n) {
  
}`,
      tests: [{ args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] }, { args: [[1], 1], expected: [] }, { args: [[1, 2], 1], expected: [1] }, { args: [[1, 2], 2], expected: [2] }],
      hints: ['Start two pointers at a dummy node in front of head.', 'Move lead n + 1 steps, then move both until lead is null.', 'trail.next is the node to remove: trail.next = trail.next.next.'],
      solution: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let lead = dummy, trail = dummy;
  for (let i = 0; i <= n; i++) lead = lead.next;
  while (lead) {
    lead = lead.next;
    trail = trail.next;
  }
  trail.next = trail.next.next;
  return dummy.next;
}`, complexity: 'O(n) time, O(1) space' },
  ]
});

UNITS.push({
  id: 'trees', title: 'Binary trees', blurb: 'Recursive DFS that returns answers from children, and BFS level by level.',
  items: [
    { type: 'lesson', title: 'Think in subtrees', body: [
      'Tests show trees in level order with <code>null</code> gaps: <code>[3,9,20,null,null,15,7]</code> is 3 with children 9 and 20; 20 has children 15 and 7. You get a <code>TreeNode</code> class with <code>val</code>, <code>left</code>, <code>right</code>.',
      '<h3>DFS template: trust the recursion</h3>Ask: "if I knew the answer for my left and right subtrees, how would I combine them?" Then handle the empty tree.',
      { code: `function maxDepth(root) {
  if (!root) return 0;                       // base case
  const l = maxDepth(root.left);             // answer for left subtree
  const r = maxDepth(root.right);            // answer for right subtree
  return 1 + Math.max(l, r);                 // combine
}` },
      '<h3>BFS template: level by level</h3>Use a queue. Snapshot the queue size to process exactly one level per round.',
      { code: `function levelOrder(root) {
  const out = [];
  let level = root ? [root] : [];
  while (level.length) {
    out.push(level.map(n => n.val));
    const next = [];
    for (const n of level) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    level = next;
  }
  return out;
}` },
      '<h3>BST property</h3>In a binary search tree, every value in the left subtree is less than the node and every value in the right is greater. In-order traversal visits values in sorted order. Validate by passing down a (min, max) range.',
      { tip: 'Complexity: visiting every node is O(n). Recursion uses O(h) stack space, where h is the height: O(log n) if balanced, O(n) if it is a line. Avoid queue.shift() in big BFS; it is O(n) per call.' },
    ]},
    { type: 'mcq', kind: 'complexity', prompt: 'Space complexity of recursive maxDepth on a tree that is a single long chain of n nodes?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, explain: 'The call stack is as deep as the tree is tall. A chain has height n.' },
    { type: 'mcq', kind: 'bug', prompt: 'This BST validator accepts an invalid tree like [5,4,6,null,null,3,7] (3 is in 5\'s right subtree). Why?', code: `function isValidBST(root) {
  if (!root) return true;
  if (root.left && root.left.val >= root.val) return false;
  if (root.right && root.right.val <= root.val) return false;
  return isValidBST(root.left) && isValidBST(root.right);
}`, options: ['It should use > instead of >=', 'It only compares each node with its direct children; every node must respect all ancestors\' bounds', 'It needs BFS', 'The base case should return false'], answer: 1, explain: '3 < 6 is fine locally, but 3 sits in the right subtree of 5, so it must be > 5. Pass a (low, high) range down the recursion.' },
    { type: 'mcq', kind: 'output', prompt: 'For the tree [1,2,3,4], what does this print?', code: `class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const root = new TreeNode(1, new TreeNode(2, new TreeNode(4)), new TreeNode(3));
const out = [];
function walk(n) {
  if (!n) return;
  walk(n.left);
  out.push(n.val);
  walk(n.right);
}
walk(root);
console.log(out);`, options: ['[1,2,4,3]', '[4,2,1,3]', '[4,2,3,1]', '[1,2,3,4]'], answer: 1, check: true, explain: 'Left, node, right is in-order traversal: 4, 2, 1, 3.' },
    { type: 'mcq', kind: 'pattern', prompt: 'Return the values visible from the right side of a tree (last node of each level). Fastest idea?', options: ['In-order traversal', 'BFS by level; take the last value of each level', 'Sort the values', 'Binary search'], answer: 1, explain: 'Any "per level" question is BFS with a level snapshot. (DFS visiting right first and recording the first node at each depth also works.)' },
    { type: 'parsons', title: 'Invert a binary tree', prompt: 'Order the lines to mirror the tree.', lines: ['function invertTree(root) {', '  if (!root) return null;', '  const left = invertTree(root.left);', '  root.left = invertTree(root.right);', '  root.right = left;', '  return root;', '}'], distractors: ['  root.left = root.right;', '  if (!root.left) return root;'], explain: 'Recursively invert, then swap. Saving the left result first avoids losing it.' },
    { type: 'code', title: 'Maximum depth of binary tree', difficulty: 'easy', fn: 'maxDepth', argTypes: ['tree'],
      prompt: 'Return the number of nodes on the longest path from the root down to a leaf.',
      starter: `/* class TreeNode { val; left; right } is available */
function maxDepth(root) {
  
}`,
      tests: [{ args: [[3, 9, 20, null, null, 15, 7]], expected: 3 }, { args: [[1, null, 2]], expected: 2 }, { args: [[]], expected: 0 }, { args: [[1, 2, null, 3, null, 4]], expected: 4 }],
      hints: ['Empty tree has depth 0.', 'Depth = 1 + max(depth(left), depth(right)).'],
      solution: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`, complexity: 'O(n) time, O(h) space' },
    { type: 'code', title: 'Invert binary tree', difficulty: 'easy', fn: 'invertTree', argTypes: ['tree'], returnType: 'tree',
      prompt: 'Mirror the tree (swap every left and right child) and return the root.',
      starter: `function invertTree(root) {
  
}`,
      tests: [{ args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] }, { args: [[2, 1, 3]], expected: [2, 3, 1] }, { args: [[]], expected: [] }],
      hints: ['Invert both subtrees, then swap them.'],
      solution: `function invertTree(root) {
  if (!root) return null;
  const left = invertTree(root.left);
  root.left = invertTree(root.right);
  root.right = left;
  return root;
}`, complexity: 'O(n) time, O(h) space' },
    { type: 'code', title: 'Level order traversal', difficulty: 'medium', fn: 'levelOrder', argTypes: ['tree'],
      prompt: 'Return node values level by level, left to right: <code>[[3],[9,20],[15,7]]</code>.',
      starter: `function levelOrder(root) {
  
}`,
      tests: [{ args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] }, { args: [[1]], expected: [[1]] }, { args: [[]], expected: [] }, { args: [[1, 2, 3, 4, null, null, 5]], expected: [[1], [2, 3], [4, 5]] }],
      hints: ['Start with level = [root] (if root exists).', 'Each round: record values, then build the next level from children.'],
      solution: `function levelOrder(root) {
  const out = [];
  let level = root ? [root] : [];
  while (level.length) {
    out.push(level.map(n => n.val));
    const next = [];
    for (const n of level) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    level = next;
  }
  return out;
}`, complexity: 'O(n) time, O(width) space' },
    { type: 'code', title: 'Validate binary search tree', difficulty: 'medium', fn: 'isValidBST', argTypes: ['tree'],
      prompt: 'Return true if the tree is a valid BST: every left-subtree value < node < every right-subtree value.',
      starter: `function isValidBST(root) {
  
}`,
      tests: [{ args: [[2, 1, 3]], expected: true }, { args: [[5, 1, 4, null, null, 3, 6]], expected: false }, { args: [[5, 4, 6, null, null, 3, 7]], expected: false }, { args: [[1, 1]], expected: false }, { args: [[]], expected: true }],
      hints: ['Write a helper check(node, low, high).', 'Each node must satisfy low < val < high. Going left, high becomes val; going right, low becomes val.'],
      solution: `function isValidBST(root) {
  function check(node, low, high) {
    if (!node) return true;
    if (node.val <= low || node.val >= high) return false;
    return check(node.left, low, node.val) && check(node.right, node.val, high);
  }
  return check(root, -Infinity, Infinity);
}`, complexity: 'O(n) time, O(h) space' },
    { type: 'code', title: 'Diameter of binary tree', difficulty: 'medium', fn: 'diameterOfBinaryTree', argTypes: ['tree'],
      prompt: 'Return the length (in edges) of the longest path between any two nodes. The path may skip the root.',
      starter: `function diameterOfBinaryTree(root) {
  
}`,
      tests: [{ args: [[1, 2, 3, 4, 5]], expected: 3 }, { args: [[1, 2]], expected: 1 }, { args: [[1]], expected: 0 }, { args: [[1, 2, null, 3, 4, 5, null, null, 6]], expected: 4 }],
      hints: ['A helper returns the height of a subtree.', 'At each node, the longest path through it is leftHeight + rightHeight. Track the max in an outer variable.'],
      solution: `function diameterOfBinaryTree(root) {
  let best = 0;
  function height(n) {
    if (!n) return 0;
    const l = height(n.left), r = height(n.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
  }
  height(root);
  return best;
}`, complexity: 'O(n) time, O(h) space' },
  ]
});

UNITS.push({
  id: 'graphs', title: 'Graphs & grids', blurb: 'Adjacency lists, DFS/BFS with a visited set, shortest steps, and topological order.',
  items: [
    { type: 'lesson', title: 'Graphs are everywhere', body: [
      'A graph is nodes plus edges. Grids, dependency lists, social networks, and word ladders are all graphs. Step one is always: <b>build the adjacency list</b>.',
      { code: `// edges = [[0,1],[1,2]] undirected, n nodes
const adj = Array.from({ length: n }, () => []);
for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }` },
      '<h3>DFS (explore everything reachable)</h3>',
      { code: `const seen = new Set();
function dfs(u) {
  seen.add(u);
  for (const v of adj[u]) if (!seen.has(v)) dfs(v);
}` },
      '<h3>BFS (fewest steps in an unweighted graph)</h3>Use an array and a moving head index as the queue. <code>shift()</code> is O(n).',
      { code: `const dist = new Array(n).fill(-1);
const q = [start]; dist[start] = 0;
for (let head = 0; head < q.length; head++) {
  const u = q[head];
  for (const v of adj[u]) if (dist[v] === -1) { dist[v] = dist[u] + 1; q.push(v); }
}` },
      '<h3>Grids</h3>Each cell is a node; neighbors are the four directions. Check bounds.',
      { code: `const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
for (const [dr, dc] of dirs) {
  const nr = r + dr, nc = c + dc;
  if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
  // visit grid[nr][nc]
}` },
      '<h3>Topological sort (Kahn\'s algorithm)</h3>For prerequisites/dependencies: count incoming edges, start from nodes with 0, remove them and decrement neighbors. If you cannot process all nodes, there is a cycle.',
      { tip: 'Complexity of BFS/DFS: O(V + E). For a grid: O(rows × cols). Mark visited when you push to the queue, not when you pop, to avoid duplicates.' },
    ]},
    { type: 'mcq', kind: 'pattern', prompt: 'Minimum number of steps from the top-left to the bottom-right of a grid with walls (each move costs 1). Which algorithm?', options: ['DFS', 'BFS', 'Binary search', 'Topological sort'], answer: 1, explain: 'BFS explores in rings of increasing distance, so the first time you reach the target is the shortest path. DFS finds a path, not the shortest.' },
    { type: 'mcq', kind: 'pattern', prompt: 'Given course prerequisites, decide if all courses can be finished. What are you really detecting?', options: ['The shortest path', 'A cycle in a directed graph (via topological sort)', 'Connected components', 'The minimum spanning tree'], answer: 1, explain: 'Courses are finishable exactly when the dependency graph has no cycle. Kahn\'s algorithm processes all n nodes only if it is acyclic.' },
    { type: 'mcq', kind: 'complexity', prompt: 'Counting islands in an R × C grid with DFS that marks visited cells. Time complexity?', options: ['O(R × C)', 'O((R × C)²)', 'O(R + C)', 'O(4^(R×C))'], answer: 0, explain: 'Each cell is visited once and checks 4 neighbors: O(R·C).' },
    { type: 'mcq', kind: 'bug', prompt: 'This BFS is very slow on large graphs. Why?', code: `const q = [start];
const seen = new Set([start]);
while (q.length) {
  const u = q.shift();
  for (const v of adj[u]) {
    if (!seen.has(v)) { seen.add(v); q.push(v); }
  }
}`, options: ['seen should be an array', 'q.shift() is O(n) per call, so the whole BFS becomes O(V²); use a head index', 'It should be DFS', 'It marks visited too early'], answer: 1, explain: 'Shift moves every element. With a <code>head</code> index (<code>q[head++]</code>) each dequeue is O(1). Marking visited on push is correct.' },
    { type: 'mcq', kind: 'output', prompt: 'How many connected components? What does this print?', code: `const n = 5, edges = [[0, 1], [1, 2], [3, 4]];
const adj = Array.from({ length: n }, () => []);
for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
const seen = new Set();
let count = 0;
function dfs(u) { seen.add(u); for (const v of adj[u]) if (!seen.has(v)) dfs(v); }
for (let i = 0; i < n; i++) if (!seen.has(i)) { count++; dfs(i); }
console.log(count);`, options: ['1', '2', '3', '5'], answer: 1, check: true, explain: '{0,1,2} and {3,4}: two components.' },
    { type: 'parsons', title: 'Number of islands (DFS)', prompt: 'Order the lines of the island counter.', lines: ['function numIslands(grid) {', '  let count = 0;', '  const sink = (r, c) => {', "    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;", "    grid[r][c] = '0';", '    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);', '  };', '  for (let r = 0; r < grid.length; r++)', '    for (let c = 0; c < grid[0].length; c++)', "      if (grid[r][c] === '1') { count++; sink(r, c); }", '  return count;', '}'], distractors: ["    grid[r][c] = '1';", '      if (grid[r][c] === 1) count++;'], explain: 'Each time you find unvisited land, count an island and sink its whole connected area so you never count it again.' },
    { type: 'code', title: 'Number of islands', difficulty: 'medium', fn: 'numIslands',
      prompt: 'Grid of "1" (land) and "0" (water). Count islands: groups of land connected horizontally or vertically.',
      starter: `function numIslands(grid) {
  
}`,
      tests: [{ args: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]], expected: 1 }, { args: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]], expected: 3 }, { args: [[['0']]], expected: 0 }, { args: [[['1', '0', '1'], ['0', '1', '0'], ['1', '0', '1']]], expected: 5 }],
      hints: ['Scan every cell. When you find a "1", count++ and flood-fill it.', 'Flood fill = DFS that turns connected "1"s into "0"s (or adds them to a visited set).'],
      solution: `function numIslands(grid) {
  const R = grid.length, C = grid[0].length;
  let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r][c] === '1') { count++; sink(r, c); }
  return count;
}`, complexity: 'O(R·C) time, O(R·C) worst-case recursion' },
    { type: 'code', title: 'Number of connected components', difficulty: 'medium', fn: 'countComponents',
      prompt: 'n nodes labelled 0..n-1 and a list of undirected edges. Return how many connected components there are.',
      starter: `function countComponents(n, edges) {
  
}`,
      tests: [{ args: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 }, { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 }, { args: [3, []], expected: 3 }, { args: [4, [[2, 3], [1, 2], [1, 3]]], expected: 2 }],
      hints: ['Build an adjacency list.', 'For each unvisited node: count++, then DFS/BFS to mark its whole component.'],
      solution: `function countComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  const seen = new Array(n).fill(false);
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (seen[i]) continue;
    count++;
    const stack = [i]; seen[i] = true;
    while (stack.length) {
      const u = stack.pop();
      for (const v of adj[u]) if (!seen[v]) { seen[v] = true; stack.push(v); }
    }
  }
  return count;
}`, complexity: 'O(V + E) time and space' },
    { type: 'code', title: 'Course schedule', difficulty: 'medium', fn: 'canFinish',
      prompt: '<code>prereqs[i] = [a, b]</code> means you must take b before a. Return true if all <code>numCourses</code> can be finished.',
      starter: `function canFinish(numCourses, prereqs) {
  
}`,
      tests: [{ args: [2, [[1, 0]]], expected: true }, { args: [2, [[1, 0], [0, 1]]], expected: false }, { args: [3, []], expected: true }, { args: [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], expected: false }, { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true }],
      hints: ['Edges go b → a. Count indegree for each course.', 'Queue every course with indegree 0. Pop, count it, and decrement its neighbors; push any that hit 0.', 'Return processedCount === numCourses.'],
      solution: `function canFinish(numCourses, prereqs) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);
  for (const [a, b] of prereqs) { adj[b].push(a); indeg[a]++; }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let done = 0;
  for (let h = 0; h < q.length; h++) {
    done++;
    for (const v of adj[q[h]]) if (--indeg[v] === 0) q.push(v);
  }
  return done === numCourses;
}`, complexity: 'O(V + E) time and space' },
    { type: 'code', title: 'Rotting oranges', difficulty: 'medium', fn: 'orangesRotting',
      prompt: 'Grid cells: 0 empty, 1 fresh orange, 2 rotten. Each minute, rotten oranges rot their 4-directional fresh neighbors. Return minutes until no fresh orange remains, or -1 if impossible.',
      starter: `function orangesRotting(grid) {
  
}`,
      tests: [{ args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 }, { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 }, { args: [[[0, 2]]], expected: 0 }, { args: [[[1]]], expected: -1 }, { args: [[[2, 2], [1, 1]]], expected: 1 }],
      hints: ['Multi-source BFS: start the queue with every rotten orange at once.', 'Count fresh oranges. Process the queue one level (minute) at a time.', 'Answer is minutes elapsed if fresh hits 0, else -1.'],
      solution: `function orangesRotting(grid) {
  const R = grid.length, C = grid[0].length;
  let q = [], fresh = 0, minutes = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (grid[r][c] === 2) q.push([r, c]);
    else if (grid[r][c] === 1) fresh++;
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length && fresh > 0) {
    const next = [];
    for (const [r, c] of q) {
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < R && nc < C && grid[nr][nc] === 1) {
          grid[nr][nc] = 2; fresh--; next.push([nr, nc]);
        }
      }
    }
    q = next;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`, complexity: 'O(R·C) time and space' },
  ]
});

UNITS.push({
  id: 'heaps', title: 'Heaps & top-K', blurb: 'Always know the smallest (or largest) item in O(log n): top-K, K-closest, scheduling.',
  items: [
    { type: 'lesson', title: 'Priority queues in JavaScript', body: [
      'A heap gives you the min (or max) item in O(1) and lets you push/pop in O(log n). JavaScript has no built-in heap, so this app gives you a <code>MinHeap</code> class in every coding problem:',
      { code: `const h = new MinHeap();                    // numbers, smallest first
h.push(5); h.push(1); h.push(3);
h.peek();  // 1
h.pop();   // 1
h.size;    // 2

const maxH = new MinHeap((a, b) => b - a); // largest first
const byDist = new MinHeap((a, b) => a[0] - b[0]); // [dist, point] pairs` },
      { tip: 'On LeetCode itself, JS submissions include MinPriorityQueue / MaxPriorityQueue (from the datastructures-js library). In a live interview, say "assume a heap with push/pop/peek" and move on, or fall back to sorting if n is small.' },
      '<h3>Top-K pattern</h3>To keep the K largest of a stream, use a <b>min</b>-heap of size K: the smallest of your top K sits on top, ready to be evicted. Total O(n log k), better than sorting (O(n log n)) when k is small.',
      { code: `function kthLargest(nums, k) {
  const h = new MinHeap();
  for (const x of nums) {
    h.push(x);
    if (h.size > k) h.pop(); // drop the smallest
  }
  return h.peek();
}` },
      { tip: 'Signals: "k largest/smallest/closest/most frequent", "merge k sorted", "repeatedly take the min/max", scheduling, Dijkstra.' },
    ]},
    { type: 'mcq', kind: 'complexity', prompt: 'Keep a size-k min-heap while scanning n numbers. Time complexity?', options: ['O(n log n)', 'O(n log k)', 'O(k log n)', 'O(n · k)'], answer: 1, explain: 'Each of n items costs a push (and maybe a pop) on a heap of at most k+1 items: O(log k) each.' },
    { type: 'mcq', kind: 'pattern', prompt: 'To find the k LARGEST numbers with a heap of size k, which heap do you keep?', options: ['A max-heap, so the largest is on top', 'A min-heap, so the smallest of the current top-k is on top and can be evicted', 'Either works the same', 'Two heaps'], answer: 1, explain: 'You need to quickly find which of your current k is the weakest. That is the min.' },
    { type: 'mcq', kind: 'output', prompt: 'Using this app\'s MinHeap, what does this print?', code: `class MinHeap {
  constructor(cmp = (a, b) => a - b) { this.cmp = cmp; this.a = []; }
  get size() { return this.a.length; }
  push(x) { this.a.push(x); this.a.sort(this.cmp); }
  pop() { return this.a.shift(); }
  peek() { return this.a[0]; }
}
const h = new MinHeap((a, b) => b - a);
for (const x of [4, 1, 7, 3]) h.push(x);
h.pop();
console.log(h.peek(), h.size);`, options: ['1 3', '4 3', '7 3', '3 3'], answer: 1, check: true, explain: 'The comparator b - a makes it a max-heap. Pop removes 7, so the top is 4 with 3 left. (This toy version sorts on every push, which is O(n log n) per push; a real heap is O(log n).)' },
    { type: 'mcq', kind: 'complexity', prompt: 'Simplest way to get the k most frequent elements: count with a Map, then sort entries by count. Complexity?', options: ['O(n)', 'O(n log n)', 'O(n log k)', 'O(k)'], answer: 1, explain: 'Counting is O(n); sorting up to n distinct entries is O(n log n). A size-k heap gives O(n log k); bucket sort by frequency gives O(n).' },
    { type: 'code', title: 'Kth largest element', difficulty: 'medium', fn: 'findKthLargest',
      prompt: 'Return the k-th largest element (not k-th distinct). Try a size-k MinHeap.',
      starter: `/* MinHeap is available: push, pop, peek, size */
function findKthLargest(nums, k) {
  
}`,
      tests: [{ args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 }, { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 }, { args: [[1], 1], expected: 1 }, { args: [[-1, -1], 2], expected: -1 }],
      hints: ['Push every number into a MinHeap.', 'Whenever size exceeds k, pop. The top is the k-th largest.'],
      solution: `function findKthLargest(nums, k) {
  const h = new MinHeap();
  for (const x of nums) {
    h.push(x);
    if (h.size > k) h.pop();
  }
  return h.peek();
}`, complexity: 'O(n log k) time, O(k) space' },
    { type: 'code', title: 'Top K frequent elements', difficulty: 'medium', fn: 'topKFrequent',
      prompt: 'Return the k most frequent values, in any order. The answer is unique.',
      starter: `function topKFrequent(nums, k) {
  
}`,
      tests: [{ args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] }, { args: [[1], 1], expected: [1] }, { args: [[4, 4, 5, 5, 5, 6, 6, 6, 6], 2], expected: [6, 5] }, { args: [[-1, -1, 2], 1], expected: [-1] }],
      compare: 'unordered',
      hints: ['Count with a Map.', 'Keep a MinHeap of [count, value] of size k, ordered by count.'],
      solution: `function topKFrequent(nums, k) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);
  const h = new MinHeap((a, b) => a[0] - b[0]);
  for (const [val, c] of count) {
    h.push([c, val]);
    if (h.size > k) h.pop();
  }
  const out = [];
  while (h.size) out.push(h.pop()[1]);
  return out;
}`, complexity: 'O(n log k) time, O(n) space' },
    { type: 'code', title: 'K closest points to origin', difficulty: 'medium', fn: 'kClosest',
      prompt: 'Return the k points closest to (0, 0), in any order.',
      starter: `function kClosest(points, k) {
  
}`,
      tests: [{ args: [[[1, 3], [-2, 2]], 1], expected: [[-2, 2]] }, { args: [[[3, 3], [5, -1], [-2, 4]], 2], expected: [[3, 3], [-2, 4]] }, { args: [[[0, 1], [1, 0]], 2], expected: [[0, 1], [1, 0]] }],
      compare: 'unordered',
      hints: ['Compare squared distance x² + y² (no need for sqrt).', 'To keep the k closest, use a MAX-heap of size k by distance and evict the farthest.'],
      solution: `function kClosest(points, k) {
  const d = ([x, y]) => x * x + y * y;
  const h = new MinHeap((a, b) => d(b) - d(a)); // max-heap by distance
  for (const p of points) {
    h.push(p);
    if (h.size > k) h.pop();
  }
  const out = [];
  while (h.size) out.push(h.pop());
  return out;
}`, complexity: 'O(n log k) time, O(k) space' },
    { type: 'code', title: 'Last stone weight', difficulty: 'easy', fn: 'lastStoneWeight',
      prompt: 'Repeatedly smash the two heaviest stones x ≤ y: if equal both vanish, else a stone of y - x remains. Return the last stone\'s weight, or 0.',
      starter: `function lastStoneWeight(stones) {
  
}`,
      tests: [{ args: [[2, 7, 4, 1, 8, 1]], expected: 1 }, { args: [[1]], expected: 1 }, { args: [[2, 2]], expected: 0 }, { args: [[10, 4, 2, 10]], expected: 2 }],
      hints: ['A max-heap: new MinHeap((a, b) => b - a).', 'Pop two, push the difference if non-zero, until size ≤ 1.'],
      solution: `function lastStoneWeight(stones) {
  const h = new MinHeap((a, b) => b - a);
  for (const s of stones) h.push(s);
  while (h.size > 1) {
    const y = h.pop(), x = h.pop();
    if (y !== x) h.push(y - x);
  }
  return h.size ? h.peek() : 0;
}`, complexity: 'O(n log n) time, O(n) space' },
  ]
});
