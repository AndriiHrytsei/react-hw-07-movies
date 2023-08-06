import { useNavigate, useParams, Outlet, NavLink } from 'react-router-dom';
import fetchData from '../../../fetchData';
import { Suspense, useEffect, useState } from 'react';


export default function MovieDetails() {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const { movieId } = useParams();
  const navigate = useNavigate();

  const getMovies = async id => {
    setStatus('pending');
    try {
      const response = await fetchData(
        `https://api.themoviedb.org/3/movie/${id}?api_key=ee0ed139d0a1d8fcbabd26e40efda78c`
      );
      setError(false);
      setMovie(response);
      setStatus('resolved');
    } catch (error) {
      setError(error.message);
      setStatus('rejected');
    }
  };

  useEffect(() => {
    getMovies(movieId);
  }, [movieId]);

  if (status === 'pending') {
    <p>Loading...</p>;
  }

  if (status === 'rejected') {
    return <p>{error}</p>;
  }

  if (status === 'resolved') {
    return (
      <main className="movieDetailsContainer">
        <button type="button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_left_alt</span>
          <span>Go back</span>
        </button>
        <div className="movieDetails">
          <div className="Poster">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt=""
            />
          </div>
          <div>
            <h2>{movie.title || movie.name}</h2>
            <p>User score: {Math.round(movie.vote_average)}/10</p>
            <div>
              <h3>Overview</h3>
              <p>{movie.overview}</p>
            </div>
            <div>
              <h3>Genres</h3>
              <p>
                {movie.genres.map(genre => (
                  <span key={genre.id}>{genre.name}, </span>
                ))}
              </p>
            </div>
          </div>
        </div>
        <div className="castAndReviews">
          <p>Additional information</p>
          <ul>
            <li>
              <NavLink to="cast">Cast</NavLink>
            </li>
            <li>
              <NavLink to="reviews">Reviews</NavLink>
            </li>
          </ul>
        </div>
        <Suspense fallback={<p>Loading page...</p>}>
          <Outlet />
        </Suspense>
      </main>
    );
  }
}
