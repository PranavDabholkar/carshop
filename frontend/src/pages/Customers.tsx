import { Helmet } from 'react-helmet-async'
import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import apiClient from '@/lib/api'

type Customer = {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  vehicles?: Array<unknown>
  services?: Array<unknown>
}

type ApiListResponse<T> = {
  success: boolean
  data: T
  message?: string
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  // Form state
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const vehicleCountById = useMemo(
    () => Object.fromEntries(customers.map((c) => [c.id, (c.vehicles as unknown[] | undefined)?.length ?? 0])),
    [customers]
  )

  const openCreateModal = () => {
    setEditingCustomer(null)
    setName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setName(customer.name)
    setEmail(customer.email)
    setPhone(customer.phone ?? '')
    setAddress(customer.address ?? '')
    setFormError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const loadCustomers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiClient.get<ApiListResponse<Customer[]>>('/customers')
      setCustomers(res.data.data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load customers')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    try {
      if (!name || name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters')
      }
      if (!email) {
        throw new Error('Email is required')
      }

      if (editingCustomer) {
        await apiClient.put(`/customers/${editingCustomer.id}`, { name, email, phone: phone || undefined, address: address || undefined })
      } else {
        await apiClient.post('/customers', { name, email, phone: phone || undefined, address: address || undefined })
      }

      await loadCustomers()
      setIsModalOpen(false)
    } catch (e: any) {
      setFormError(e?.response?.data?.message || e?.message || 'Failed to save customer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (customer: Customer) => {
    const confirmed = window.confirm(`Delete customer "${customer.name}"?`)
    if (!confirmed) return
    try {
      await apiClient.delete(`/customers/${customer.id}`)
      await loadCustomers()
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete customer')
    }
  }

  return (
    <>
      <Helmet>
        <title>Customers - Car Shop Management</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                <UsersIcon className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customers</h1>
            </div>
            <p className="mt-1 text-sm text-gray-700">Manage your customer database and information.</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>

        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Customer List</h3>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6 text-gray-600">Loading...</div>
            ) : error ? (
              <div className="p-6 text-red-600">{error}</div>
            ) : customers.length === 0 ? (
              <div className="p-6 text-gray-600">No customers yet.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vehicles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        {customer.phone ? (
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        ) : null}
                        {customer.address ? (
                          <div className="text-sm text-gray-500">{customer.address}</div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {vehicleCountById[customer.id]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-4" onClick={() => openEditModal(customer)}>
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(customer)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {formError ? <div className="text-red-600 text-sm">{formError}</div> : null}

              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingCustomer ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}