'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  vote_average: number;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [popularityFilter, setPopularityFilter] = useState('');

  const API_KEY = 'd29e79bb675e164fc1f28decd659e21c';
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    fetchMovies(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=1`);
  }, []);

  async function fetchMovies(url: string) {
    const response = await fetch(url);
    const data = await response.json();
    setMovies(data.results);
  }

  function applyFilters() {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc`;

    if (ratingFilter === 'high') url += '&vote_average.gte=7.5';
    if (ratingFilter === 'medium') url += '&vote_average.gte=5&vote_average.lte=7.4';
    if (ratingFilter === 'low') url += '&vote_average.lte=5';

    if (yearFilter) url += `&primary_release_year=${yearFilter}`;

    if (popularityFilter === 'high') url += '&sort_by=popularity.desc';
    if (popularityFilter === 'low') url += '&sort_by=popularity.asc';

    fetchMovies(url);
  }

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchQuery(query);

    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=pt-BR`)
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }

  return (
    <div className="p-4 bg-s-950 bg-slate-950">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-white">🎬 Filmes em Cartaz</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar filme..."
            value={searchQuery}
            onChange={handleSearchInput}
            className="p-2 border rounded w-full md:w-1/4 text-white"
          />

          <select value={ratingFilter} onChange={(e) => { setRatingFilter(e.target.value); applyFilters(); }} className="p-2 border rounded w-full md:w-1/4 text-red-600">
            <option value="">Filtrar por avaliação</option>
            <option value="high">Mais avaliados</option>
            <option value="low">Menos avaliados</option>
            <option value="medium">Mediamente avaliados</option>
          </select>

          <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); applyFilters(); }} className="p-2 border rounded w-full md:w-1/4 text-red-600">
            <option value="">Filtrar por ano</option>
            <option value="2025">Lançados em 2025</option>
            <option value="2024">Lançados em 2024</option>
          </select>

          <select value={popularityFilter} onChange={(e) => { setPopularityFilter(e.target.value); applyFilters(); }} className="p-2 border rounded w-full md:w-1/4 text-red-600">
            <option value="">Filtrar por popularidade</option>
            <option value="high">Mais populares</option>
            <option value="low">Menos populares</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link href={`/filme/${movie.id}`} key={movie.id} className="border rounded p-4 shadow-md bg-white hover:shadow-lg transition">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto mb-2 rounded"
            />
            <h3 className="text-lg font-semibold mb-1">{movie.title}</h3>
            <p className="text-sm text-gray-700">Nota: {movie.vote_average}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}