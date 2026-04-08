/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Lesson } from './pages/Lesson';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Achievements } from './pages/Achievements';
import { Learn } from './pages/Learn';
import { About } from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/learn" replace />} />
          <Route path="learn" element={<Learn />} />
          <Route path="lesson" element={<Lesson />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
