import MoviesList from "./MoviesList";

export default function Watched({ allMovies, refreshData }) {
  return (
    <MoviesList
      status="watched"
      allMovies={allMovies}
      refreshData={refreshData}
    />
  );
}
