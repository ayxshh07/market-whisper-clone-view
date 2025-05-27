
import { useState } from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeySetup = ({ onApiKeySet, currentApiKey }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showInput, setShowInput] = useState(!currentApiKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setShowInput(false);
      localStorage.setItem('alpha_vantage_api_key', apiKey.trim());
    }
  };

  if (!showInput && currentApiKey) {
    return (
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">API Key configured</span>
          </div>
          <button
            onClick={() => setShowInput(true)}
            className="text-sm text-slate-400 hover:text-white"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-700 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Key className="h-4 w-4 text-yellow-400" />
        <span className="font-medium">Configure API Key for Real Market Data</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Alpha Vantage API key"
            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <a
            href="https://www.alphavantage.co/support/#api-key"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>Get free API key</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium"
          >
            Save API Key
          </button>
        </div>
      </form>
      
      <p className="text-xs text-slate-400 mt-2">
        Free tier: 25 requests per day, 5 requests per minute. Stored locally in your browser.
      </p>
    </div>
  );
};

export default ApiKeySetup;
