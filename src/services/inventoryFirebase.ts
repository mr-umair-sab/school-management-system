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
import type { Asset } from '@/types'

const COLLECTION = 'assets'

export async function createAsset(asset: Omit<Asset, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, COLLECTION), {
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
        const docRef = doc(db, COLLECTION, id)
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
        await deleteDoc(doc(db, COLLECTION, id))
    } catch (error: any) {
        throw new Error(`Failed to delete asset: ${error.message}`)
    }
}

export function subscribeToAssets(callback: (assets: Asset[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTION))
    return onSnapshot(q, (snapshot) => {
        const assets: Asset[] = []
        snapshot.forEach((doc) => {
            assets.push({ id: doc.id, ...doc.data() } as unknown as Asset)
        })
        callback(assets)
    })
}
