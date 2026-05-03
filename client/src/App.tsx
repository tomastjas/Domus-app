import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DomusHome from "./pages/DomusHome";
import Estudos from "./pages/Estudos";
import Diario from "./pages/Diario";
import Comunidade from "./pages/Comunidade";
import Musicas from "./pages/Musicas";
import Sobre from "./pages/Sobre";
import SolicitarAcesso from "./pages/SolicitarAcesso";
import Admin from "./pages/Admin";
import Agenda from "./pages/Agenda";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={DomusHome} />
      <Route path={"/estudos"} component={Estudos} />
      <Route path={"/diario"} component={Diario} />
      <Route path={"/comunidade"} component={Comunidade} />
      <Route path={"/musicas"} component={Musicas} />
      <Route path={"/sobre"} component={Sobre} />
      <Route path={"/solicitar-acesso"} component={SolicitarAcesso} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/agenda"} component={Agenda} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
