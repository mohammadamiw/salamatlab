import React from 'react'
import Layout from '../components/layout/Layout'

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">درباره ما</h1>
          <p className="text-lg text-gray-600">
            این صفحه در حال توسعه است...
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage
