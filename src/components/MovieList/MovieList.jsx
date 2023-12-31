import { NavLink, useLocation } from 'react-router-dom';
import fetchData from '../../fetchData';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import css from './MovieList.module.css';
import noPoster from '../../images/default.jpg'

export default function MovieList({ data }) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const location = useLocation();

  const searchMovies = async q => {
    setStatus('pending');
    try {
      const response = await fetchData(
        `https://api.themoviedb.org/3/search/movie?query=${q}&api_key=ee0ed139d0a1d8fcbabd26e40efda78c`
      );
      setMovies(response.results);
      setStatus('resolved');
      setError(false);
    } catch (error) {
      setError(error.message);
      setStatus('rejected');
    }
  };

  useEffect(() => {
    searchMovies(data);
  }, [data]);

  if (status === 'pending') {
    return <p>Loading...</p>;
  }
  if (status === 'rejected') {
    return <p>{error}</p>;
  }
  if (status === 'resolved') {
    return (
      <ul className={css.movieList}>
        {movies.map(movie => (
          <li key={movie.id}>
            <NavLink
              className={css.navLink}
              to={`${movie.id}`}
              state={{ from: location }}
            >
              <img
                className={css.poster}
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`: noPoster}
                alt={movie.title || movie.name}
              />
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }
}

MovieList.propTypes = {
  data: PropTypes.string.isRequired,
};
