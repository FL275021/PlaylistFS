import { useApiTester } from "./hooks/useApiTester";
import Header from "./components/Header";
import Notice from "./components/Notice";
import ConnectionPanel from "./components/ConnectionPanel";
import GenresSection from "./components/GenresSection";
import PlaylistsSection from "./components/PlaylistsSection";
import TracksSection from "./components/TracksSection";
import UsersSection from "./components/UsersSection";
import ResultPanel from "./components/ResultPanel";

export default function App() {
  const api = useApiTester();

  return (
    <>
      <Header />
      <main>
        <Notice />
        <ConnectionPanel api={api} />
        <div className="sections">
          <GenresSection api={api} />
          <PlaylistsSection api={api} />
          <TracksSection api={api} />
          <UsersSection api={api} />
        </div>
        <ResultPanel api={api} />
      </main>
    </>
  );
}
