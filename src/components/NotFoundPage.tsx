import React from 'react';
import { Home, Search } from 'lucide-react';
import { navigateToAppPage } from '../constants/pages';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-lg w-full text-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">
          That link does not match a page on Synergy Travels & Tour. Head home or open the
          comparison search instead.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigateToAppPage('home')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 font-semibold"
          >
            <Home className="h-4 w-4" />
            Home
          </button>
          <button
            type="button"
            onClick={() => navigateToAppPage('compare')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 text-slate-700 px-5 py-3 font-semibold hover:bg-slate-50"
          >
            <Search className="h-4 w-4" />
            Compare prices
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
