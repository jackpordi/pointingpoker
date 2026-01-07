import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "pages/home";
import { NotFound } from "pages/NotFound";
import { Room } from "pages/room";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
