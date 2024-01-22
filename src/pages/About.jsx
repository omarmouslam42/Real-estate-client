import React from 'react'
import { HelmetProvider,Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div className='container py-5 '>
      <HelmetProvider>
        <div>
          <Helmet>
            <meta />
          </Helmet>

        </div>
      </HelmetProvider>
      <h2 className='fw-bold'>About Modern Estate </h2>
      <p className='text-muted fw-semibold'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita omnis beatae, ducimus, voluptatem sed incidunt ullam tenetur error numquam voluptatibus dignissimos nemo cupiditate id? Cumque corporis enim adipisci reiciendis qui.
      </p>
      <p className='text-muted fw-semibold'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita omnis beatae, ducimus, voluptatem sed incidunt ullam tenetur error numquam voluptatibus dignissimos nemo cupiditate id? Cumque corporis enim adipisci reiciendis qui.
      </p>
      <p className='text-muted fw-semibold'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita omnis beatae, ducimus, voluptatem sed incidunt ullam tenetur error numquam voluptatibus dignissimos nemo cupiditate id? Cumque corporis enim adipisci reiciendis qui.
      </p>

    </div>
  )
}
