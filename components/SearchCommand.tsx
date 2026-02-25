import { useState, useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Loader2, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  symbol: string;
  description: string;
  displaySymbol?: string;
  type?: string;
}

export default function SearchCommand({renderAs = 'button', label = 'Add stock', initialStocks = []}:{renderAs?:'button'|'text', label:string, initialStocks?:SearchResult[]}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<SearchResult[]>(initialStocks || []);
  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);   

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);


    const handleSearch = async () => {
      if (!isSearchMode) {
        setStocks(initialStocks);
        return;
      }
      setLoading(true);
      try {
        const result = await searchStocks(searchTerm.trim());
        setStocks(result as unknown as SearchResult[]);
      } catch (error) {
        console.error('Search error:', error);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

  const debounceSearch = useDebounce(handleSearch, 500);
  useEffect(() => {
    debounceSearch();
  }, [searchTerm]);

  const handleSelectStock = (stock: SearchResult) => {
    
    setOpen(false);
    setSearchTerm('');
    setStocks(initialStocks)
  };

  const openDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
    {renderAs === 'text' ? (
        <button 
          className="cursor-pointer hover:text-green-400 transition-colors"
          onClick={openDialog}
          type="button"
        >
          {label}
        </button>
      ):(
        <Button 
          variant="outline" 
          onClick={openDialog}
          type="button"
          className='search-btn'
        >
          {label}
        </Button>
      )}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 border border-white/10 bg-neutral-900/98 backdrop-blur-2xl shadow-2xl lg:min-w-200 fixed top-10 left-1/2 -translate-x-1/2 translate-y-10 rounded-3xl">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
        
        <DialogTitle className="sr-only">Search Stocks</DialogTitle>
        <Command className="bg-transparent relative z-10">
          <div className='relative border-b border-white/10 bg-linear-to-r from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm'>
              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <CommandInput
                placeholder="Search stocks by name or symbol..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="text-white placeholder:text-gray-500 bg-transparent! border-0 focus:ring-0 text-base h-16 pl-12 pr-12"
              />
              
              {/* Loading Spinner */}
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className='h-5 w-5 text-emerald-400 animate-spin'/>
                </div>
              )}
              
              {/* Keyboard Shortcut Hint */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-xs text-gray-500">
                <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10">ESC</kbd>
              </div>
            </div>
            
              <CommandList className='bg-transparent! max-h-125 overflow-y-auto'>
            {loading ? (
                <CommandEmpty className='bg-transparent! border-0'>
                  <div className="flex flex-col items-center gap-4 py-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                      <Loader2 className="relative h-12 w-12 animate-spin text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-300 font-medium">Searching stocks...</p>
                      <p className="text-sm text-gray-500 mt-1">Finding the best matches</p>
                    </div>
                  </div>
                </CommandEmpty>
            ) : displayStocks?.length === 0 ? (
                <div className='py-12 text-center'>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className='text-gray-400 font-medium'>
                    {isSearchMode ? 'No stocks found' : 'Start typing to search'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {isSearchMode ? 'Try a different search term' : 'Search by company name or symbol'}
                  </p>
                </div>
            ) : (
                <ul className="p-2">
                  <div className='sticky top-0 z-10 mb-3 px-4 py-3 bg-linear-to-r from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl text-gray-300 border-b border-white/5 rounded-xl shadow-lg flex items-center justify-between'>
                      <div className="flex items-center gap-2">
                        {isSearchMode ? (
                          <>
                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Search Results</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                            <span className="font-semibold">Trending Stocks</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-semibold border border-emerald-500/20">
                        {displayStocks?.length || 0}
                      </span>
                    </div>
                    
                    {displayStocks?.map((stock,i)=>(
                        <li key={`${stock.symbol}-${i}`} className='mb-2 last:mb-0'>
                            <Link 
                              href={`/stocks/${stock.symbol}`} 
                              onClick={handleSelectStock.bind(null, stock)} 
                              className='group relative flex items-center gap-4 py-4 px-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 bg-white/0 hover:bg-white/5 transition-all duration-300 overflow-hidden'
                            >
                              {/* Hover Gradient Effect */}
                              <div className="absolute inset-0 bg-linear-to-r from-emerald-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-emerald-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500"></div>
                              
                              {/* Stock Icon */}
                              <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/15 via-teal-500/15 to-blue-500/15 flex items-center justify-center group-hover:from-emerald-500/25 group-hover:to-blue-500/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                                <TrendingUp className='h-6 w-6 text-emerald-400 transition-transform duration-300'/>
                                <div className="absolute inset-0 bg-linear-to-br from-emerald-400/20 to-blue-400/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                              </div>
                              
                              {/* Stock Info */}
                              <div className='flex-1 relative z-10'>
                                <div className="font-semibold text-base text-white group-hover:text-emerald-300 transition-colors duration-300 mb-0.5">{stock.description}</div>
                                <div className='flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300'>
                                  <span className="font-mono font-semibold text-emerald-400">{stock.symbol}</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                  <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">{stock.type}</span>
                                </div>
                              </div>
                              
                              {/* Star Icon */}
                              <Star className="relative z-10 h-5 w-5 text-gray-600 group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"/>
                            </Link>
                        </li>
                    ))}
                </ul>
            )
            }
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
    </>
  );
}

