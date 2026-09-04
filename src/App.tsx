import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinancialDataProvider } from './data/financialContext';
import AppLayout from './components/layout/AppLayout';
import CommandCenter from './pages/CommandCenter';
import InvestigationInbox from './pages/InvestigationInbox';
import InvestigationWorkspace from './pages/InvestigationWorkspace';
import EvidenceGraphPage from './pages/EvidenceGraphPage';
import ResolutionCenter from './pages/ResolutionCenter';
import ExecutiveStoryboard from './pages/ExecutiveStoryboard';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <FinancialDataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/inbox" element={<InvestigationInbox />} />
            <Route path="/investigations" element={<InvestigationWorkspace />} />
            <Route path="/evidence" element={<EvidenceGraphPage />} />
            <Route path="/resolution" element={<ResolutionCenter />} />
            <Route path="/reports" element={<ExecutiveStoryboard />} />
            <Route path="/storyboard" element={<ExecutiveStoryboard />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Fallback to Command Center */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinancialDataProvider>
  );
}

export default App;
