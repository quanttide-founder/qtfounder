import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Works from "./pages/Works";
import WorkDetail from "./pages/WorkDetail";

// 域名根路径部署（founder.quanttide.com，无子路径前缀）
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fictions" element={<Works type="小说" title="小说" />} />
          <Route path="/articles" element={<Works type="文章" title="文章" />} />
          <Route path="/games" element={<Works type="游戏" title="游戏" />} />
          <Route path="/tools" element={<Works type="工具" title="工具" />} />
          <Route path="/fictions/:slug" element={<WorkDetail />} />
          <Route path="/works" element={<Navigate to="/fictions" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
