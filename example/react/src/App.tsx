import { MiniQueryProvider } from "@kiririk/react-mini-query";
import { Todo, DuplicateTodo, UpdateButton, Pokemon } from "./Todo";
import { MiniQueryClient } from "@kiririk/mini-query-core";
import { getTodo, getTodoQueryKey } from "./api";
import "./App.css";

const client = new MiniQueryClient();
client.registerQuery(getTodoQueryKey, getTodo);

function App() {
  return (
    <MiniQueryProvider client={client}>
      <h2>Hello Todo</h2>
      <Todo />
      <UpdateButton />
      <h2>Duplicate Todo</h2>
      <DuplicateTodo />
      <h2>Hello Pokemon</h2>
      <Pokemon />
    </MiniQueryProvider>
  );
}

export default App;
