import { Helmet } from 'react-helmet-async'
import { PlusIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import apiClient from '@/lib/api'

type Customer = { id: string; name: string; email: string }
type Vehicle = { id: string; make: string; model: string; year: number; customerId: string }
type Service = {
  id: string
  type: string
  description?: string | null
  cost: number | string
  scheduledAt: string
  completedAt?: string | null
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  customerId: string
  vehicleId: string
  customer?: Customer
  vehicle?: Vehicle
}

type ApiListResponse<T> = { success: boolean; data: T; message?: string }

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)

  // Form state
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState<number | ''>('')
  const [scheduledAt, setScheduledAt] = useState('') // yyyy-MM-ddTHH:mm
  const [customerId, setCustomerId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const vehiclesForCustomer = useMemo(
    () => vehicles.filter((v) => (customerId ? v.customerId === customerId : true)),
    [vehicles, customerId]
  )

  const statusClass = (status: Service['status']) =>
    status === 'COMPLETED'
      ? 'bg-green-100 text-green-800'
      : status === 'IN_PROGRESS'
      ? 'bg-yellow-100 text-yellow-800'
      : status === 'CANCELLED'
      ? 'bg-red-100 text-red-800'
      : 'bg-blue-100 text-blue-800'

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [sRes, cRes, vRes] = await Promise.all([
        apiClient.get<ApiListResponse<Service[]>>('/services'),
        apiClient.get<ApiListResponse<Customer[]>>('/customers'),
        apiClient.get<ApiListResponse<Vehicle[]>>('/vehicles'),
      ])
      setServices(sRes.data.data)
      setCustomers(cRes.data.data)
      setVehicles(vRes.data.data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openCreateModal = () => {
    setEditing(null)
    setType('')
    setDescription('')
    setCost('')
    setScheduledAt('')
    setCustomerId('')
    setVehicleId('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (service: Service) => {
    setEditing(service)
    setType(service.type)
    setDescription(service.description ?? '')
    setCost(typeof service.cost === 'string' ? Number(service.cost) : service.cost)
    // Convert to local datetime-local format
    const dt = new Date(service.scheduledAt)
    const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
    setScheduledAt(local.toISOString().slice(0, 16))
    setCustomerId(service.customerId)
    setVehicleId(service.vehicleId)
    setFormError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    try {
      if (!type || !scheduledAt || !customerId || !vehicleId) throw new Error('Please fill required fields')
      const payload = {
        type,
        description: description || undefined,
        cost: cost === '' ? 0 : Number(cost),
        scheduledAt: new Date(scheduledAt).toISOString(),
        customerId,
        vehicleId,
      }
      if (editing) {
        await apiClient.put(`/services/${editing.id}`, payload)
      } else {
        await apiClient.post('/services', payload)
      }
      await loadData()
      setIsModalOpen(false)
    } catch (e: any) {
      setFormError(e?.response?.data?.message || e?.message || 'Failed to save service')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm(`Delete service "${service.type}"?`)
    if (!confirmed) return
    try {
      await apiClient.delete(`/services/${service.id}`)
      await loadData()
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete service')
    }
  }

  const handleStatusChange = async (service: Service, status: Service['status']) => {
    try {
      await apiClient.patch(`/services/${service.id}/status`, { status })
      await loadData()
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <>
      <Helmet>
        <title>Services - Car Shop Management</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                <WrenchScrewdriverIcon className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Services</h1>
            </div>
            <p className="mt-1 text-sm text-gray-700">Manage service appointments and track service history.</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Schedule Service
          </button>
        </div>

        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Service Appointments</h3>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6 text-gray-600">Loading...</div>
            ) : error ? (
              <div className="p-6 text-red-600">{error}</div>
            ) : services.length === 0 ? (
              <div className="p-6 text-gray-600">No services yet.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Service Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {service.vehicle ? `${service.vehicle.year} ${service.vehicle.make} ${service.vehicle.model}` : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.customer?.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(service.scheduledAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`text-xs rounded-full px-2.5 py-1 font-medium ${statusClass(service.status)}`}
                          value={service.status}
                          onChange={(e) => handleStatusChange(service, e.target.value as Service['status'])}
                        >
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{typeof service.cost === 'string' ? service.cost : `$${service.cost.toFixed(2)}`}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-4" onClick={() => openEditModal(service)}>
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(service)}>
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
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{editing ? 'Edit Service' : 'Schedule Service'}</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formError ? <div className="sm:col-span-2 text-red-600 text-sm">{formError}</div> : null}

              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <input className="mt-1 w-full rounded-md border-gray-300" value={type} onChange={(e) => setType(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost</label>
                <input type="number" min={0} step={0.01} className="mt-1 w-full rounded-md border-gray-300" value={cost} onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))} required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea className="mt-1 w-full rounded-md border-gray-300" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scheduled At</label>
                <input type="datetime-local" className="mt-1 w-full rounded-md border-gray-300" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select className="mt-1 w-full rounded-md border-gray-300" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                  <option value="" disabled>
                    Select customer
                  </option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                <select className="mt-1 w-full rounded-md border-gray-300" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required>
                  <option value="" disabled>
                    Select vehicle
                  </option>
                  {vehiclesForCustomer.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" className="btn" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}