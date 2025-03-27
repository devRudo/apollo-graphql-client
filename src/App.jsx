import { useState } from "react";
import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_GAMES = gql`
  query GetGames {
    games {
      id
      title
      platform
    }
  }
`;

const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      id
      title
      platform
    }
  }
`;

function App() {
  const { loading, error, data: gamesData } = useQuery(GET_GAMES);
  const [
    deleteGame,
    { loading: deletingGame, error: errorDeletingGame, data },
  ] = useMutation(DELETE_GAME, {
    refetchQueries: [GET_GAMES],
  });
  console.log(loading, error, gamesData);
  const { games } = gamesData || { games: [] };
  const [activeGame, setActiveGame] = useState(null);

  console.log(deletingGame, errorDeletingGame, data);

  return (
    <div style={{ padding: "1rem" }}>
      {activeGame ? (
        <div>
          <button onClick={() => setActiveGame(null)}>&larr; Go Back</button>
          <p>{activeGame.title}</p>
          <p>{activeGame.platform?.join(", ")}</p>
        </div>
      ) : (
        <>
          <h1>Games</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error.message}</p>
          ) : games && games?.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {games?.map((game) => {
                return (
                  <div
                    style={{
                      border: "1px solid white",
                      padding: 10,
                      borderRadius: 5,
                      width: 300,
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => {
                      setActiveGame(game);
                    }}
                  >
                    <p>{game.title}</p>
                    <p>{game.platform?.join(", ")}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGame({ variables: { id: game.id } });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <div
                style={{
                  border: "1px solid white",
                  padding: 10,
                  borderRadius: 5,
                  width: 300,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  // setActiveGame(game);
                }}
              >
                <p>+ Add New Game</p>
              </div>
            </div>
          ) : (
            <p>No games found</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
