import { useState, useEffect } from 'react';
import { Plus, X, GripVertical, Download, ArrowRight, LayoutGrid } from 'lucide-react';

interface Card {
  id: string;
  text: string;
  color: string;
  createdAt: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

const cardColors = ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100'];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(() => {
    const saved = localStorage.getItem('kanbanBoard');
    return saved ? JSON.parse(saved) : [
      { id: 'todo', title: 'To Do', cards: [] },
      { id: 'inprogress', title: 'In Progress', cards: [] },
      { id: 'done', title: 'Done', cards: [] }
    ];
  });
  const [newCardText, setNewCardText] = useState('');
  const [newCardColumn, setNewCardColumn] = useState('todo');
  const [notification, setNotification] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<{ card: Card; columnId: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('kanbanBoard', JSON.stringify(columns));
  }, [columns]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addCard = () => {
    if (newCardText.trim()) {
      const newCard: Card = {
        id: Date.now().toString(),
        text: newCardText.trim(),
        color: cardColors[Math.floor(Math.random() * cardColors.length)],
        createdAt: new Date().toISOString()
      };
      setColumns(columns.map(col =>
        col.id === newCardColumn
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      ));
      setNewCardText('');
      showNotification('Card added!');
    }
  };

  const moveCard = (cardId: string, fromColumn: string, toColumn: string) => {
    if (fromColumn === toColumn) return;

    const card = columns.find(c => c.id === fromColumn)?.cards.find(c => c.id === cardId);
    if (!card) return;

    setColumns(columns.map(col => {
      if (col.id === fromColumn) {
        return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
      }
      if (col.id === toColumn) {
        return { ...col, cards: [...col.cards, card] };
      }
      return col;
    }));
  };

  const deleteCard = (cardId: string, columnId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter(c => c.id !== cardId) }
        : col
    ));
    showNotification('Card removed');
  };

  const clearColumn = (columnId: string) => {
    setColumns(columns.map(col => col.id === columnId ? { ...col, cards: [] } : col));
    showNotification('Column cleared');
  };

  const exportBoard = () => {
    let text = '=== Kanban Board Export ===\n\n';
    columns.forEach(col => {
      text += `## ${col.title} (${col.cards.length})\n`;
      col.cards.forEach((card, i) => {
        text += `  ${i + 1}. ${card.text}\n`;
      });
      text += '\n';
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kanban-board.txt';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Board exported!');
  };

  const handleDragStart = (card: Card, columnId: string) => {
    setDraggedCard({ card, columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (draggedCard && draggedCard.columnId !== targetColumnId) {
      moveCard(draggedCard.card.id, draggedCard.columnId, targetColumnId);
    }
    setDraggedCard(null);
  };

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-blue-500 text-white animate-fade-in">
          {notification}
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-blue-500" />
            Kanban Board
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{totalCards} cards</span>
            {totalCards > 0 && (
              <button onClick={exportBoard} className="btn-secondary text-sm flex items-center gap-1">
                <Download className="w-4 h-4" /> Export
              </button>
            )}
          </div>
        </div>

        {/* Add Card */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCard()}
            placeholder="Add a new card..."
            className="flex-1 input-field"
          />
          <select
            value={newCardColumn}
            onChange={(e) => setNewCardColumn(e.target.value)}
            className="input-field w-32"
          >
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.title}</option>
            ))}
          </select>
          <button onClick={addCard} className="btn-primary">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(column => (
            <div
              key={column.id}
              className={`bg-slate-50 dark:bg-slate-800 rounded-xl p-4 transition-all ${draggedCard && draggedCard.columnId !== column.id ? 'ring-2 ring-blue-400 ring-dashed' : ''
                }`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  {column.title}
                  <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                    {column.cards.length}
                  </span>
                </h3>
                {column.cards.length > 0 && (
                  <button onClick={() => clearColumn(column.id)} className="text-xs text-slate-400 hover:text-red-500">
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-2 min-h-[200px]">
                {column.cards.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card, column.id)}
                    className={`${card.color} dark:bg-opacity-20 p-3 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow group`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="flex-1 text-sm text-slate-800 dark:text-slate-200">{card.text}</span>
                      <button
                        onClick={() => deleteCard(card.id, column.id)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {columns.filter(c => c.id !== column.id).map(targetCol => (
                        <button
                          key={targetCol.id}
                          onClick={() => moveCard(card.id, column.id, targetCol.id)}
                          className="text-xs px-2 py-0.5 bg-white/50 dark:bg-slate-700/50 rounded flex items-center gap-1 hover:bg-white dark:hover:bg-slate-600"
                        >
                          <ArrowRight className="w-3 h-3" />
                          {targetCol.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {column.cards.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                    Drop cards here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Tip:</strong> Drag cards between columns or use the quick move buttons. Kanban boards help visualize workflow and limit work-in-progress.
      </div>
    </div>
  );
}
