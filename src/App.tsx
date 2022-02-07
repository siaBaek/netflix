import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Movie from "./Routes/Movies/Movie";
import Search from "./Routes/Search";
import Tv from "./Routes/Tvs/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Movie />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
