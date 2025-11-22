import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    Timestamp,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type {
    Asset,
    AssetCategory,
    AssetIssue,
    StockItem,
    PurchaseRequest,
    MaintenanceRecord,
    DepartmentAllocation
} from '@/types'

const ASSETS_COLLECTION = 'assets'
const CATEGORIES_COLLECTION = 'asset_categories'
const ISSUES_COLLECTION = 'asset_issues'
const STOCK_COLLECTION = 'stock_items'
const PURCHASE_COLLECTION = 'purchase_requests'
const MAINTENANCE_COLLECTION = 'maintenance_records'
const DEPARTMENTS_COLLECTION = 'asset_departments'

// --- Assets ---
export async function createAsset(asset: Omit<Asset, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, ASSETS_COLLECTION), {
            ...asset,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        })
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create asset: ${error.message}`)
    }
}

export async function updateAsset(id: string, data: Partial<Asset>): Promise<void> {
    try {
        const docRef = doc(db, ASSETS_COLLECTION, id)
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        })
    } catch (error: any) {
        throw new Error(`Failed to update asset: ${error.message}`)
    }
}

export async function deleteAsset(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, ASSETS_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete asset: ${error.message}`)
    }
}

export function subscribeToAssets(callback: (assets: Asset[]) => void): Unsubscribe {
    const q = query(collection(db, ASSETS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const assets: Asset[] = []
        snapshot.forEach((doc) => {
            assets.push({ id: doc.id, ...doc.data() } as unknown as Asset)
        })
        callback(assets)
    })
}

// --- Categories ---
export async function createCategory(category: Omit<AssetCategory, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), category)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create category: ${error.message}`)
    }
}

export async function deleteCategory(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, CATEGORIES_COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete category: ${error.message}`)
    }
}

export function subscribeToCategories(callback: (categories: AssetCategory[]) => void): Unsubscribe {
    const q = query(collection(db, CATEGORIES_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const categories: AssetCategory[] = []
        snapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() } as unknown as AssetCategory)
        })
        callback(categories)
    })
}

// --- Issues ---
export async function createIssue(issue: Omit<AssetIssue, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, ISSUES_COLLECTION), issue)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create issue record: ${error.message}`)
    }
}

export async function updateIssue(id: string, data: Partial<AssetIssue>): Promise<void> {
    try {
        const docRef = doc(db, ISSUES_COLLECTION, id)
        await updateDoc(docRef, data)
    } catch (error: any) {
        throw new Error(`Failed to update issue record: ${error.message}`)
    }
}

export function subscribeToIssues(callback: (issues: AssetIssue[]) => void): Unsubscribe {
    const q = query(collection(db, ISSUES_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const issues: AssetIssue[] = []
        snapshot.forEach((doc) => {
            issues.push({ id: doc.id, ...doc.data() } as unknown as AssetIssue)
        })
        callback(issues)
    })
}

// --- Stock ---
export async function createStockItem(item: Omit<StockItem, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, STOCK_COLLECTION), item)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create stock item: ${error.message}`)
    }
}

export async function updateStockItem(id: string, data: Partial<StockItem>): Promise<void> {
    try {
        const docRef = doc(db, STOCK_COLLECTION, id)
        await updateDoc(docRef, data)
    } catch (error: any) {
        throw new Error(`Failed to update stock item: ${error.message}`)
    }
}

export function subscribeToStock(callback: (items: StockItem[]) => void): Unsubscribe {
    const q = query(collection(db, STOCK_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const items: StockItem[] = []
        snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as unknown as StockItem)
        })
        callback(items)
    })
}

// --- Purchase Requests ---
export async function createPurchaseRequest(request: Omit<PurchaseRequest, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, PURCHASE_COLLECTION), request)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create purchase request: ${error.message}`)
    }
}

export async function updatePurchaseRequest(id: string, data: Partial<PurchaseRequest>): Promise<void> {
    try {
        const docRef = doc(db, PURCHASE_COLLECTION, id)
        await updateDoc(docRef, data)
    } catch (error: any) {
        throw new Error(`Failed to update purchase request: ${error.message}`)
    }
}

export function subscribeToPurchaseRequests(callback: (requests: PurchaseRequest[]) => void): Unsubscribe {
    const q = query(collection(db, PURCHASE_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const requests: PurchaseRequest[] = []
        snapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() } as unknown as PurchaseRequest)
        })
        callback(requests)
    })
}

// --- Maintenance ---
export async function createMaintenanceRecord(record: Omit<MaintenanceRecord, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, MAINTENANCE_COLLECTION), record)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create maintenance record: ${error.message}`)
    }
}

export async function updateMaintenanceRecord(id: string, data: Partial<MaintenanceRecord>): Promise<void> {
    try {
        const docRef = doc(db, MAINTENANCE_COLLECTION, id)
        await updateDoc(docRef, data)
    } catch (error: any) {
        throw new Error(`Failed to update maintenance record: ${error.message}`)
    }
}

export function subscribeToMaintenance(callback: (records: MaintenanceRecord[]) => void): Unsubscribe {
    const q = query(collection(db, MAINTENANCE_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const records: MaintenanceRecord[] = []
        snapshot.forEach((doc) => {
            records.push({ id: doc.id, ...doc.data() } as unknown as MaintenanceRecord)
        })
        callback(records)
    })
}

// --- Departments ---
export async function createDepartment(dept: Omit<DepartmentAllocation, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, DEPARTMENTS_COLLECTION), dept)
        return docRef.id
    } catch (error: any) {
        throw new Error(`Failed to create department: ${error.message}`)
    }
}

export function subscribeToDepartments(callback: (depts: DepartmentAllocation[]) => void): Unsubscribe {
    const q = query(collection(db, DEPARTMENTS_COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const depts: DepartmentAllocation[] = []
        snapshot.forEach((doc) => {
            depts.push({ id: doc.id, ...doc.data() } as unknown as DepartmentAllocation)
        })
        callback(depts)
    })
}
