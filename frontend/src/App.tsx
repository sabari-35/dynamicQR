import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import CreateQR from "./pages/CreateQR"
import QRCodeAnalytics from "./pages/QRCodeAnalytics"
import ProtectedRoute from "./components/ProtectedRoute"
import Navigation from "./components/Navigation"
import Pricing from "./pages/Pricing"
import EditQR from "./pages/EditQR"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans text-foreground selection:bg-accent selection:text-white">
        <Navigation />
        <main className="flex-1 w-full flex flex-col items-center">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <CreateQR />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics/:id" 
                element={
                  <ProtectedRoute>
                    <QRCodeAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditQR />
                  </ProtectedRoute>
                } 
              />
              <Route path="/pricing" element={<Pricing />} />
            </Routes>
        </main>
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  )
}

export default App
