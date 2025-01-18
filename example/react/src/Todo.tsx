import { useState } from "react";
import {
  useRegisteredQuery,
  useSetState,
  useQuery,
} from "@kiririk/react-mini-query";
import { getTodo, getTodoQueryKey, getPokemon, getPokemonKey } from "./api";

type ReponseData = {
  todos: Array<{
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
  }>;
  total: number;
  skip: number;
  limit: number;
};

export function Todo() {
  const { isFetching, data } = useRegisteredQuery<ReponseData>(getTodoQueryKey);

  if (isFetching || !data) return <div>Now Loading...</div>;

  return (
    <ul>
      {data.todos.map((todo) => (
        <li key={todo.id}>{todo.todo}</li>
      ))}
    </ul>
  );
}

export function DuplicateTodo() {
  const {
    data: { isFetching, data },
    refetch,
  } = useQuery<ReponseData>(getTodoQueryKey, () => getTodo());

  if (isFetching || !data) return <div>Now Loading...</div>;

  return (
    <>
      <ul>
        {data.todos.map((todo) => (
          <li key={todo.id}>{todo.todo}</li>
        ))}
      </ul>
      <button type="button" onClick={() => refetch()}>
        Refetch Todo
      </button>
    </>
  );
}

export function UpdateButton() {
  const [count, setCount] = useState(0);
  const { dispatch } = useSetState<ReponseData>(getTodoQueryKey);

  return (
    <button
      type="button"
      onClick={() => {
        dispatch((previous) => {
          if (!previous.data) return previous;

          const newTodos = previous.data.todos.map((todoObj, index) => {
            if (index === count) {
              return {
                ...todoObj,
                todo: "Updated Todo",
              };
            }
            return todoObj;
          });

          return {
            ...previous,
            data: {
              ...previous.data,
              todos: newTodos,
            },
          };
        });

        setCount((previous) => previous + 1);
      }}
    >
      Update Todo
    </button>
  );
}

type PokemonResponse = {
  count: number;
  next: string;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
};

export function Pokemon() {
  const {
    data: { isFetching, data },
    refetch,
  } = useQuery<PokemonResponse>(getPokemonKey, getPokemon);

  if (isFetching || !data) return <div>Now Loading Pokemon</div>;

  return (
    <>
      <ul>
        {data.results.map((poke) => (
          <li key={poke.name}>{poke.name}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          refetch();
        }}
      >
        Refetch Pokemon
      </button>
    </>
  );
}
