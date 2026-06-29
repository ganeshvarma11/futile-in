import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import About from "./pages/About";
import Categories from "./pages/Categories";
import Channels from "./pages/Channels";
import Feedback from "./pages/Feedback";
import GuidePage from "./pages/GuidePage";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import { SeoUpdater } from "./seo/SeoUpdater";

type AppProps = {
  ssrPath?: string;
};

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/categories" component={Categories} />
      <Route path="/channels" component={Channels} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/guides/:slug">
        {(params) => <GuidePage slug={params.slug} />}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App({ ssrPath }: AppProps) {
  return (
    <WouterRouter ssrPath={ssrPath}>
      <ErrorBoundary>
        <Layout>
          <SeoUpdater />
          <AppRoutes />
          <Analytics />
          <SpeedInsights />
        </Layout>
      </ErrorBoundary>
    </WouterRouter>
  );
}

export default App;
