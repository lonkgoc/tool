import { useState, useEffect, useRef } from 'react';
import { BookOpen, Save, Calendar, Download, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export default function DailyJournal() {
  const [entries, setEntries] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('journalEntries');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState(entries[selectedDate] || '');
  const [notification, setNotification] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveRef = useRef<number | null>(null);

  useEffect(() => {
    setContent(entries[selectedDate] || '');
  }, [selectedDate, entries]);

  // Auto-save with debounce
  useEffect(() => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    if (content !== (entries[selectedDate] || '')) {
      autoSaveRef.current = setTimeout(() => saveEntry(true), 2000) as unknown as number;
    }
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [content]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const wordCount = content.split(/\s+/).filter(w => w).length;

  const saveEntry = (auto = false) => {
    const newEntries = { ...entries, [selectedDate]: content };
    setEntries(newEntries);
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));
    setLastSaved(new Date());
    if (!auto) showNotification('Entry saved! ✨');
  };

  const navigateDate = (dir: 'prev' | 'next') => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (dir === 'next' ? 1 : -1));
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const exportEntry = () => {
    const text = `Journal - ${selectedDate}\nWords: ${wordCount}\n${'='.repeat(20)}\n\n${content}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-${selectedDate}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Exported!');
  };

  const exportAll = () => {
    const dates = Object.keys(entries).sort().reverse();
    if (!dates.length) { showNotification('No entries'); return; }
    let text = `Journal Export (${dates.length} entries)\n${'='.repeat(30)}\n\n`;
    dates.forEach(d => { text += `--- ${d} ---\n${entries[d]}\n\n`; });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-all-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(`Exported ${dates.length} entries!`);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const hasChanges = content !== (entries[selectedDate] || '');
  const totalEntries = Object.keys(entries).filter(k => entries[k]).length;

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-green-500 text-white">
          {notification}
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Daily Journal
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input-field text-sm" />
            <button onClick={() => navigateDate('next')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
            {!isToday && <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="btn-secondary text-xs">Today</button>}
          </div>
        </div>

        <div className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {isToday && <span className="ml-2 text-blue-600 font-medium">(Today)</span>}
        </div>

        {!content && isToday && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-100">
            ✍️ How was your day? What are you grateful for?
          </div>
        )}

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your thoughts..."
          className="w-full input-field min-h-[300px] resize-y"
        />

        <div className="flex items-center justify-between mt-3 text-sm text-slate-500">
          <div className="flex gap-4">
            <span>{wordCount} words</span>
            {hasChanges && <span className="text-yellow-600">• Unsaved</span>}
          </div>
          {lastSaved && <span className="text-xs">Saved: {lastSaved.toLocaleTimeString()}</span>}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => saveEntry()} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> Save
          </button>
          <button onClick={exportEntry} className="btn-secondary flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={exportAll} className="btn-secondary flex items-center gap-1">
            <FileText className="w-4 h-4" /> All ({totalEntries})
          </button>
        </div>
      </div>
    </div>
  );
}
