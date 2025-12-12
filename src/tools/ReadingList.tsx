import { useState, useEffect } from 'react';
import { Book, Plus, Trash2, Check } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  read: boolean;
}

export default function ReadingList() {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('readingList');
    return saved ? JSON.parse(saved) : [];
  });
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  useEffect(() => {
    localStorage.setItem('readingList', JSON.stringify(books));
  }, [books]);

  const addBook = () => {
    if (newBook.title.trim()) {
      setBooks([...books, {
        id: Date.now().toString(),
        ...newBook,
        read: false
      }]);
      setNewBook({ title: '', author: '' });
    }
  };

  const toggleRead = (id: string) => {
    setBooks(books.map(b => b.id === id ? { ...b, read: !b.read } : b));
  };

  const deleteBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Book className="w-6 h-6" />
          <span>Reading List</span>
        </h2>

        <div className="space-y-3 mb-4">
          <input
            type="text"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            placeholder="Book title"
            className="w-full input-field"
          />
          <input
            type="text"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            placeholder="Author (optional)"
            className="w-full input-field"
          />
          <button onClick={addBook} className="btn-primary w-full flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {books.map(book => (
          <div key={book.id} className={`card flex items-center justify-between ${book.read ? 'opacity-60' : ''}`}>
            <div className="flex-1">
              <div className="font-semibold text-slate-900 dark:text-slate-100">{book.title}</div>
              {book.author && (
                <div className="text-sm text-slate-600 dark:text-slate-400">by {book.author}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleRead(book.id)}
                className={`p-2 rounded-lg ${book.read ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteBook(book.id)}
                className="p-2 rounded-lg bg-red-500 text-white"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {books.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            Your reading list is empty. Add a book to get started!
          </div>
        )}
      </div>
    </div>
  );
}


