import { useState } from 'react';
import { Film, Shuffle } from 'lucide-react';

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary'];
const movies: Record<string, string[]> = {
  'Action': ['The Matrix', 'Inception', 'Mad Max: Fury Road', 'John Wick', 'The Dark Knight'],
  'Comedy': ['The Hangover', 'Superbad', 'Anchorman', 'Step Brothers', 'Borat'],
  'Drama': ['The Shawshank Redemption', 'Forrest Gump', 'The Godfather', 'Schindler\'s List', 'Pulp Fiction'],
  'Horror': ['The Exorcist', 'The Shining', 'Get Out', 'Hereditary', 'A Quiet Place'],
  'Sci-Fi': ['Blade Runner', 'Interstellar', 'Arrival', 'The Terminator', 'Alien'],
  'Romance': ['The Notebook', 'Titanic', 'Pride and Prejudice', 'La La Land', 'Before Sunrise'],
  'Thriller': ['Se7en', 'Gone Girl', 'Shutter Island', 'The Silence of the Lambs', 'Zodiac'],
  'Documentary': ['Planet Earth', 'The Act of Killing', 'Won\'t You Be My Neighbor?', 'Free Solo', '13th']
};

export default function MoviePicker() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [movie, setMovie] = useState<string | null>(null);

  const pickMovie = () => {
    if (!selectedGenre) {
      const allGenres = Object.keys(movies);
      const randomGenre = allGenres[Math.floor(Math.random() * allGenres.length)];
      const genreMovies = movies[randomGenre];
      setMovie(genreMovies[Math.floor(Math.random() * genreMovies.length)]);
      setSelectedGenre(randomGenre);
    } else {
      const genreMovies = movies[selectedGenre];
      setMovie(genreMovies[Math.floor(Math.random() * genreMovies.length)]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Film className="w-6 h-6" />
          <span>Movie Picker</span>
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Choose Genre (Optional)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre);
                  setMovie(null);
                }}
                className={`p-2 rounded-lg text-sm ${
                  selectedGenre === genre
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={pickMovie}
          className="btn-primary w-full flex items-center justify-center space-x-2 mb-6"
        >
          <Shuffle className="w-5 h-5" />
          <span>Pick a Movie</span>
        </button>

        {movie && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎬</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              {movie}
            </div>
            {selectedGenre && (
              <div className="text-sm text-blue-700 dark:text-blue-300">
                {selectedGenre} • {movies[selectedGenre].length} movies available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


