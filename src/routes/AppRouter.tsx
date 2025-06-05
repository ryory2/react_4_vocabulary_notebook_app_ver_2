// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Layout from '../components/Layout';
import About from '../pages/About';
import Sample from '../pages/Sample';
import Testpage from '../pages/Testpage';
import VocablaryApp from '../pages/VocablaryApp';
import AdminPage from '../pages/AdminPage';
// import VocablaryAppSample from '../pages/VocablaryAppSample';

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Layout ルート */}
                {/* すべてのルートに共通となる「親ルート」 */}
                <Route path="/" element={<Layout />}>
                    {/* index: パスが "/" のとき */}
                    <Route index element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/sample" element={<Sample />} />
                    <Route path="/testpage" element={<Testpage />} />
                    <Route path="/vocablary-app" element={<VocablaryApp />} />
                    <Route path="/admin" element={<AdminPage />} />
                    {/* <Route path="/vocablary-app-sample" element={<VocablaryAppSample />} /> */}
                    {/* その他のパス (404) */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
