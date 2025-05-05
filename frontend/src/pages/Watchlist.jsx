import  MoviesList from "./MoviesList";

export default function Watchlist({allMovies, refreshData}) {
    return (
          <MoviesList status="watchlist" allMovies={allMovies} refreshData = {refreshData} />
      );
}