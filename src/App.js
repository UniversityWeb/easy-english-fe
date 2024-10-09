import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts/DefaultLayout';
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from '~/themes/customTheme';
import NotFound from '~/components/NotFound';

function App() {
  return (
    <Router>
      <ChakraProvider theme={customTheme}>
        <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;

              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ChakraProvider>
    </Router>
  );
}

export default App;
