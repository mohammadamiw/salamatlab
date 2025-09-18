import React from 'react'
import Layout from '../../components/layout/Layout'

const CompleteProfilePage: React.FC = () => {
  return (
    <Layout showFooter={false}>
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">تکمیل پروفایل</h1>
          <p className="text-lg text-gray-600">
            این صفحه در حال توسعه است...
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default CompleteProfilePage
