import Head from 'next/head';
import ProductSearch from '../components/ProductSearch';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Product Search</title>
        <meta name="description" content="Product search application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-8">
        <ProductSearch />
      </main>
    </div>
  );
}