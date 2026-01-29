'use client';

import React from 'react';
import Link from 'next/link';

export default function Custom404Page() {
  return (
    <section className="min-h-screen bg-base py-10 font-avenir overflow-hidden flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="text-center">
              {/* 404 Text - Above the GIF */}
              <h1 className="text-[80px] md:text-[120px] font-bold text-primary leading-none">
                404
              </h1>

              {/* Background GIF */}
              <div
                className="-mt-10 h-[400px] md:h-[500px] w-full bg-center bg-cover bg-no-repeat"
                style={{
                  backgroundImage: 'url(/404-bg.gif)',
                }}
              />

              {/* Content Box */}
              <div className="-mt-8">
                <h3 className="text-2xl md:text-4xl font-bold text-primary mb-4">
                  Look like you're lost
                </h3>

                <p className="text-tertiary mb-6">
                  the page you are looking for not available!
                </p>

                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-secondary text-base rounded-lg hover:bg-secondary/80 transition-all duration-300 font-medium"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}