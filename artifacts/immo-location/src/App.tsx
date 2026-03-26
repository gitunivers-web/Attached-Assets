import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/context/AppContext";

// Pages
import Home from "@/pages/Home";
import Listings from "@/pages/Listings";
import Detail from "@/pages/Detail";
import Booking from "@/pages/Booking";
import Payment from "@/pages/Payment";
import Favorites from "@/pages/Favorites";
import Cart from "@/pages/Cart";
import Success from "@/pages/Success";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/appartements" component={Listings} />
      <Route path="/appartement/:id" component={Detail} />
      <Route path="/reserver/:id" component={Booking} />
      <Route path="/paiement" component={Payment} />
      <Route path="/favoris" component={Favorites} />
      <Route path="/panier" component={Cart} />
      <Route path="/confirmation" component={Success} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
