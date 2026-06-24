import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import About from "./pages/About";
import Categories from "./pages/Categories";
import Channels from "./pages/Channels";
import GuidePage from "./pages/GuidePage";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/categories" component={Categories} />
      <Route path="/channels" component={Channels} />
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
        <Analytics />
        <SpeedInsights />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
