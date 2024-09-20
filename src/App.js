import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts/DefaultLayout';
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from '~/themes/customTheme';
import Course from '../src/pages/Course/Course';
import Section from '../src/pages/Section/Section';
import Lesson from '../src/pages/Lesson/TextLesson';
function App() {
  return (
    <Router>
      <ChakraProvider theme={customTheme}>
        <div className="App">
          <Routes>
            <Route path="/course" element={<Course />} />
            <Route path="/section" element={<Section />} />
            <Route path="/lesson" element={<Lesson />} />
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
          </Routes>
        </div>
      </ChakraProvider>
    </Router>
  );
}

export default App;
