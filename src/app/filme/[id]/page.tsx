import { notFound } from 'next/navigation';

interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

interface VideoResult {
  results: { key: string; type: string; site: string }[];
}

async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  const API_KEY = 'd29e79bb675e164fc1f28decd659e21c';
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
  if (!res.ok) return null;
  return res.json();
}

async function getMovieVideo(id: string): Promise<string | null> {
  const API_KEY = 'd29e79bb675e164fc1f28decd659e21c';
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=pt-BR`);
  if (!res.ok) return null;
  const data: VideoResult = await res.json();
  const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer ? trailer.key : null;
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id);
  const trailerKey = await getMovieVideo(params.id);

  if (!movie) return notFound();

  return (
    <div className="p-6 bg-slate-950">
      <h1 className="text-4xl font-bold mb-6 text-center text-slate-50">{movie.title}</h1>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded shadow-md"
        />

        <div className="flex-1 space-y-3 text-slate-50">
          <p><span className="font-semibold">Lançamento:</span> {movie.release_date}</p>
          <p><span className="font-semibold">Nota:</span> {movie.vote_average}</p>
          <p><span className="font-semibold">Gêneros:</span> {movie.genres.map(g => g.name).join(', ')}</p>
          <div>
            <p className="font-semibold mb-1">Sinopse:</p>
            <p className="text-justify text-gray-50">{movie.overview}</p>
          </div>
        </div>
      </div>

      {trailerKey ? (
        <div className="aspect-video">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="YouTube trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-96 rounded shadow-md"
          ></iframe>
        </div>
      ) : (
        <p className="text-center">Trailer indisponível.</p>
      )}
    </div>
  );
}
