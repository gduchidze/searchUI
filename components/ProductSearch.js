import React, { useState } from 'react';
import { Search } from 'lucide-react';

const ProductSearch = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [corsStatus, setCorsStatus] = useState('');
  const [corsError, setCorsError] = useState('');

  const testConnection = async () => {
    try {
      setCorsStatus('ტესტირება...');
      setCorsError('');

      const response = await fetch('http://localhost:8000/debug-cors', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      setCorsStatus(`კავშირი წარმატებულია: ${data.message}`);
    } catch (err) {
      setCorsError(`კავშირი ვერ დამყარდა: ${err.message}`);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const url = `http://localhost:8000/organizations/org_0a5d5f1e/products/search?query=${encodeURIComponent(query)}`;
      console.log('Requesting URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.results) {
        setProducts(data.results);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error details:', error);
      setError('შეცდომა მოხდა მონაცემების მიღებისას');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* CORS Test Section */}
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-medium mb-4">API კავშირის ტესტი</h2>
        <button
          onClick={testConnection}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          სერვერთან კავშირის ტესტი
        </button>

        {corsStatus && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded">
            {corsStatus}
          </div>
        )}

        {corsError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
            {corsError}
          </div>
        )}
      </div>

      {/* Search Form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="ჩაწერეთ საძიებო სიტყვა..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
        >
          <Search size={20} />
          ძებნა
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Results Display */}
      {loading ? (
        <div className="text-center py-4">იტვირთება...</div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-medium">{product.name}</h3>
              <div className="mt-2 text-gray-600">
                ფასი: ₾{product.price}
              </div>
              {product.product_url && (
                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  პროდუქტის ნახვა
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty Results Message */}
      {!loading && !error && products.length === 0 && query && (
        <div className="text-center text-gray-500">
          პროდუქტები ვერ მოიძებნა
        </div>
      )}
    </div>
  );
};

export default ProductSearch;