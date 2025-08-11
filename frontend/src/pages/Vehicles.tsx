import { Helmet } from 'react-helmet-async'
import { PlusIcon, TruckIcon } from '@heroicons/react/24/outline'
import { FormEvent, useEffect, useState } from 'react'
import apiClient from '@/lib/api'

type Customer = { id: string; name: string; email: string }
type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate?: string | null
  color?: string | null
  mileage?: number | null
  status: 'ACTIVE' | 'IN_SERVICE' | 'INACTIVE'
  customerId: string
  customer?: Customer
}

type ApiListResponse<T> = { success: boolean; data: T; message?: string }

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)

  // Form state
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState<number | ''>('')
  const [vin, setVin] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [color, setColor] = useState('')
  const [mileage, setMileage] = useState<number | ''>('')
  const [customerId, setCustomerId] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const statusClass = (status: Vehicle['status']) =>
    status === 'ACTIVE'
      ? 'bg-green-100 text-green-800'
      : status === 'IN_SERVICE'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800'

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [vRes, cRes] = await Promise.all([
        apiClient.get<ApiListResponse<Vehicle[]>>('/vehicles'),
        apiClient.get<ApiListResponse<Customer[]>>('/customers'),
      ])
      setVehicles(vRes.data.data)
      setCustomers(cRes.data.data)
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
    setMake('')
    setModel('')
    setYear('')
    setVin('')
    setLicensePlate('')
    setColor('')
    setMileage('')
    setCustomerId('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (vehicle: Vehicle) => {
    setEditing(vehicle)
    setMake(vehicle.make)
    setModel(vehicle.model)
    setYear(vehicle.year)
    setVin(vehicle.vin)
    setLicensePlate(vehicle.licensePlate ?? '')
    setColor(vehicle.color ?? '')
    setMileage(vehicle.mileage ?? '')
    setCustomerId(vehicle.customerId)
    setFormError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    try {
      if (!make || !model || !year || !vin || !customerId) throw new Error('Please fill required fields')
      const payload = {
        make,
        model,
        year: Number(year),
        vin,
        licensePlate: licensePlate || undefined,
        color: color || undefined,
        mileage: mileage === '' ? undefined : Number(mileage),
        customerId,
      }
      if (editing) {
        await apiClient.put(`/vehicles/${editing.id}`, payload)
      } else {
        await apiClient.post('/vehicles', payload)
      }
      await loadData()
      setIsModalOpen(false)
    } catch (e: any) {
      setFormError(e?.response?.data?.message || e?.message || 'Failed to save vehicle')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (vehicle: Vehicle) => {
    const confirmed = window.confirm(`Delete vehicle ${vehicle.make} ${vehicle.model}?`)
    if (!confirmed) return
    try {
      await apiClient.delete(`/vehicles/${vehicle.id}`)
      await loadData()
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete vehicle')
    }
  }

  const handleStatusChange = async (vehicle: Vehicle, status: Vehicle['status']) => {
    try {
      await apiClient.patch(`/vehicles/${vehicle.id}/status`, { status })
      await loadData()
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <>
      <Helmet>
        <title>Vehicles - Car Shop Management</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                <TruckIcon className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vehicles</h1>
            </div>
            <p className="mt-1 text-sm text-gray-700">Manage customer vehicles and service history.</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Vehicle
          </button>
        </div>

        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Vehicle List</h3>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6 text-gray-600">Loading...</div>
            ) : error ? (
              <div className="p-6 text-red-600">{error}</div>
            ) : vehicles.length === 0 ? (
              <div className="p-6 text-gray-600">No vehicles yet.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">VIN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </div>
                        {vehicle.licensePlate ? (
                          <div className="text-xs text-gray-500">Plate: {vehicle.licensePlate}</div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{vehicle.vin}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vehicle.customer?.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`text-xs rounded-full px-2.5 py-1 font-medium ${statusClass(vehicle.status)}`}
                          value={vehicle.status}
                          onChange={(e) => handleStatusChange(vehicle, e.target.value as Vehicle['status'])}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="IN_SERVICE">In Service</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-4" onClick={() => openEditModal(vehicle)}>
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(vehicle)}>
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
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{editing ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formError ? <div className="sm:col-span-2 text-red-600 text-sm">{formError}</div> : null}

              <div>
                <label className="block text-sm font-medium text-gray-700">Make</label>
                <input className="mt-1 w-full rounded-md border-gray-300" value={make} onChange={(e) => setMake(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input className="mt-1 w-full rounded-md border-gray-300" value={model} onChange={(e) => setModel(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input type="number" className="mt-1 w-full rounded-md border-gray-300" value={year} onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">VIN</label>
                <input className="mt-1 w-full rounded-md border-gray-300 font-mono" value={vin} onChange={(e) => setVin(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Plate</label>
                <input className="mt-1 w-full rounded-md border-gray-300" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input className="mt-1 w-full rounded-md border-gray-300" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mileage</label>
                <input type="number" min={0} className="mt-1 w-full rounded-md border-gray-300" value={mileage} onChange={(e) => setMileage(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Optional" />
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

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" className="btn" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}