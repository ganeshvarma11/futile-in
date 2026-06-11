import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import About from "./pages/About";
import Categories from "./pages/Categories";
import GuidePage from "./pages/GuidePage";
import Home from "./pages/Home";
import Method from "./pages/Method";
import Privacy from "./pages/Privacy";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/categories" component={Categories} />
      <Route path="/method" component={Method} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/guides/:slug">
        {(params) => <GuidePage slug={params.slug} />}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Router />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
