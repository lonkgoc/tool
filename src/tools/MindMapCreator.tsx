import { useState, useEffect, useRef } from 'react';
import { Plus, Download, Trash2, ChevronDown, ChevronRight, Brain } from 'lucide-react';

interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
  expanded: boolean;
}

export default function MindMapCreator() {
  const [rootNode, setRootNode] = useState<MindMapNode>(() => {
    const saved = localStorage.getItem('mindMap');
    return saved ? JSON.parse(saved) : { id: '0', text: 'Central Idea', children: [], expanded: true };
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('mindMap', JSON.stringify(rootNode));
  }, [rootNode]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateNode = (node: MindMapNode, id: string, updateFn: (n: MindMapNode) => void): MindMapNode => {
    if (node.id === id) {
      const updated = { ...node };
      updateFn(updated);
      return updated;
    }
    return { ...node, children: node.children.map(child => updateNode(child, id, updateFn)) };
  };

  const addChild = (parentId: string) => {
    const newNode: MindMapNode = { id: Date.now().toString(), text: 'New Idea', children: [], expanded: true };
    setRootNode(updateNode(rootNode, parentId, (node) => {
      node.children.push(newNode);
      node.expanded = true;
    }));
    setEditingId(newNode.id);
    setEditText('New Idea');
    showNotification('Node added!');
  };

  const updateNodeText = (id: string, text: string) => {
    setRootNode(updateNode(rootNode, id, (node) => { node.text = text; }));
  };

  const toggleExpand = (id: string) => {
    setRootNode(updateNode(rootNode, id, (node) => { node.expanded = !node.expanded; }));
  };

  const deleteNode = (id: string) => {
    if (id === '0') return;
    const deleteFromParent = (node: MindMapNode): MindMapNode => ({
      ...node,
      children: node.children.filter(child => child.id !== id).map(deleteFromParent),
    });
    setRootNode(deleteFromParent(rootNode));
    showNotification('Node deleted');
  };

  const countNodes = (node: MindMapNode): number => 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);

  const getMaxDepth = (node: MindMapNode, depth = 1): number => {
    if (node.children.length === 0) return depth;
    return Math.max(...node.children.map(child => getMaxDepth(child, depth + 1)));
  };

  const exportAsText = () => {
    const toText = (node: MindMapNode, indent = 0): string => {
      const prefix = indent === 0 ? '# ' : '  '.repeat(indent) + '- ';
      let text = prefix + node.text + '\n';
      node.children.forEach(child => { text += toText(child, indent + 1); });
      return text;
    };
    const text = '=== Mind Map Export ===\n\n' + toText(rootNode);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.txt';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Mind map exported!');
  };

  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(rootNode, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Exported as JSON!');
  };

  const resetMap = () => {
    if (confirm('Reset entire mind map?')) {
      setRootNode({ id: '0', text: 'Central Idea', children: [], expanded: true });
      showNotification('Mind map reset');
    }
  };

  const colors = [
    'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 border-blue-400',
    'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 border-purple-400',
    'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 border-green-400',
    'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 border-yellow-400',
    'bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 border-pink-400',
  ];

  const renderNode = (node: MindMapNode, level = 0): JSX.Element => {
    const colorClass = colors[level % colors.length];
    const isRoot = level === 0;

    return (
      <div key={node.id} className={`${isRoot ? '' : 'ml-8 mt-2'}`}>
        <div className={`border-2 ${colorClass} rounded-lg p-3 inline-block cursor-pointer hover:shadow-lg transition-all relative`}>
          {/* Expander */}
          {node.children.length > 0 && (
            <button onClick={() => toggleExpand(node.id)} className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-800 rounded-full p-1 shadow">
              {node.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}

          {/* Text */}
          {editingId === node.id ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={() => { updateNodeText(node.id, editText || 'New Idea'); setEditingId(null); }}
              onKeyPress={(e) => { if (e.key === 'Enter') { updateNodeText(node.id, editText || 'New Idea'); setEditingId(null); } }}
              autoFocus
              className="px-2 py-1 border rounded text-sm min-w-[100px]"
            />
          ) : (
            <div onClick={() => { setEditingId(node.id); setEditText(node.text); }}
              className={`font-semibold text-slate-900 dark:text-slate-100 ${isRoot ? 'text-lg' : 'text-sm'}`}>
              {node.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-1 mt-2 justify-center">
            <button onClick={() => addChild(node.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">+</button>
            {!isRoot && (
              <button onClick={() => deleteNode(node.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">×</button>
            )}
          </div>
        </div>

        {/* Children */}
        {node.expanded && node.children.length > 0 && (
          <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4 ml-4 mt-2">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-purple-500 text-white animate-fade-in">
          {notification}
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Mind Map Creator
          </h2>
          <div className="flex gap-2">
            <button onClick={exportAsText} className="btn-secondary text-sm flex items-center gap-1">
              <Download className="w-4 h-4" /> TXT
            </button>
            <button onClick={exportAsJSON} className="btn-secondary text-sm flex items-center gap-1">
              <Download className="w-4 h-4" /> JSON
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{countNodes(rootNode)}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Total Ideas</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{rootNode.children.length}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Main Branches</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{getMaxDepth(rootNode)}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Max Depth</div>
          </div>
        </div>

        {/* Mind Map */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 overflow-auto min-h-[300px]">
          {renderNode(rootNode)}
        </div>

        <div className="flex justify-center mt-4">
          <button onClick={resetMap} className="text-sm text-red-500 hover:text-red-600">Reset Mind Map</button>
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-sm text-purple-800 dark:text-purple-100">
        <strong>💡 Tips:</strong> Click on any node text to edit it. Use + to add branches, × to delete. Export your mind map as text or JSON for backup.
      </div>
    </div>
  );
}
