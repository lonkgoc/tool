import { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, DownloadCloud } from 'lucide-react';

interface BookSummary {
  id: string;
  title: string;
  author: string;
  genre: string;
  date: string;
  keyPoints: string[];
  summary: string;
  rating: number;
  status: 'reading' | 'completed' | 'want-to-read';
}

export default function BookSummary() {
  const [books, setBooks] = useState<BookSummary[]>(() => {
    const saved = localStorage.getItem('bookSummaries');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCreating, setIsCreating] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookSummary | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'reading' as const,
    rating: 5,
    summary: '',
    keyPoints: '',
  });

  useEffect(() => {
    localStorage.setItem('bookSummaries', JSON.stringify(books));
  }, [books]);

  const createBook = () => {
    if (!formData.title.trim() || !formData.author.trim()) return;

    const keyPoints = formData.keyPoints
      .split('\n')
      .map(p => p.trim())
      .filter(p => p);

    const book: BookSummary = {
      id: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      date: new Date().toISOString().split('T')[0],
      keyPoints,
      summary: formData.summary,
      rating: formData.rating,
      status: formData.status,
    };

    setBooks([book, ...books]);
    setFormData({
      title: '',
      author: '',
      genre: '',
      status: 'reading',
      rating: 5,
      summary: '',
      keyPoints: '',
    });
    setSelectedBook(book);
    setIsCreating(false);
  };

  const updateBook = (id: string, updates: Partial<BookSummary>) => {
    setBooks(books.map(b => (b.id === id ? { ...b, ...updates } : b)));
    if (selectedBook?.id === id) {
      setSelectedBook({ ...selectedBook, ...updates });
    }
  };

  const deleteBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
    if (selectedBook?.id === id) {
      setSelectedBook(null);
    }
  };

  const stats = {
    total: books.length,
    completed: books.filter(b => b.status === 'completed').length,
    reading: books.filter(b => b.status === 'reading').length,
    wantToRead: books.filter(b => b.status === 'want-to-read').length,
    avgRating: books.length > 0 ? parseFloat((books.reduce((sum, b) => sum + b.rating, 0) / books.length).toFixed(1)) : 0,
  };

  const exportSummaries = () => {
    const dataStr = JSON.stringify(books, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `book-summaries-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-3">
        {/* Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 rounded-lg space-y-2">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Total Books</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.reading}</div>
            <div className="text-xs text-yellow-700 dark:text-yellow-300">Reading</div>
          </div>
          {stats.avgRating > 0 && (
            <div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                ⭐ {stats.avgRating}
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300">Avg Rating</div>
            </div>
          )}
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedBook(null);
          }}
          className="btn-primary w-full"
        >
          <Plus className="w-4 h-4" /> New Book
        </button>

        {/* Export Button */}
        <button
          onClick={exportSummaries}
          disabled={books.length === 0}
          className="w-full px-4 py-2 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <DownloadCloud className="w-4 h-4" /> Export
        </button>

        {/* Books List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-h-96 overflow-y-auto">
          {books.length === 0 ? (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
              No books yet
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {books.map(book => (
                <button
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    selectedBook?.id === book.id
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : ''
                  }`}
                >
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                    {book.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {book.author}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {book.status === 'completed' ? '✓ Completed' : book.status === 'reading' ? '📖 Reading' : '📋 Want to Read'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {isCreating ? (
          /* Create Form */
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Add New Book</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Book title"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="e.g., Fiction, Science"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="input-field"
                >
                  <option value="want-to-read">Want to Read</option>
                  <option value="reading">Reading</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Overall summary of the book..."
                className="input-field resize-none h-28"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Key Points (one per line)
              </label>
              <textarea
                value={formData.keyPoints}
                onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                placeholder="- Main idea 1&#10;- Main idea 2&#10;- Main idea 3"
                className="input-field resize-none h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rating: {formData.rating}/10
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={createBook} className="btn-primary flex-1">
                Save Book
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : selectedBook ? (
          /* Book View */
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedBook.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">by {selectedBook.author}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreating(true)}
                  className="btn-secondary text-sm"
                >
                  <Plus className="w-4 h-4" /> New
                </button>
                <button
                  onClick={() => deleteBook(selectedBook.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Book Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">Genre</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {selectedBook.genre || 'Not specified'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Rating</p>
                <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                  ⭐ {selectedBook.rating}/10
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={selectedBook.status}
                onChange={(e) => updateBook(selectedBook.id, { status: e.target.value as any })}
                className="input-field"
              >
                <option value="want-to-read">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Summary</h3>
              <textarea
                value={selectedBook.summary}
                onChange={(e) => updateBook(selectedBook.id, { summary: e.target.value })}
                placeholder="Book summary..."
                className="input-field resize-none h-24"
              />
            </div>

            {/* Key Points */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Key Points</h3>
              {selectedBook.keyPoints.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">No key points yet</p>
              ) : (
                <ul className="space-y-2">
                  {selectedBook.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-blue-500 dark:text-blue-400 font-bold flex-shrink-0">•</span>
                      <span className="text-slate-700 dark:text-slate-300">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Added: {new Date(selectedBook.date).toLocaleDateString()}
            </p>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
              No Book Selected
            </p>
            <p className="text-slate-500 dark:text-slate-500">
              Create a new book summary or select one from the list to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
