import { Fragment, Suspense, useEffect, type ElementType } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { publicRoutes } from '@/routes';
import DefaultLayout from '@/layouts/DefaultLayout';
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from '@/themes/customTheme';
import NotFound from '@/components/organisms/NotFound';
import config from '@/config';
import LoaderPage from '@/components/atoms/LoaderPage';
import WebSocketService from '@/services/websocketService';
import { Provider } from 'react-redux';
import store from '@/store/store';
import ProtectedRoute from '@/components/organisms/ProtectedRoute';
import { isLoggedIn } from '@/utils/authUtils';
import userService from '@/services/userService';

interface RouteConfig {
  path: string;
  component: ElementType;
  roles?: string[];
  layout?: ElementType | null;
}

function App() {
  useEffect(() => {
    let webSocketInstance: WebSocketService;

    // Connect to WebSocket on component mount
    const initWebSocket = async () => {
      try {
        webSocketInstance = await WebSocketService.getIns();
        console.log('WebSocket connected');
      } catch (error) {
        console.error('WebSocket connection failed:', error);
      }
    };

    initWebSocket();
    return () => {
      if (webSocketInstance) {
        webSocketInstance.disconnect();
        console.log('WebSocket disconnected');
      }
    };
  }, []);

  // Ping online status every 60 seconds if logged in
  useEffect(() => {
    const pingStatus = () => {
      if (isLoggedIn()) {
        userService.pingOnlineStatus().catch((err) => {
          console.error('Failed to ping online status:', err);
        });
      }
    };

    // Initial ping when app loads
    pingStatus();

    // Setup interval
    const intervalId = setInterval(pingStatus, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Provider store={store}>
        <ChakraProvider theme={customTheme}>
          <div className="App">
            <Suspense fallback={<LoaderPage />}>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={config.routes.login} replace />}
                />

                {publicRoutes.map((route: RouteConfig) => {
                  const Page = route.component;
                  const allowedRoles = route.roles || ['ALL'];
                  let Layout: ElementType = DefaultLayout;

                  if (route.layout) {
                    Layout = route.layout;
                  } else if (route.layout === null) {
                    Layout = Fragment;
                  }

                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <ProtectedRoute allowedRoles={allowedRoles}>
                          <Layout>
                            <Page />
                          </Layout>
                        </ProtectedRoute>
                      }
                    />
                  );
                })}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </ChakraProvider>
      </Provider>
    </Router>
  );
}

export default App;
