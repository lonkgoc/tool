import { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';

interface CornellNote {
  id: string;
  title: string;
  date: string;
  cues: string;
  notes: string;
  summary: string;
}

export default function CornellNotes() {
  const [notes, setNotes] = useState<CornellNote[]>(() => {
    const saved = localStorage.getItem('cornellNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedNote, setSelectedNote] = useState<CornellNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    cues: '',
    notes: '',
    summary: '',
  });

  useEffect(() => {
    localStorage.setItem('cornellNotes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    if (!formData.title.trim() || !formData.notes.trim()) return;

    const note: CornellNote = {
      id: Date.now().toString(),
      title: formData.title,
      date: new Date().toISOString().split('T')[0],
      cues: formData.cues,
      notes: formData.notes,
      summary: formData.summary,
    };

    setNotes([note, ...notes]);
    setFormData({ title: '', cues: '', notes: '', summary: '' });
    setSelectedNote(note);
    setIsCreating(false);
  };

  const updateNote = (id: string, field: string, value: string) => {
    setNotes(
      notes.map(n =>
        n.id === id ? { ...n, [field]: value } : n
      )
    );
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, [field]: value });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const stats = {
    total: notes.length,
    today: notes.filter(n => n.date === new Date().toISOString().split('T')[0]).length,
    completed: notes.filter(n => n.summary.trim()).length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - Notes List */}
      <div className="lg:col-span-1">
        <div className="space-y-3">
          {/* Stats */}
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Total Notes</div>
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              setIsCreating(true);
              setFormData({ title: '', cues: '', notes: '', summary: '' });
            }}
            className="btn-primary w-full"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>

          {/* Notes List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                No notes yet
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {notes.map(note => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      selectedNote?.id === note.id
                        ? 'bg-blue-100 dark:bg-blue-900'
                        : ''
                    }`}
                  >
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                      {note.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(note.date).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {isCreating ? (
          /* Create Form */
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">New Note</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note title or topic"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Notes (Right Column)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Main notes and details..."
                className="input-field resize-none h-40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Cues (Left Column)
              </label>
              <textarea
                value={formData.cues}
                onChange={(e) => setFormData({ ...formData, cues: e.target.value })}
                placeholder="Key questions, concepts, or cues..."
                className="input-field resize-none h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Summary (Bottom)
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Main ideas and summary..."
                className="input-field resize-none h-24"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={createNote} className="btn-primary flex-1">
                Save Note
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : selectedNote ? (
          /* Cornell Note Display */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {selectedNote.title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreating(true)}
                  className="btn-secondary text-sm"
                >
                  <Plus className="w-4 h-4" /> New
                </button>
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cornell Note Layout */}
            <div className="grid grid-cols-4 gap-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              {/* Left Column - Cues */}
              <div className="col-span-1 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-r-2 border-slate-300 dark:border-slate-600 p-4">
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase">
                  Cues & Questions
                </h3>
                <textarea
                  value={selectedNote.cues}
                  onChange={(e) => updateNote(selectedNote.id, 'cues', e.target.value)}
                  placeholder="Key concepts..."
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm resize-none h-48 border border-slate-300 dark:border-slate-600 rounded p-2"
                />
              </div>

              {/* Right Column - Notes */}
              <div className="col-span-3 p-4 border-b-4 border-slate-300 dark:border-slate-600">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 uppercase">
                  Notes
                </h3>
                <textarea
                  value={selectedNote.notes}
                  onChange={(e) => updateNote(selectedNote.id, 'notes', e.target.value)}
                  placeholder="Detailed notes..."
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm resize-none h-48 border border-slate-300 dark:border-slate-600 rounded p-2"
                />
              </div>

              {/* Bottom - Summary */}
              <div className="col-span-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-4 border-t-4 border-slate-300 dark:border-slate-600">
                <h3 className="text-sm font-bold text-green-900 dark:text-green-100 mb-3 uppercase">
                  Summary
                </h3>
                <textarea
                  value={selectedNote.summary}
                  onChange={(e) => updateNote(selectedNote.id, 'summary', e.target.value)}
                  placeholder="Main takeaways and summary..."
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm resize-none h-28 border border-slate-300 dark:border-slate-600 rounded p-2"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Created: {new Date(selectedNote.date).toLocaleDateString()}
            </p>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
              No Note Selected
            </p>
            <p className="text-slate-500 dark:text-slate-500">
              Create a new note or select one from the list to get started
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      {!selectedNote && !isCreating && (
        <div className="lg:col-span-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            📚 Cornell Note-Taking System
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li><strong>Left Column (Cues):</strong> Key concepts, questions, or topics</li>
            <li><strong>Right Column (Notes):</strong> Detailed notes and explanations</li>
            <li><strong>Bottom (Summary):</strong> Main ideas and key takeaways</li>
            <li><strong>Benefits:</strong> Better retention, easier review, active learning</li>
          </ul>
        </div>
      )}
    </div>
  );
}
