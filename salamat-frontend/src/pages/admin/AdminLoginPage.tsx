import React from 'react'
import Layout from '../../components/layout/Layout'

const AdminLoginPage: React.FC = () => {
  return (
    <Layout showFooter={false}>
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">ورود مدیر</h1>
          <p className="text-lg text-gray-600 text-center">
            این صفحه در حال توسعه است...
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default AdminLoginPage
